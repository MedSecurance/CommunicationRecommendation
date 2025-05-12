using MedSecurance.DeviceManager.Models;
using MedSecurance.DeviceManager.Queries;
using MedSecurance.DeviceManager.Repositories.Interfaces;
using MedSecurance.Extensions;
using MedSecurance.ProtocolEvaluator.Commands;
using MedSecurance.ProtocolEvaluator.Configuration;
using MedSecurance.ProtocolEvaluator.Evaluators.Interfaces;
using MedSecurance.ProtocolEvaluator.Models;
using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Models.Wifi;
using MedSecurance.ProtocolEvaluator.Models.Wifi.Enums;
using MedSecurance.ProtocolEvaluator.Queries;
using MedSecurance.ProtocolEvaluator.Repository.Interfaces;
using MedSecurance.ProtocolEvaluator.Utils;
using Microsoft.Extensions.Options;

namespace MedSecurance.ProtocolEvaluator.Evaluators;

public class WifiEvaluator(
    ILogger<WifiEvaluator> logger,
    IOptions<ProtocolEvaluatorConfig> protocolEvaluatorConfigOptions,
    IDeviceRepository deviceRepository,
    IAdminConfigRepository adminConfigRepository,
    IProtocolReplacementEvaluator protocolReplacementEvaluator)
    : IWifiEvaluator
{
    private readonly WifiConfig _wifiConfig = protocolEvaluatorConfigOptions.Value.Wifi;

    private readonly ICollection<EvaluationSuggestion> _mitigationSuggestions = new List<EvaluationSuggestion>();
    private readonly ICollection<EvaluationSuggestion> _safeConfigSuggestions = new List<EvaluationSuggestion>();
    private ICollection<TvraCve> _vulnerabilities = new List<TvraCve>();
    
    public async Task<WifiEvaluationResult> Evaluate(EvaluateWifiCommand command)
    {
        logger.LogInformation("Evaluating Wifi");

        var adminConfigs =
            await adminConfigRepository.GetAdminConfigsAsync(new GetAdminConfigsQuery(Protocol.WiFi));

        var dbMeanDowntimeInMinutes = adminConfigs
            .FirstOrDefault(x => x is { Property: "MeanDowntimeInMinutes", Protocol: Protocol.WiFi })?.Value!;

        if (!string.IsNullOrEmpty(dbMeanDowntimeInMinutes))
        {
            _wifiConfig.MeanDowntimeInMinutes = int.Parse(dbMeanDowntimeInMinutes);
        }

        var dbMeanTimeToRepairInMinutes = adminConfigs
            .FirstOrDefault(x => x is { Property: "MeanTimeToRepairInMinutes", Protocol: Protocol.WiFi })?.Value!;

        if (!string.IsNullOrEmpty(dbMeanTimeToRepairInMinutes))
        {
            _wifiConfig.MeanTimeToRepairInMinutes = int.Parse(dbMeanTimeToRepairInMinutes);
        }

        var wifiDevices = await deviceRepository.GetAllDevicesAsync(new GetDevicesQuery(
            Protocol.WiFi,
            NetworkName: command.NetworkName
        ));

        var totalWifiDevices = wifiDevices.Count;

        CheckFirewall(command.FirewallEnabled);
        CheckLogMonitoring(command.LogMonitoringEnabled);
        CheckMaxNumberOfDevices(command, totalWifiDevices);
        CheckEncryption(command);
        CheckBandwidth(command, wifiDevices);
        CheckLocation(command);
        CheckPlacement(command);
        CheckTopology(command);
        NetworkLifetimeSuggestions(command.NetworkDetails.WifiDeploymentDetails.LifetimeInYears);
        OtherConnectedDevicesSuggestions(command.NetworkDetails.OtherConnectedDevices);
        RedundancyMeasuresSuggestions(command.RedundancyMeasures);
        IntrusionDetectionSuggestions(command.IntrusionDetectionSystem);
        FirmwareIntegritySuggestions(command.FirmwareIntegrityCheck);
        NetworkFailuresSuggestions(command.NetworkDetails.NetworkFailures);
        if (!command.TvraCves.IsNullOrEmpty())
        {
            CheckTvra(command.TvraCves!, wifiDevices);
        }
        
        var protocolReplacementEvaluationResult = protocolReplacementEvaluator.Evaluate(
            command.NetworkName,
            Protocol.WiFi,
            wifiDevices,
            command.AlreadyImplemented
        );
        
        return new WifiEvaluationResult
        {
            Mitigations = _mitigationSuggestions.DistinctBy(x => x.Message).ToList(),
            SafeConfigs = _safeConfigSuggestions.DistinctBy(x => x.Message).ToList(),
            Replacements = protocolReplacementEvaluationResult,
            Vulnerabilities = _vulnerabilities
        };
    }

    private void CheckFirewall(bool firewallEnabled)
    {
        if (!firewallEnabled)
        {
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions, "Firewall suggestion: Need to enable WiFi firewall", 5);
        }
    }

    private void CheckLogMonitoring(bool logMonitoringEnabled)
    {
        if (!logMonitoringEnabled)
        {
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions, "Log monitoring suggestion: Need to enable log monitoring", 4
                );
        }
    }

    private void CheckMaxNumberOfDevices(EvaluateWifiCommand command, int totalWifiDevices)
    {
        var cidr = command.IpRange;
        var totalSupportedIps = TotalSupportedIps(cidr);

        if (totalWifiDevices > totalSupportedIps)
        {
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Supported IP range: Current number of IoMT devices cannot be supported by the current network configuration. You need an additional {totalWifiDevices - totalSupportedIps} IP(s)",
                3);
        }
    }

    private void CheckEncryption(EvaluateWifiCommand command)
    {
        foreach (var accessPoint in command.NetworkDetails.WifiDeploymentDetails.AccessPoints)
        {
            foreach (var frequency in accessPoint.OperationFrequencies)
            {
                if (!_wifiConfig.Standards.TryGetValue(accessPoint.StandardUtilized,
                        out Standard? value) ||
                    !value.OperationFrequenciesInGHz.ContainsKey(frequency.Key))
                {
                    logger.LogWarning(
                        "The specified standard or frequency is not supported by the configuration. Standard: {@Standard}, Frequency: {@Frequency}",
                        accessPoint.StandardUtilized, frequency.Key);
                    continue;
                }

                var utilizedStandardConfig = _wifiConfig.Standards[accessPoint.StandardUtilized];
                var frequencyConfig = utilizedStandardConfig.OperationFrequenciesInGHz[frequency.Key];

                var encryptionTypeSupported = frequencyConfig.Encryption.Keys
                    .ToList(); // Note that the order is based from the least to the most secure.
                // First position is the least secure. We propose the user to utilize whatever encryption type is higher than the currently selected
                // Remember that the encryptionSupported needs to be ordered from the least to the most
                var selectedIndex = encryptionTypeSupported.IndexOf(accessPoint.EncyprionUtilized);
                if (selectedIndex != -1 && selectedIndex <= encryptionTypeSupported.Count)
                {
                    encryptionTypeSupported.RemoveAt(selectedIndex); // Remove the currently selected encryption type

                    encryptionTypeSupported = encryptionTypeSupported
                        .Skip(selectedIndex)
                        .Reverse()
                        .ToList(); // Splice the suggestions list and reverse it

                    // Avoid suggestions if the user already utilizing the best encryption type
                    if (encryptionTypeSupported.Count > 0)
                    {
                        SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                            $"Encryption suggestions: [{accessPoint.AccessPointName}{frequency.Key}] We suggest to utilize one of the following options in the current order to improve your network security: {string.Join(", ", encryptionTypeSupported)}",
                            5);
                    }
                }

                try
                {
                    var userEncryptionAlgorithmSelected = frequency.Value.EncryptionAlgorithmUtilized;
                    var userEncryptionAlgorithmKeyLength = frequency.Value.EncryptionAlgorithmKeyLengthUtilized;

                    var supportedKeyLengths = frequencyConfig
                        .Encryption[accessPoint.EncyprionUtilized]
                        .Algorithm[userEncryptionAlgorithmSelected]
                        .KeyLengthInBits;

                    var suggestedKeyLengths = supportedKeyLengths
                        .Where(keyLength => int.Parse(keyLength) > int.Parse(userEncryptionAlgorithmKeyLength))
                        .OrderDescending()
                        .ToList();

                    if (suggestedKeyLengths.Count != 0)
                    {
                        SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                            $"Encryption key length suggestion: [{accessPoint.AccessPointName}{frequency.Key}]|{userEncryptionAlgorithmSelected}] We suggest to utilize one of the following encryption key length in the current order to improve your network security: {string.Join(",", suggestedKeyLengths)}",
                            3);
                    }
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Failed to suggest encryption key length");
                }
            }

            if (!accessPoint.HiddenSsid)
            {
                SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                    $"SSID Suggestion: [{accessPoint.AccessPointName}] We suggest you hide your AP SSID to improve security",
                    3);
            }

            if (DateTime.Now.Year - accessPoint.FirmwareUpdatedYear > _wifiConfig.FirmwareUpgradeThreshold)
            {
                SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                    $"Firmware upgrade suggestion: [{accessPoint.AccessPointName}] Your access point firmware is more than {_wifiConfig.FirmwareUpgradeThreshold} years old. We suggest you upgrade your firmware",
                    4);
            }
        }
    }

    private void CheckBandwidth(EvaluateWifiCommand command, ICollection<Device> wifiDevices)
    {
        var totalAccessPointsDataRate = 0;
        foreach (var accessPoint in command.NetworkDetails.WifiDeploymentDetails.AccessPoints)
        {
            foreach (var frequency in accessPoint.OperationFrequencies)
            {
                if (!_wifiConfig.Standards.TryGetValue(accessPoint.StandardUtilized,
                        out Standard? value) ||
                    !value.OperationFrequenciesInGHz.ContainsKey(frequency.Key))
                {
                    logger.LogWarning(
                        "The specified standard or frequency is not supported by the configuration. Standard: {@Standard}, Frequency: {@Frequency}",
                        accessPoint.StandardUtilized, frequency.Key);
                    continue;
                }

                totalAccessPointsDataRate += int.Parse(_wifiConfig.Standards[accessPoint.StandardUtilized]
                    .OperationFrequenciesInGHz[frequency.Key].DataRateInMbps);

                var totalIomtDataRates = wifiDevices.Sum(wifiDevice => int.Parse(_wifiConfig
                    .Standards[wifiDevice.WifiSpecs!.StandardUtilized]
                    .OperationFrequenciesInGHz[wifiDevice.WifiSpecs.FrequencyUtilized].DataRateInMbps));

                if (totalIomtDataRates > totalAccessPointsDataRate)
                {
                    SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                        $"Network bandwidth suggestions: The total IoMT data transfer rate ({totalIomtDataRates} Mbps) is higher than the total access point data rate ({totalAccessPointsDataRate} Mbps). Your network needs additional {totalIomtDataRates - totalAccessPointsDataRate} Mbps",
                        4);
                }

                if (totalAccessPointsDataRate > command.BackboneNetworkSpeedInMpbs)
                {
                    SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                        $"Network bandwidth suggestions: Your access points total data rate ({totalAccessPointsDataRate} Mbps) is higher than your backbone network data rate ({command.BackboneNetworkSpeedInMpbs} Mbps). Consider updating your backbone network transfer rates to support at least {totalAccessPointsDataRate - command.BackboneNetworkSpeedInMpbs} additional Mbps.",
                        4);
                }

                if (totalIomtDataRates > command.BackboneNetworkSpeedInMpbs)
                {
                    SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                        $"Network bandwidth suggestions: The total IoMT data transfer rate ({totalIomtDataRates} Mbps) is higher than your backbone network data rate ({command.BackboneNetworkSpeedInMpbs} Mbps). Update your backbone network transfer rates to support at least {totalIomtDataRates - command.BackboneNetworkSpeedInMpbs} additional Mbps",
                        4);
                }

                if (command.Placement != WifiPlacement.Local &&
                    command.IspConnectionSpeedInMpbs < totalIomtDataRates)
                    SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                        $"Network bandwidth suggestions: The total IoMT data transfer rate ({totalIomtDataRates} Mbps) is higher than your ISP connection speed ({command.IspConnectionSpeedInMpbs} Mbps). Update your ISP connection speed to support at least {totalIomtDataRates - command.IspConnectionSpeedInMpbs} additional Mbps",
                        4);

                // TODO: Check also bottleneck between AP and Backbone
            }
        }
    }

    private void CheckLocation(EvaluateWifiCommand command)
    {
        foreach (var accessPoint in command.NetworkDetails.WifiDeploymentDetails.AccessPoints)
        {
            if (!_wifiConfig.ApPhysicalLocation.Contains(accessPoint.PhysicalLocation.ToString()))
            {
                logger.LogError(
                    "The specified Physical location is not supported by the configuration. Please check the configuration file.");
                continue;
            }

            var suggestedLocations = new List<PhysicalLocation>();
            switch (accessPoint.PhysicalLocation)
            {
                case PhysicalLocation.OpenSpace:
                    suggestedLocations.Add(PhysicalLocation.PrivatePlace);
                    suggestedLocations.Add(PhysicalLocation.SecurePlace);
                    break;
                case PhysicalLocation.PrivatePlace:
                    suggestedLocations.Add(PhysicalLocation.SecurePlace);
                    break;
                case PhysicalLocation.SecurePlace:
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            if (PhysicalLocation.SecurePlace != accessPoint.PhysicalLocation)
            {
                SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                    $"Access point physical location suggestions: We suggest to change your access point [{accessPoint.AccessPointName}] physical location with one of the following options in the current order to improve your network security: {string.Join(", ", suggestedLocations)}",
                    3);
            }
        }
    }

    private void CheckPlacement(EvaluateWifiCommand command)
    {
        if (!_wifiConfig.Placement.Contains(command.Placement))
        {
            logger.LogError(
                "The specified Placement is not supported by the configuration. Please check the configuration file.");
            return;
        }

        var suggestedPlacements = new List<WifiPlacement>();
        switch (command.Placement)
        {
            case WifiPlacement.Cloud:
                suggestedPlacements.Add(WifiPlacement.Hybrid);
                suggestedPlacements.Add(WifiPlacement.Local);
                break;
            case WifiPlacement.Hybrid:
                suggestedPlacements.Add(WifiPlacement.Local);
                break;
        }

        if (WifiPlacement.Local != command.Placement)
        {
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Placement suggestions: We suggest to change your network placement with one of the following options in the current order to improve your network security: {string.Join(", ", suggestedPlacements)}",
                2);
        }
    }

    private void CheckTopology(EvaluateWifiCommand command)
    {
        var selectedTopology = command.NetworkDetails.WifiDeploymentDetails.TopologyType;

        var strongerTopologyTypes = EnumUtils.GetHigherEnumOptions(selectedTopology)
            .Where(opt => _wifiConfig.TopologyType.Contains(opt))
            .OrderDescending()
            .ToList();

        if (strongerTopologyTypes.Count <= 0) return;

        SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
            $"Topology suggestions: We suggest to change your network topology with one of the following options in the current order to improve your network security: {string.Join(", ", strongerTopologyTypes)}",
            3);
    }

    private void NetworkLifetimeSuggestions(int selectedNetworkLifetime)
    {
        var networkLifetimeThreshold = _wifiConfig.LifetimeInYears;

        if (selectedNetworkLifetime > networkLifetimeThreshold)
            SuggestionUtils.AddSuggestion(_safeConfigSuggestions,
                $"Network aging suggestion: Your network is more than {networkLifetimeThreshold} years old. Consider replacing your network.",
                2);
    }

    private void OtherConnectedDevicesSuggestions(int otherConnectedDevices)
    {
        if (otherConnectedDevices > 0)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                $"Other connected devices suggestion: You have {otherConnectedDevices} connected devices that are not IoMT. Consider removing them to increase your network security.",
                3);
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
                5
            );
    }

    private void FirmwareIntegritySuggestions(bool firmwareIntegrityCheck)
    {
        if (!firmwareIntegrityCheck)
            SuggestionUtils.AddSuggestion(_mitigationSuggestions,
                "Firmware integrity check suggestion: Need to enable firmware integrity checks if supported by your network hardware.",
                4);
    }

    private void NetworkFailuresSuggestions(List<NetworkFailure> networkFailures)
    {
        logger.LogInformation("Checking network failures suggestion");

        if (!networkFailures.Any())
            return;

        var meanDowntimeThreshold = _wifiConfig.MeanDowntimeInMinutes;
        var meanTimeToRepairThreshold = _wifiConfig.MeanTimeToRepairInMinutes;
        var totalRepairTime = 0;
        var totalDowntime = 0;
        var totalFailures = networkFailures.Count;

        foreach (var failure in networkFailures)
        {
            var cause = failure.CauseOfFailure;
            var failureSuggestions = _wifiConfig.CauseOfFailure[cause];

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

    private void CheckTvra(ICollection<TvraCve> tvraCves, ICollection<Device> wifiDevices)
    {
        var wifiDevicesIpAddresses = wifiDevices
            .Select(x => x.WifiSpecs!.IpAddress)
            .ToHashSet();

        _vulnerabilities = tvraCves
            .Where(x => wifiDevicesIpAddresses.Contains(x.Host) && x.Severity >= 5 && x.QoD >= 50)
            .ToList();
    }

    private static int TotalSupportedIps(string cidr)
    {
        var subnets = int.Parse(cidr.Split('/')[1]);

        return (int)Math.Pow(2, 32 - subnets);
    }
}