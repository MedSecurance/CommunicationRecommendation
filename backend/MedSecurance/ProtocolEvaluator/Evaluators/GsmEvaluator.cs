using MedSecurance.DeviceManager.Queries;
using MedSecurance.DeviceManager.Repositories.Interfaces;
using MedSecurance.ProtocolEvaluator.Commands.Gsm;
using MedSecurance.ProtocolEvaluator.Configuration;
using MedSecurance.ProtocolEvaluator.Evaluators.Interfaces;
using MedSecurance.ProtocolEvaluator.Models;
using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Models.Gsm;
using MedSecurance.ProtocolEvaluator.Models.Gsm.Enums;
using MedSecurance.ProtocolEvaluator.Queries;
using MedSecurance.ProtocolEvaluator.Repository.Interfaces;
using MedSecurance.ProtocolEvaluator.Utils;
using Microsoft.Extensions.Options;

namespace MedSecurance.ProtocolEvaluator.Evaluators;

public class GsmEvaluator(
    ILogger<GsmEvaluator> logger,
    IOptions<ProtocolEvaluatorConfig> protocolEvaluatorConfigOptions,
    IDeviceRepository deviceRepository,
    IAdminConfigRepository adminConfigRepository,
    IProtocolReplacementEvaluator protocolReplacementEvaluator)
    : IGsmEvaluator
{
    private readonly GsmConfig _gsmConfig = protocolEvaluatorConfigOptions.Value.Gsm;

    private readonly ICollection<EvaluationSuggestion> _mitigationSuggestions = new List<EvaluationSuggestion>();
    private readonly ICollection<EvaluationSuggestion> _safeConfigSuggestions = new List<EvaluationSuggestion>();

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

        var gsmDevices = await deviceRepository.GetAllDevicesAsync(new GetDevicesQuery(
            Protocol.GSM,
            NetworkName: command.NetworkName
        ));

        CheckLogMonitoring(command.LogMonitoringEnabled);
        CheckGsmNodes(command);
        NetworkLifetimeSuggestions(command.LifetimeInYears);
        SecurityAuditFrequencySuggestions(command.SecurityAuditFrequencyInYears);
        RedundancyMeasuresSuggestions(command.RedundancyMeasures);
        IntrusionDetectionSuggestions(command.IntrusionDetectionSystem);
        FirmwareIntegritySuggestions(command.FirmwareIntegrityCheck);
        DataPrivacyMeasuresSuggestions(command.DataPrivacyMeasures);
        NetworkFailuresSuggestions(command.NetworkFailures);

        var protocolReplacementEvaluationResult = protocolReplacementEvaluator.Evaluate(
            command.NetworkName,
            Protocol.GSM,
            gsmDevices,
            command.AlreadyImplemented
        );
        
        return new EvaluationResult
        {
            Mitigations = _mitigationSuggestions.DistinctBy(x => x.Message).ToList(),
            SafeConfigs = _safeConfigSuggestions.DistinctBy(x => x.Message).ToList(),
            Replacements = protocolReplacementEvaluationResult
        };
    }

    private void CheckLogMonitoring(bool logMonitoringEnabled)
    {
        if (!logMonitoringEnabled)
        {
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions, "Log monitoring suggestion: Need to enable log monitoring",
                4);
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

            ConnectionTypeSuggestions(gsmNode);
            FirmwareUpdatedYearSuggestions(gsmNode.FirmwareUpdatedYear, gsmNode.DeviceName);
        }
    }

    private void ConnectionTypeSuggestions(GsmNode node)
    {
        var connectionTypeSuggestions = EnumUtils.GetHigherEnumOptions(node.ConnectionTypeUtilized)
            .Where(opt => _gsmConfig.ConnectionType.ContainsKey(opt))
            .OrderDescending()
            .ToList();

        if (connectionTypeSuggestions.Count <= 0) return;

        var connectionTypeDict = new Dictionary<GsmGeneration, string>()
        {
            { GsmGeneration.ThreeG, "3G" },
            { GsmGeneration.FourG, "4G" },
            { GsmGeneration.FiveG, "5G" }
        };

        SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
            $"GSM connection type suggestions: [{node.DeviceName}] We suggest to utilize one of the following connection type in the current order: {string.Join(", ", connectionTypeSuggestions.Select(x => connectionTypeDict[x]))}",
            3);
    }

    private void FirmwareUpdatedYearSuggestions(int firmwareUpdatedYear, string deviceName)
    {
        var yearDiff = DateTime.Now.Year - firmwareUpdatedYear;
        // TODO: Threshold should be configurable ??
        if (yearDiff > 1)
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Firmware upgrade suggestion: [{deviceName}] Your node firmware is more than {yearDiff} years old. We suggest you upgrade your firmware",
                4);
    }

    private void NetworkLifetimeSuggestions(int selectedNetworkLifetime)
    {
        var networkLifetimeThreshold = _gsmConfig.LifetimeInYears;

        if (selectedNetworkLifetime > networkLifetimeThreshold)
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Network aging suggestion: Your network is more than {networkLifetimeThreshold} years old. Consider replacing your network.",
                2);
    }

    private void SecurityAuditFrequencySuggestions(int selectedSecurityAuditFrequency)
    {
        var securityAuditFrequencyThreshold = _gsmConfig.SecurityAuditFrequencyInYears;

        if (selectedSecurityAuditFrequency > securityAuditFrequencyThreshold)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                $"Network security audit frequency: Your network security audit frequency is {selectedSecurityAuditFrequency} years which is more than {securityAuditFrequencyThreshold} year which is the recommended threshold. Consider reducing your network security audit below or equal to {securityAuditFrequencyThreshold} year(s).",
                4);
    }

    private void RedundancyMeasuresSuggestions(bool redundancyMeasures)
    {
        if (!redundancyMeasures)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                "Redundancy measure suggestion: Need to enable redundancy measures in your network.", 4);
    }

    private void IntrusionDetectionSuggestions(bool intrusionDetectionSystem)
    {
        if (!intrusionDetectionSystem)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                "Intrusion detection system suggestion: Need to deploy an intrusion detection system in your network.",
                5);
    }

    private void DataPrivacyMeasuresSuggestions(DataPrivacyMeasures selectedDataPrivacyMeasures)
    {
        if (!selectedDataPrivacyMeasures.AtRest)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                "Data privacy measure suggestion: Need to enable data privacy measures for data at rest.", 4);

        if (!selectedDataPrivacyMeasures.InTransit)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                "Data privacy measure suggestion: Need to enable data privacy measures for data in transit.", 4);
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

            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                $"For '{cause}' failure we suggest the following action(s): {string.Join(", ", failureSuggestions)}.",
                3);

            totalRepairTime += failure.TimeToRepairInMinutes;
            totalDowntime += failure.DowntimeInMinutes;
        }

        var meanTimeToRepair = totalRepairTime / totalFailures;
        var meanDowntime = totalDowntime / totalFailures;

        if (meanDowntime > meanDowntimeThreshold)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                $"Your mean downtime is {meanDowntime} minutes which is above your organization threshold of '{meanDowntimeThreshold}' minutes. Consider reducing your mean downtime below the {meanDowntimeThreshold} minutes threshold.",
                3);

        if (meanTimeToRepair > meanTimeToRepairThreshold)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                $"Your mean time to repair is {meanTimeToRepair} minutes which is above your organization threshold of '{meanTimeToRepairThreshold}' minutes. Consider reducing your mean time to repair below the {meanTimeToRepairThreshold} minutes threshold.",
                3);
    }

    private void FirmwareIntegritySuggestions(bool firmwareIntegrityCheck)
    {
        if (!firmwareIntegrityCheck)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                "Firmware integrity check suggestion: Need to enable firmware integrity checks if supported by your network hardware.",
                4);
    }
}