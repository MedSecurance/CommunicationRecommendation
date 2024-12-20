using MedSecurance.ProtocolEvaluator.Commands.Gsm;
using MedSecurance.ProtocolEvaluator.Configuration;
using MedSecurance.ProtocolEvaluator.Evaluators.Interfaces;
using MedSecurance.ProtocolEvaluator.Models;
using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Queries;
using MedSecurance.ProtocolEvaluator.Repository.Interfaces;
using Microsoft.Extensions.Options;

namespace MedSecurance.ProtocolEvaluator.Evaluators;

public class GsmEvaluator(
    ILogger<GsmEvaluator> logger,
    IOptions<ProtocolEvaluatorConfig> protocolEvaluatorConfigOptions,
    IAdminConfigRepository adminConfigRepository)
    : IGsmEvaluator
{
    private readonly GsmConfig _gsmConfig = protocolEvaluatorConfigOptions.Value.Gsm;

    private readonly ICollection<string> _suggestions = new List<string>();

    public async Task<EvaluationResult> Evaluate(EvaluateGsmCommand command)
    {
        logger.LogInformation("Evaluating GSM");
        
        var adminConfigs =
            await adminConfigRepository.GetAdminConfigsAsync(new GetAdminConfigsQuery(Protocol.GSM));

        _gsmConfig.MeanDowntimeInMinutes =
            int.Parse(adminConfigs
                .FirstOrDefault(x => x is { Property: "MeanDowntimeInMinutes", Protocol: Protocol.GSM })?.Value!);

        _gsmConfig.MeanTimeToRepairInMinutes =
            int.Parse(adminConfigs
                .FirstOrDefault(x => x is { Property: "MeanTimeToRepairInMinutes", Protocol: Protocol.GSM })?.Value!);

        _gsmConfig.LifetimeInYears =
            int.Parse(adminConfigs
                .FirstOrDefault(x => x is { Property: "LifetimeInYears", Protocol: Protocol.GSM })?.Value!);
        
        CheckLogMonitoring(command.LogMonitoringEnabled);
        CheckGsmNodes(command);
        NetworkLifetimeSuggestions(command.LifetimeInYears);
        SecurityAuditFrequencySuggestions(command.SecurityAuditFrequencyInYears);
        RedundancyMeasuresSuggestions(command.RedundancyMeasures);
        IntrusionDetectionSuggestions(command.IntrusionDetectionSystem);
        DataPrivacyMeasuresSuggestions(command.DataPrivacyMeasures);
        NetworkFailuresSuggestions(command.NetworkFailures);

        return new EvaluationResult
        {
            Suggestions = _suggestions
        };
    }

    private void CheckLogMonitoring(bool logMonitoringEnabled)
    {
        if (!logMonitoringEnabled)
        {
            _suggestions.Add("2. Log monitoring suggestion: Need to enable log monitoring");
        }
    }

    private void CheckGsmNodes(EvaluateGsmCommand command)
    {
        logger.LogInformation("Checking GsmNodes for GSM network: {@NetworkName}",
            command.NetworkName);

        foreach (var gsmNode in command.GsmNode)
        {
            logger.LogInformation("Checking Node {@DeviceName}",
                gsmNode.DeviceName);

            FirmwareUpdatedYearSuggestions(gsmNode.FirmwareUpdatedYear, gsmNode.DeviceName);
        }
    }

    private void FirmwareUpdatedYearSuggestions(int firmwareUpdatedYear, string deviceName)
    {
        var yearDiff = DateTime.Now.Year - firmwareUpdatedYear;
        // TODO: Threshold should be configurable ??
        if (yearDiff >= 2)
            _suggestions.Add(
                $"2.2 Firmware upgrade suggestion: [{deviceName}] Your node firmware is more than {yearDiff} years old. We suggest you upgrade your firmware");
    }

    private void NetworkLifetimeSuggestions(int selectedNetworkLifetime)
    {
        var networkLifetimeThreshold = _gsmConfig.LifetimeInYears;

        if (selectedNetworkLifetime > networkLifetimeThreshold)
            _suggestions.Add(
                $"3.1 Network aging suggestion: Your network is more than {networkLifetimeThreshold} years old. Consider replacing your network.");
    }

    private void SecurityAuditFrequencySuggestions(int selectedSecurityAuditFrequency)
    {
        var securityAuditFrequencyThreshold = _gsmConfig.SecurityAuditFrequencyInYears;

        if (selectedSecurityAuditFrequency > securityAuditFrequencyThreshold)
            _suggestions.Add(
                $"4.1 Network security audit frequency: Your network security audit frequency is {selectedSecurityAuditFrequency} years which is more than {securityAuditFrequencyThreshold} year which is the recommended threshold. Consider reducing your network security audit below or equal to {securityAuditFrequencyThreshold} year(s).");
    }

    private void RedundancyMeasuresSuggestions(bool redundancyMeasures)
    {
        if (!redundancyMeasures)
            _suggestions.Add("5.1. Redundancy measure suggestion: Need to enable redundancy measures in your network.");
    }

    private void IntrusionDetectionSuggestions(bool intrusionDetectionSystem)
    {
        if (!intrusionDetectionSystem)
            _suggestions.Add(
                "6.1. Intrusion detection system suggestion: Need to deploy an intrusion detection system in your network.");
    }

    private void DataPrivacyMeasuresSuggestions(DataPrivacyMeasures selectedDataPrivacyMeasures)
    {
        if (!selectedDataPrivacyMeasures.AtRest)
            _suggestions.Add(
                "7.1. Data privacy measure suggestion: Need to enable data privacy measures for data at rest.");

        if (!selectedDataPrivacyMeasures.InTransit)
            _suggestions.Add(
                "7.2. Data privacy measure suggestion: Need to enable data privacy measures for data in transit.");
    }
    
    private void NetworkFailuresSuggestions(List<NetworkFailure> networkFailures)
    {
        if (networkFailures.Count == 0)
            return;

        var meanDowntimeThreshold = _gsmConfig.MeanDowntimeInMinutes;
        var meanTimeToRepairThreshold = _gsmConfig.MeanTimeToRepairInMinutes;
        var totalRepairTime = 0;
        var totalDowntime = 0;
        var totalFailures = networkFailures.Count;

        foreach (var failure in networkFailures)
        {
            var cause = failure.CauseOfFailure;
            var failureSuggestions = _gsmConfig.CauseOfFailure[cause];

            _suggestions.Add(
                $"15.1 For '{cause}' failure we suggest the following action(s): {string.Join(", ", failureSuggestions)}.");

            totalRepairTime += failure.TimeToRepairInMinutes;
            totalDowntime += failure.DowntimeInMinutes;
        }

        var meanTimeToRepair = totalRepairTime / totalFailures;
        var meanDowntime = totalDowntime / totalFailures;

        if (meanDowntime > meanDowntimeThreshold)
            _suggestions.Add(
                $"15.2 Your mean downtime is {meanDowntime} minutes which is above your organization threshold of '{meanDowntimeThreshold}' minutes. Consider reducing your mean downtime below the {meanDowntimeThreshold} minutes threshold.");

        if (meanTimeToRepair > meanTimeToRepairThreshold)
            _suggestions.Add(
                $"15.3 Your mean time to repair is {meanTimeToRepair} minutes which is above your organization threshold of '{meanTimeToRepairThreshold}' minutes. Consider reducing your mean time to repair below the {meanTimeToRepairThreshold} minutes threshold.");
    }
}