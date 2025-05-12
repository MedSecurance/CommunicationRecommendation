using System.Globalization;
using MedSecurance.DeviceManager.Models;
using MedSecurance.DeviceManager.Queries;
using MedSecurance.DeviceManager.Repositories.Interfaces;
using MedSecurance.ProtocolEvaluator.Commands;
using MedSecurance.ProtocolEvaluator.Configuration;
using MedSecurance.ProtocolEvaluator.Evaluators.Interfaces;
using MedSecurance.ProtocolEvaluator.Models;
using MedSecurance.ProtocolEvaluator.Models.Bluetooth;
using MedSecurance.ProtocolEvaluator.Models.Bluetooth.Enums;
using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Queries;
using MedSecurance.ProtocolEvaluator.Repository.Interfaces;
using MedSecurance.ProtocolEvaluator.Utils;
using Microsoft.Extensions.Options;

namespace MedSecurance.ProtocolEvaluator.Evaluators;

public class BluetoothEvaluator(
    ILogger<BluetoothEvaluator> logger,
    IOptions<ProtocolEvaluatorConfig> protocolEvaluatorConfigOptions,
    IDeviceRepository deviceRepository,
    IAdminConfigRepository adminConfigRepository,
    IProtocolReplacementEvaluator protocolReplacementEvaluator)
    : IBluetoothEvaluator
{
    private readonly BluetoothConfig _bluetoothConfig = protocolEvaluatorConfigOptions.Value.Bluetooth;

    private readonly ICollection<EvaluationSuggestion> _mitigationSuggestions = new List<EvaluationSuggestion>();
    private readonly ICollection<EvaluationSuggestion> _safeConfigSuggestions = new List<EvaluationSuggestion>();

    public async Task<EvaluationResult> Evaluate(EvaluateBluetoothCommand command)
    {
        logger.LogInformation("Evaluating Bluetooth");

        var adminConfigs =
            await adminConfigRepository.GetAdminConfigsAsync(new GetAdminConfigsQuery(Protocol.Bluetooth));

        _bluetoothConfig.MeanDowntimeInMinutes =
            int.Parse(adminConfigs
                .FirstOrDefault(x => x is { Property: "MeanDowntimeInMinutes", Protocol: Protocol.Bluetooth })?.Value!);

        _bluetoothConfig.MeanTimeToRepairInMinutes =
            int.Parse(adminConfigs
                .FirstOrDefault(x => x is { Property: "MeanTimeToRepairInMinutes", Protocol: Protocol.Bluetooth })
                ?.Value!);

        _bluetoothConfig.LifetimeInYears =
            int.Parse(adminConfigs
                .FirstOrDefault(x => x is { Property: "LifetimeInYears", Protocol: Protocol.Bluetooth })?.Value!);

        var bluetoothDevices = await deviceRepository
            .GetAllDevicesAsync(new GetDevicesQuery(Protocol.Bluetooth, NetworkName: command.NetworkName));
        var totalIomtDevices = bluetoothDevices.Count();

        CheckLogMonitoring(command.LogMonitoringEnabled);
        CheckTopology(command);
        CheckSupportedDevices(command, totalIomtDevices);
        CheckBleNodes(command, bluetoothDevices);
        NetworkLifetimeSuggestions(command.NetworkDetails.DeploymentDetails.LifetimeInYears);
        OtherDevicesSuggestions(command.NetworkDetails.OtherConnectedDevices);
        SecurityAuditFrequencySuggestions(command.SecurityAuditFrequencyInYears);
        AccessControlMechanismSuggestions(command.AccessControlMechanism);
        RedundancyMeasuresSuggestions(command.RedundancyMeasures);
        IntrusionDetectionSuggestions(command.IntrusionDetectionSystem);
        FirmwareIntegritySuggestions(command.FirmwareIntegrityCheck);
        DataPrivacyMeasuresSuggestions(command.DataPrivacyMeasures);
        NetworkFailuresSuggestions(command.NetworkDetails.NetworkFailures);

        var protocolReplacementEvaluationResult = protocolReplacementEvaluator.Evaluate(
            command.NetworkName,
            Protocol.Bluetooth,
            bluetoothDevices,
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
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                "Log monitoring suggestion: Need to enable log monitoring", 4);
        }
    }

    private void CheckTopology(EvaluateBluetoothCommand command)
    {
        var selectedTopology = command.NetworkDetails.DeploymentDetails.TopologyType;
        var availableTopologies = _bluetoothConfig.TopologyType;

        if (availableTopologies.Count == 1 && selectedTopology == availableTopologies[0])
        {
            logger.LogInformation("Only one topology type is available. For {@NetworkName}", command.NetworkName);
            return;
        }

        var strongerTopologyTypes = EnumUtils.GetHigherEnumOptions(selectedTopology);

        if (strongerTopologyTypes.Count == 0)
        {
            logger.LogInformation("The selected topology {@Topology} is the strongest topology. For {@NetworkName}",
                selectedTopology, command.NetworkName);
            return;
        }

        SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
            $"Network topology suggestions: Current your network topology is '{selectedTopology}'. Consider upgrading your topology with one of the following in the current order if possible: {string.Join(", ", strongerTopologyTypes)}.",
            3);
    }

    private void CheckSupportedDevices(EvaluateBluetoothCommand command, int totalIomtDevices)
    {
        var topology = command.NetworkDetails.DeploymentDetails.TopologyType;
        var availableTopologies = _bluetoothConfig.TopologyType;

        if (topology == BluetoothTopologyType.PointToPoint && command.MaxSupportedDevices > 2)
        {
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Supported devices: Current number of IoMT devices cannot be supported by the current configuration. Your network topology ({topology}) can only support 2 nodes.",
                3);
        }

        if (totalIomtDevices > command.MaxSupportedDevices)
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Supported devices: Current number of IoMT devices found in device manager cannot be supported by the current configuration. Your network needs to support additional {totalIomtDevices - command.MaxSupportedDevices} devices.",
                3);

        var numberOfNodes = command.NetworkDetails.DeploymentDetails.BleNodes.Count;

        // TODO: Check again because Point To Point is the strongest topology
        var strongerTopologyTypes = EnumUtils.GetHigherEnumOptions(topology)
            .OrderDescending()
            .ToList();
        
        if (topology == BluetoothTopologyType.PointToPoint && numberOfNodes > 2)
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Incorrect number of nodes: Current the network topology is '{topology}' but the total number of nodes provided ({numberOfNodes}) is more than 2. Consider upgrading your topology with one of the following in the current order if possible: {string.Join(", ", strongerTopologyTypes)}.",
                3);
    }

    private void CheckBleNodes(EvaluateBluetoothCommand command, ICollection<Device> devices)
    {
        logger.LogInformation("Checking BLENodes for Bluetooth network: {@NetworkName}",
            command.NetworkName);

        var totalNodesDataRates = 0;
        var totalNodesAreaCoverage = 0;

        foreach (var bleNode in command.NetworkDetails.DeploymentDetails.BleNodes)
        {
            logger.LogInformation("Checking Node {@DeviceName}",
                bleNode.DeviceName);

            VersionUpgradeSuggestions(bleNode.VersionUtilized, bleNode.SupportedVersions, bleNode.DeviceName);
            AntennaTypeSuggestions(bleNode.AntennaType, bleNode.DeviceName);
            AuthenticationMethodSuggestions(bleNode.AuthenticationMethod, bleNode.DeviceName);
            DataIntegritySuggestions(bleNode.DataIntegrity, bleNode.DeviceName);
            CommunicationChannelSuggestions(bleNode.SecureCommunicationChannel, bleNode.DeviceName);
            FirmwareUpdatedYearSuggestions(bleNode.FirmwareUpdatedYear, bleNode.DeviceName);
            PhysicalLocationSuggestions(bleNode.PhysicalLocation, bleNode.DeviceName);

            totalNodesDataRates += _bluetoothConfig.Versions[$"{bleNode.VersionUtilized}"].DataRateInMbps;
            totalNodesAreaCoverage += _bluetoothConfig.Versions[$"{bleNode.VersionUtilized}"].RangeInMeters;
        }

        var totalIomtDataRates = devices.Sum(b => _bluetoothConfig
            .Versions[b.BluetoothSpecs!.UtilizedVersion.ToString(CultureInfo.InvariantCulture)].DataRateInMbps);

        NetworkBandwidthSuggestions(command.NetworkDetails.DeploymentDetails.BleNodes, totalNodesDataRates,
            totalIomtDataRates);
        BackboneNetworkSpeedSuggestions(command.BackboneNetworkSpeedInMpbs, totalNodesDataRates, totalIomtDataRates);
        AreaCoverageSuggestions(command.NetworkDetails.DeploymentDetails, totalNodesAreaCoverage);
    }

    private void VersionUpgradeSuggestions(decimal selectedVersion, List<decimal> supportedVersions, string deviceName)
    {
        // Sort the supportedVersions in descending order
        var sortedSupportedVersions = supportedVersions.OrderByDescending(v => v).ToList();

        // Check if userVersionSelected is the highest version
        if (selectedVersion == sortedSupportedVersions[0])
        {
            logger.LogInformation(
                "The selected version {@Version} is the highest supported version. For {@DeviceName}",
                selectedVersion, deviceName);
            return;
        }

        // Get the versions higher than userVersionSelected
        var higherVersions = sortedSupportedVersions.Where(v => v > selectedVersion).ToList();

        if (higherVersions.Count > 0)
        {
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"BLE standard upgrade suggestions: [{deviceName}] We suggest to utilize one of the following standard in the current order: {string.Join(", ", higherVersions)}.",
                3);
        }
    }

    private void AntennaTypeSuggestions(BluetoothAntennaType selectedAntennaType, string deviceName)
    {
        var strongerAntennaTypes = EnumUtils.GetHigherEnumOptions(selectedAntennaType)
            .Where(opt => _bluetoothConfig.AntennaTypes.Contains(opt))
            .OrderDescending()
            .ToList();

        if (strongerAntennaTypes.Count > 0)
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Node antenna upgrade suggestions: [{deviceName}] We suggest to upgrade the node antenna with one of the following options in the current order: {string.Join(", ", strongerAntennaTypes)}",
                3);
    }

    private void AuthenticationMethodSuggestions(BluetoothAuthenticationMethod selectedAuthentication,
        string deviceName)
    {
        var strongerAuthenticationMethods = EnumUtils.GetHigherEnumOptions(selectedAuthentication)
            .Where(opt => _bluetoothConfig.AuthenticationMethods.Contains(opt))
            .OrderDescending()
            .ToList();

        if (strongerAuthenticationMethods.Count > 0)
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Node authentication method upgrade suggestions: [{deviceName}] We suggest to upgrade the node authentication method with one of the following options in the current order: {string.Join(", ", strongerAuthenticationMethods)}",
                5);
    }

    private void DataIntegritySuggestions(BluetoothDataIntegrity selectedData, string deviceName)
    {
        var strongerDataIntegritySuggestion = EnumUtils.GetHigherEnumOptions(selectedData)
            .Where(opt => _bluetoothConfig.DataIntegrity.Contains(opt))
            .OrderDescending()
            .ToList();

        if (strongerDataIntegritySuggestion.Count > 0)
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Node data integrity upgrade suggestions: [{deviceName}] We suggest to upgrade the node data integrity option with one of the following in the current order: {string.Join(", ", strongerDataIntegritySuggestion)}",
                5);
    }

    private void CommunicationChannelSuggestions(BluetoothSecureCommunicationChannel selectedCommunicationChannel,
        string deviceName)
    {
        var strongerCommunicationChannels = EnumUtils.GetHigherEnumOptions(selectedCommunicationChannel)
            .Where(opt => _bluetoothConfig.SecureCommunicationChannels.Contains(opt))
            .OrderDescending()
            .ToList();

        if (strongerCommunicationChannels.Count > 0)
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Node secure communication channel upgrade suggestions: [{deviceName}] We suggest to upgrade the node secure communication channel with one of the following options in the current order: {string.Join(", ", strongerCommunicationChannels)}",
                5);
    }

    private void FirmwareUpdatedYearSuggestions(int firmwareUpdatedYear, string deviceName)
    {
        var yearDiff = DateTime.Now.Year - firmwareUpdatedYear;
        // TODO: Threshold should be configurable ??
        if (yearDiff >= 2)
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Firmware upgrade suggestion: [{deviceName}] Your node firmware is more than {yearDiff} years old. We suggest you upgrade your firmware",
                4);
    }

    private void PhysicalLocationSuggestions(PhysicalLocation selectedPhysicalLocation, string deviceName)
    {
        var strongerPhysicalLocation = EnumUtils.GetHigherEnumOptions(selectedPhysicalLocation)
            .Where(opt => _bluetoothConfig.PhysicalLocations.Contains(opt))
            .OrderDescending()
            .ToList();

        if (strongerPhysicalLocation.Count > 0)
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Node physical location upgrade suggestions: [{deviceName}] We suggest to upgrade the node physical location with one of the following options in the current order: {string.Join(", ", strongerPhysicalLocation)}",
                3);
    }

    private void NetworkBandwidthSuggestions(List<BluetoothNode> bleNodes, int totalNodesDataRates,
        double totalIomtDataRates)
    {
        if (totalIomtDataRates <= totalNodesDataRates)
            return;

        SuggestionUtils.AddSuggestion(_mitigationSuggestions,
            $"Network bandwidth suggestions: The total IoMT data transfer rate ({totalIomtDataRates} Mbps) is higher than the total node data rate ({totalNodesDataRates} Mbps). Your network needs additional {totalIomtDataRates - totalNodesDataRates} Mbps",
            4);

        var totalDataRateGainFromUpgrades = 0;
        foreach (var node in bleNodes)
        {
            var utilizedVersionDataRate = _bluetoothConfig.Versions[$"{node.VersionUtilized}"].DataRateInMbps;
            var upgradeOptionCounter = 1;

            var highestNodeUpgradeGain = 0;
            foreach (var version in node.SupportedVersions)
            {
                if (version == node.VersionUtilized) continue;
                var versionDataRate = _bluetoothConfig.Versions[$"{version}"].DataRateInMbps;
                if (versionDataRate <= utilizedVersionDataRate) continue;

                var upgradeGain = versionDataRate - utilizedVersionDataRate;
                if (versionDataRate > highestNodeUpgradeGain)
                {
                    highestNodeUpgradeGain = upgradeGain;
                }

                SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                    $"Network bandwidth suggestions: Data rate upgrade option {upgradeOptionCounter}: [{node.DeviceName}|{version}]" +
                    $" supports {versionDataRate} Mpbs. You increase the overall network data rate with additional {versionDataRate - utilizedVersionDataRate} Mbps.",
                    4);

                upgradeOptionCounter += 1;
            }

            totalDataRateGainFromUpgrades += highestNodeUpgradeGain;
        }

        var missingDataRate = totalIomtDataRates - (totalNodesDataRates + totalDataRateGainFromUpgrades);

        if (missingDataRate > 0)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                $"Network bandwidth suggestions: The total IoMT data transfer rate ({totalIomtDataRates} Mbps) is higher than the total node " +
                $"data rate plus the suggested upgrades ({totalNodesDataRates + totalDataRateGainFromUpgrades} Mbps). Consider adding additional nodes to support additional {missingDataRate} Mbps",
                4);
    }

    private void BackboneNetworkSpeedSuggestions(int backboneNetworkSpeedInMpbs, int totalNodesDataRates,
        double totalIomtDataRates)
    {
        if (totalNodesDataRates > backboneNetworkSpeedInMpbs)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                $"Network bandwidth suggestions: Your node total data rate ({totalNodesDataRates} Mbps) is higher than your " +
                $"backbone network data rate ({backboneNetworkSpeedInMpbs} Mbps). Consider updating your backbone network transfer rates to support at least {totalNodesDataRates - backboneNetworkSpeedInMpbs} additional Mbps",
                4);

        if (totalIomtDataRates > backboneNetworkSpeedInMpbs)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                $"Network bandwidth suggestions: The total IoMT data transfer rate ({totalIomtDataRates} Mbps) is higher than your " +
                $"backbone network data rate ({backboneNetworkSpeedInMpbs} Mbps). Update your backbone network transfer rates to support at least {totalIomtDataRates - backboneNetworkSpeedInMpbs} additional Mbps",
                4);
    }

    private void NetworkLifetimeSuggestions(int selectedNetworkLifetime)
    {
        var networkLifetimeThreshold = _bluetoothConfig.LifetimeInYears;

        if (selectedNetworkLifetime > networkLifetimeThreshold)
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Network aging suggestion: Your network is more than {networkLifetimeThreshold} years old. Consider replacing your network.",
                2);
    }

    private void OtherDevicesSuggestions(int otherConnectedDevices)
    {
        if (otherConnectedDevices > 0)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                $"Other connected devices suggestion: You have {otherConnectedDevices} connected devices that are not IoMT. Consider removing them to increase your network security.",
                3);
    }

    private void AreaCoverageSuggestions(BluetoothDeploymentDetails deploymentDetails, int totalNodesAreaCoverage)
    {
        var networkAreaCoverage = deploymentDetails.AreaCoverageInMeters;

        if (totalNodesAreaCoverage >= networkAreaCoverage)
            return;

        SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
            $"Area coverage suggestion: Your network area coverage is {networkAreaCoverage} but the maximum area coverage of the nodes (assuming zero overlap) is {totalNodesAreaCoverage}. You need to include more nodes to cover an additional {networkAreaCoverage - totalNodesAreaCoverage} meters.",
            3);

        var totalAreaCoverageGainFromUpgrades = 0;
        foreach (var node in deploymentDetails.BleNodes)
        {
            var utilizedVersionAreaCoverage = _bluetoothConfig.Versions[$"{node.VersionUtilized}"].RangeInMeters;
            var upgradeOptionCounter = 1;

            var highestNodeUpgradeGain = 0;
            foreach (var version in node.SupportedVersions)
            {
                if (version == node.VersionUtilized) continue;
                var versionAreaCoverage = _bluetoothConfig.Versions[$"{version}"].RangeInMeters;
                if (versionAreaCoverage <= utilizedVersionAreaCoverage) continue;

                var upgradeGain = versionAreaCoverage - utilizedVersionAreaCoverage;
                if (upgradeGain > highestNodeUpgradeGain)
                {
                    highestNodeUpgradeGain = upgradeGain;
                }

                SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                    $"Network area coverage suggestions: Area coverage upgrade option {upgradeOptionCounter}: [{node.DeviceName}|{version}] supports {versionAreaCoverage} Meters. You increase the overall network area coverage with additional {versionAreaCoverage - utilizedVersionAreaCoverage} Meters.",
                    3);

                upgradeOptionCounter += 1;
            }

            totalAreaCoverageGainFromUpgrades += highestNodeUpgradeGain;
        }

        var missingAreaCoverage = networkAreaCoverage - (totalNodesAreaCoverage + totalAreaCoverageGainFromUpgrades);

        if (missingAreaCoverage > 0)
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Network area coverage suggestions: The required network area coverage is ({networkAreaCoverage} Meters) which is higher than the total node area coverage plus the suggested upgrades ({totalNodesAreaCoverage + totalAreaCoverageGainFromUpgrades} Meters). Consider adding additional nodes to support additional {missingAreaCoverage} Meters.",
                3);
    }

    private void SecurityAuditFrequencySuggestions(int selectedSecurityAuditFrequency)
    {
        var securityAuditFrequencyThreshold = _bluetoothConfig.SecurityAuditFrequencyInYears;

        if (selectedSecurityAuditFrequency > securityAuditFrequencyThreshold)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                $"Network security audit frequency: Your network security audit frequency is {selectedSecurityAuditFrequency} years which is more than {securityAuditFrequencyThreshold} year which is the recommended threshold. Consider reducing your network security audit below or equal to {securityAuditFrequencyThreshold} year(s).",
                4);
    }

    private void AccessControlMechanismSuggestions(BluetoothAccessControlMechanism selectedAccessControlMechanism)
    {
        var strongerAccessControlMechanism = EnumUtils.GetHigherEnumOptions(selectedAccessControlMechanism)
            .Where(opt => _bluetoothConfig.AccessControlMechanisms.Contains(opt))
            .OrderDescending()
            .ToList();

        if (strongerAccessControlMechanism.Count > 0)
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Network access control suggestion: Your current network access control mechanism is '{selectedAccessControlMechanism}'. We suggest to upgrade it with one of the following options in the current order: {string.Join(", ", strongerAccessControlMechanism)}.",
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

    private void FirmwareIntegritySuggestions(bool firmwareIntegrityCheck)
    {
        if (!firmwareIntegrityCheck)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                "Firmware integrity check suggestion: Need to enable firmware integrity checks if supported by your network hardware.",
                4);
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

        var meanDowntimeThreshold = _bluetoothConfig.MeanDowntimeInMinutes;
        var meanTimeToRepairThreshold = _bluetoothConfig.MeanTimeToRepairInMinutes;
        var totalRepairTime = 0;
        var totalDowntime = 0;
        var totalFailures = networkFailures.Count;

        foreach (var failure in networkFailures)
        {
            var cause = failure.CauseOfFailure;
            var failureSuggestions = _bluetoothConfig.CauseOfFailure[cause];

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
}