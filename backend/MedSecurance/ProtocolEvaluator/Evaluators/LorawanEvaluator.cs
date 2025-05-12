using MedSecurance.DeviceManager.Models;
using MedSecurance.DeviceManager.Queries;
using MedSecurance.DeviceManager.Repositories.Interfaces;
using MedSecurance.ProtocolEvaluator.Commands.Lorawan;
using MedSecurance.ProtocolEvaluator.Configuration;
using MedSecurance.ProtocolEvaluator.Evaluators.Interfaces;
using MedSecurance.ProtocolEvaluator.Models;
using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Models.Lorawan;
using MedSecurance.ProtocolEvaluator.Models.Lorawan.Enums;
using MedSecurance.ProtocolEvaluator.Queries;
using MedSecurance.ProtocolEvaluator.Repository.Interfaces;
using MedSecurance.ProtocolEvaluator.Utils;
using Microsoft.Extensions.Options;

namespace MedSecurance.ProtocolEvaluator.Evaluators;

public class LorawanEvaluator(
    ILogger<LorawanEvaluator> logger,
    IOptions<ProtocolEvaluatorConfig> protocolEvaluatorConfigOptions,
    IDeviceRepository deviceRepository,
    IAdminConfigRepository adminConfigRepository,
    IProtocolReplacementEvaluator protocolReplacementEvaluator)
    : ILorawanEvaluator
{
    private readonly LorawanConfig _lorawanConfig = protocolEvaluatorConfigOptions.Value.Lorawan;
    private readonly LorawanNodeConfig _lorawanNodeConfig = protocolEvaluatorConfigOptions.Value.LorawanNode;

    private readonly ICollection<EvaluationSuggestion> _mitigationSuggestions = new List<EvaluationSuggestion>();
    private readonly ICollection<EvaluationSuggestion> _safeConfigSuggestions = new List<EvaluationSuggestion>();

    private int _totalGatewayBandwidth;
    private readonly Dictionary<string, bool> _gatewayAdaptiveDataRate = new();
    private decimal _totalNodeBandwidth;
    private readonly Dictionary<string, bool> _nodeAdaptiveDataRate = new();

    public async Task<EvaluationResult> Evaluate(EvaluateLorawanCommand command)
    {
        logger.LogInformation("Evaluate LoraWan");

        var adminConfigs =
            await adminConfigRepository.GetAdminConfigsAsync(new GetAdminConfigsQuery(Protocol.LoraWan));

        _lorawanConfig.MeanDowntimeInMinutes =
            int.Parse(adminConfigs
                .FirstOrDefault(x => x is { Property: "MeanDowntimeInMinutes", Protocol: Protocol.LoraWan })?.Value!);

        _lorawanConfig.MeanTimeToRepairInMinutes =
            int.Parse(adminConfigs
                .FirstOrDefault(x => x is { Property: "MeanTimeToRepairInMinutes", Protocol: Protocol.LoraWan })
                ?.Value!);

        _lorawanConfig.LifetimeInYears =
            int.Parse(adminConfigs
                .FirstOrDefault(x => x is { Property: "LifetimeInYears", Protocol: Protocol.LoraWan })?.Value!);

        var nodes = await deviceRepository.GetAllDevicesAsync(new GetDevicesQuery(
            Protocol.LoraWan,
            NetworkName: command.NetworkName
        ));

        MulticastSuggestions(command.NetworkDetails.MulticastEnable);
        GatewaySuggestions(command.NetworkDetails);
        LorawanNodeSuggestions(command.NetworkDetails.DeploymentCountry, nodes);
        NetworkAdaptiveDataRateSuggestions();
        NetworkBandwidthSuggestions(command.NetworkDetails.NetworkServer.BandwidthInMbps,
            command.NetworkDetails.ApplicationServer.BandwidthInMbps);
        FirewallStatusSuggestions(command.NetworkDetails.NetworkServer.FirewallEnable,
            command.NetworkDetails.ApplicationServer.FirewallEnable);
        LogMonitoringSuggestions(command.NetworkDetails.NetworkServer.LogMonitoringEnable,
            command.NetworkDetails.ApplicationServer.LogMonitoringEnable);
        NetworkLifetimeSuggestions(command.NetworkDetails.LifetimeInYears);
        OtherDevicesSuggestions(command.OtherConnectedDevices);
        SecurityAuditFrequencySuggestions(command.SecurityAuditFrequencyInYears);
        RedundancyMeasuresSuggestions(command.RedundancyMeasures);
        IntrusionDetectionSuggestions(command.IntrusionDetectionSystem);
        FirmwareIntegritySuggestions(command.FirmwareIntegrityCheck);
        DataPrivacyMeasuresSuggestions(command.DataPrivacyMeasures);
        NetworkFailuresSuggestions(command.NetworkFailures);

        var protocolReplacementEvaluationResult = protocolReplacementEvaluator.Evaluate(
            command.NetworkName,
            Protocol.LoraWan,
            nodes,
            command.AlreadyImplemented
        );

        return new EvaluationResult
        {
            Mitigations = _mitigationSuggestions.DistinctBy(x => x.Message).ToList(),
            SafeConfigs = _safeConfigSuggestions.DistinctBy(x => x.Message).ToList(),
            Replacements = protocolReplacementEvaluationResult
        };
    }

    private void MulticastSuggestions(bool networkDetailsMulticastEnable)
    {
        logger.LogInformation("Checking multicast suggestion");

        if (!networkDetailsMulticastEnable)
        {
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                "Multicast suggestion: Consider enabling multicast if you are using group communication with your devices.",
                3);
        }
    }

    private void GatewaySuggestions(LorawanNetworkDetails commandNetworkDetails)
    {
        logger.LogInformation("Checking gateway suggestion");

        var deploymentCountry = commandNetworkDetails.DeploymentCountry;

        foreach (var gateway in commandNetworkDetails.Gateways)
        {
            var gatewayName = gateway.GatewayName;
            var selectedFrequencyBand = gateway.FrequencyBandUtilized;
            var baseFrequencyBand = _lorawanConfig.FrequencyBandOptions[selectedFrequencyBand];
            var regulatoryCompliance = baseFrequencyBand.RegulatoryCompliance;

            FrequencyBandSuggestions(regulatoryCompliance, deploymentCountry, gatewayName, selectedFrequencyBand);
            GatewayBackboneConnectionTypesSuggestions(gateway.GatewayBackboneConnectionType, gatewayName);
            FirmwareUpdatedYearSuggestions(gateway.FirmwareUpdatedYear, gatewayName);
            PhysicalLocationSuggestions(gateway.PhysicalLocation, gatewayName);

            _totalGatewayBandwidth += gateway.BandwidthInMbps;
            _gatewayAdaptiveDataRate.Add(gatewayName, gateway.AdaptiveDataRate);
        }
    }

    private void FrequencyBandSuggestions(List<Countries> regulatoryCompliance, Countries deploymentCountry,
        string gatewayName, LorawanFrequencyBands selectedFrequencyBand)
    {
        if (!regulatoryCompliance.Contains(deploymentCountry))
        {
            var bandSuggestions = DetectCompatibleBand(_lorawanConfig.FrequencyBandOptions, deploymentCountry);

            if (bandSuggestions.Count > 0)
            {
                SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                    $"Frequency band suggestion: [{gatewayName}] The selected frequency band ({selectedFrequencyBand}) is currently not supported in your country ({deploymentCountry}). Consider switching to one of the following: {string.Join(", ", bandSuggestions)}",
                    5);
            }
        }
    }

    private void GatewayBackboneConnectionTypesSuggestions(
        GatewayBackboneConnectionTypes selectedGatewayBackboneConnectionType, string gatewayName)
    {
        var gatewayBackboneConnectionTypeSuggestions = EnumUtils
            .GetHigherEnumOptions(selectedGatewayBackboneConnectionType)
            .Where(opt => _lorawanConfig.GatewayBackboneConnectionTypeOptions.Contains(opt))
            .OrderDescending()
            .ToList();

        if (gatewayBackboneConnectionTypeSuggestions.Count > 0)
        {
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Gateway connection suggestions: [{gatewayName}] Consider upgrading your gateway backbone connection with one of the following in the current order if possible: {string.Join(", ", gatewayBackboneConnectionTypeSuggestions)}",
                4);
        }
    }

    private void FirmwareUpdatedYearSuggestions(int firmwareUpdatedYear, string gatewayName)
    {
        var yearDiff = DateTime.Now.Year - firmwareUpdatedYear;
        // TODO: Threshold should be configurable ??
        if (yearDiff >= 2)
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Firmware upgrade suggestion: [{gatewayName}] The firmware is more than {yearDiff} years old. We suggest you upgrade your firmware.",
                4);
    }

    private void PhysicalLocationSuggestions(PhysicalLocation selectedPhysicalLocation, string gatewayName)
    {
        var strongerPhysicalLocation = EnumUtils.GetHigherEnumOptions(selectedPhysicalLocation)
            .Where(opt => _lorawanConfig.PhysicalLocations.Contains(opt))
            .OrderDescending()
            .ToList();

        if (strongerPhysicalLocation.Count > 0)
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Physical location upgrade suggestions: [{gatewayName}] We suggest to upgrade the physical location with one of the following options in the current order: {string.Join(", ", strongerPhysicalLocation)}",
                3);
    }

    private void LorawanNodeSuggestions(Countries deploymentCountry, ICollection<Device> nodes)
    {
        logger.LogInformation("Checking LoRaWAN node suggestion");

        foreach (var node in nodes)
        {
            var nodeName = node.Name;
            var selectedFrequencyBand = node.LorawanSpecs.UtilizedFrequencyBand;
            var baseFrequencyBand = _lorawanConfig.FrequencyBandOptions[selectedFrequencyBand];
            var regulatoryCompliance = baseFrequencyBand.RegulatoryCompliance;

            FrequencyBandSuggestions(regulatoryCompliance, deploymentCountry, nodeName, selectedFrequencyBand);
            FirmwareUpdatedYearSuggestions(node.LorawanSpecs.FirmwareDate.Year, nodeName);
            PhysicalLocationSuggestions(node.LorawanSpecs.PhysicalLocation, nodeName);
            JoinModeSuggestions(node.LorawanSpecs.JoinMode, nodeName);

            var nodeBandwidth = _lorawanConfig.FrequencyBandOptions[node.LorawanSpecs.UtilizedFrequencyBand]
                                    .DataRateInKbps[1] /
                                1000;
            _totalNodeBandwidth += nodeBandwidth;
            _nodeAdaptiveDataRate.Add(nodeName, node.LorawanSpecs.AdaptiveDataRate);
        }
    }

    private void JoinModeSuggestions(
        LorawanJoinModes selectedJoinMode, string nodeName)
    {
        logger.LogInformation("Checking join mode suggestion");

        var joinModeSuggestions = EnumUtils
            .GetHigherEnumOptions(selectedJoinMode)
            .Where(opt => _lorawanNodeConfig.JoinModeOptions.Contains(opt))
            .OrderDescending()
            .ToList();

        if (joinModeSuggestions.Count > 0)
        {
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Join Mode suggestions: [{nodeName}] We suggest to upgrade the node 'Join Mode' with one of the following options in the current order: {string.Join(", ", joinModeSuggestions)}",
                4);
        }
    }

    private void NetworkAdaptiveDataRateSuggestions()
    {
        logger.LogInformation("Checking adaptive data rate suggestion");

        bool allTrueInBoth = _gatewayAdaptiveDataRate.All(kvp => kvp.Value) &&
                             _nodeAdaptiveDataRate.All(kvp => kvp.Value);
        bool allFalseInBoth = _gatewayAdaptiveDataRate.All(kvp => !kvp.Value) &&
                              _nodeAdaptiveDataRate.All(kvp => !kvp.Value);

        if (allTrueInBoth)
        {
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                "Adaptive data rate info: Currently your network is configured with adaptive data rate option equal to true.",
                1);
        }
        else if (allFalseInBoth)
        {
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                "Adaptive data rate info: Currently your network is configured with adaptive data rate option equal to false.",
                1);
        }
        else
        {
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Adaptive data rate suggestion: Currently your network has nodes and or gateways that have both enable and disable the adaptive data rate option. Consider defaulting to one options across the network. See a detailed report below: \n{string.Join("\n", _gatewayAdaptiveDataRate.Select(kvp => $"{kvp.Key}: {kvp.Value}"))} \n{string.Join("\n", _nodeAdaptiveDataRate.Select(kvp => $"{kvp.Key}: {kvp.Value}"))} ",
                3);
        }
    }

    private void NetworkBandwidthSuggestions(int networkServerBandwidth, int applicationServerBandwidth)
    {
        logger.LogInformation("Checking network bandwidth suggestion");

        if (_totalGatewayBandwidth < _totalNodeBandwidth)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                $"Network bandwidth suggestions: The total IoMT data transfer rate ({_totalNodeBandwidth:.2f} Mbps) is higher than the total gateways data rate ({_totalGatewayBandwidth} Mbps). Your network gateways needs additional {_totalNodeBandwidth - _totalGatewayBandwidth:.2f} Mbps of bandwidth.",
                4);

        if (networkServerBandwidth < _totalNodeBandwidth)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                $"Network bandwidth suggestions: The total IoMT data transfer rate ({_totalNodeBandwidth:.2f} Mbps) is higher than the total Network Server data rate ({networkServerBandwidth} Mbps). Your network gateways needs additional {_totalNodeBandwidth - networkServerBandwidth:.2f} Mbps of bandwidth.",
                4);

        if (applicationServerBandwidth < _totalNodeBandwidth)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                $"Network bandwidth suggestions: The total IoMT data transfer rate ({_totalNodeBandwidth:.2f} Mbps) is higher than the total Application Server data rate ({applicationServerBandwidth} Mbps). Your network gateways needs additional {_totalNodeBandwidth - applicationServerBandwidth:.2f} Mbps of bandwidth.",
                4);
    }

    private void FirewallStatusSuggestions(bool firewallStatusFlagNetwork, bool firewallStatusFlagApplication)
    {
        logger.LogInformation("Checking firewall status suggestion");

        if (!firewallStatusFlagNetwork)
        {
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                "Firewall suggestion: Need to enable a firewall for your Network Server", 5);
        }

        if (!firewallStatusFlagApplication)
        {
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                "Firewall suggestion: Need to enable a firewall for your Application Server", 5);
        }
    }

    private void LogMonitoringSuggestions(bool logMonitoringFlagNetwork, bool logMonitoringFlagApplication)
    {
        logger.LogInformation("Checking log monitoring suggestion");

        if (!logMonitoringFlagNetwork)
        {
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                "Log monitoring suggestion: Need to enable log monitoring for your Network Server", 4);
        }

        if (!logMonitoringFlagApplication)
        {
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                "Log monitoring suggestion: Need to enable log monitoring for your Application Server", 4);
        }
    }

    private void NetworkLifetimeSuggestions(int selectedNetworkLifetime)
    {
        logger.LogInformation("Checking network lifetime suggestion");

        var networkLifetimeThreshold = _lorawanConfig.LifetimeInYears;

        if (selectedNetworkLifetime > networkLifetimeThreshold)
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Network aging suggestion: Your network is more than {networkLifetimeThreshold} years old. Consider replacing your network.",
                2);
    }

    private void OtherDevicesSuggestions(int otherConnectedDevices)
    {
        logger.LogInformation("Checking other connected devices suggestion");

        if (otherConnectedDevices > 0)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                $"Other connected devices suggestion: You have {otherConnectedDevices} connected devices that are not IoMT. Consider removing them to increase your network security.",
                3);
    }

    private void SecurityAuditFrequencySuggestions(int selectedSecurityAuditFrequency)
    {
        logger.LogInformation("Checking security audit frequency suggestion");

        var securityAuditFrequencyThreshold = _lorawanConfig.SecurityAuditFrequencyInYears;

        if (selectedSecurityAuditFrequency > securityAuditFrequencyThreshold)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                $"Network security audit frequency: Your network security audit frequency is {selectedSecurityAuditFrequency} years which is more than {securityAuditFrequencyThreshold} year which is the recommended threshold. Consider reducing your network security audit below or equal to {securityAuditFrequencyThreshold} year(s).",
                4);
    }

    private void RedundancyMeasuresSuggestions(bool redundancyMeasuresFlag)
    {
        logger.LogInformation("Checking redundancy measures suggestion");

        if (!redundancyMeasuresFlag)
        {
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                "Redundancy measure suggestion: Need to enable redundancy measures in your network.", 4);
        }
    }

    private void IntrusionDetectionSuggestions(bool intrusionDetectionFlag)
    {
        logger.LogInformation("Checking intrusion detection suggestion");

        if (!intrusionDetectionFlag)
        {
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                "Intrusion detection system suggestion: Need to deploy an intrusion detection system in your network.",
                5);
        }
    }

    private void FirmwareIntegritySuggestions(bool firmwareIntegrityFlag)
    {
        logger.LogInformation("Checking firmware integrity suggestion");

        if (!firmwareIntegrityFlag)
        {
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                "Firmware integrity check suggestion: Need to enable firmware integrity checks if supported by your network hardware.",
                4);
        }
    }

    private void DataPrivacyMeasuresSuggestions(DataPrivacyMeasures selectedDataPrivacyMeasures)
    {
        logger.LogInformation("Checking data privacy measures suggestion");

        if (!selectedDataPrivacyMeasures.AtRest)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                "Data privacy measure suggestion: Need to enable data privacy measures for data at rest.", 4);

        if (!selectedDataPrivacyMeasures.InTransit)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                "Data privacy measure suggestion: Need to enable data privacy measures for data in transit.",
                4);
    }

    private void NetworkFailuresSuggestions(List<NetworkFailure> networkFailures)
    {
        logger.LogInformation("Checking network failures suggestion");

        if (networkFailures.Count == 0)
            return;

        var meanDowntimeThreshold = _lorawanConfig.MeanDowntimeInMinutes;
        var meanTimeToRepairThreshold = _lorawanConfig.MeanTimeToRepairInMinutes;
        var totalRepairTime = 0;
        var totalDowntime = 0;
        var totalFailures = networkFailures.Count;

        foreach (var failure in networkFailures)
        {
            var cause = failure.CauseOfFailure;
            var failureSuggestions = _lorawanConfig.CauseOfFailure[cause];

            if (failureSuggestions.Count == 0)
                continue;

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

    private static List<LorawanFrequencyBands> DetectCompatibleBand(
        Dictionary<LorawanFrequencyBands, LorawanFrequencyBand> frequencyBandOptions, Countries deploymentCountry)
    {
        foreach (var band in frequencyBandOptions)
        {
            if (frequencyBandOptions[band.Key].RegulatoryCompliance.Contains(deploymentCountry))
            {
                return new List<LorawanFrequencyBands> { band.Key };
            }
        }

        return new List<LorawanFrequencyBands>();
    }
}