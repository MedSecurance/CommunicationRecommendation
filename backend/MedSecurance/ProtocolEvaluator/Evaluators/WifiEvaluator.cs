using MedSecurance.DeviceManager.Models;
using MedSecurance.DeviceManager.Queries;
using MedSecurance.DeviceManager.Repositories.Interfaces;
using MedSecurance.ProtocolEvaluator.Commands;
using MedSecurance.ProtocolEvaluator.Configuration;
using MedSecurance.ProtocolEvaluator.Evaluators.Interfaces;
using MedSecurance.ProtocolEvaluator.Models;
using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Models.Wifi.Enums;
using MedSecurance.ProtocolEvaluator.Queries;
using MedSecurance.ProtocolEvaluator.Repository.Interfaces;
using Microsoft.Extensions.Options;

namespace MedSecurance.ProtocolEvaluator.Evaluators;

public class WifiEvaluator(
    ILogger<WifiEvaluator> logger,
    IOptions<ProtocolEvaluatorConfig> protocolEvaluatorConfigOptions,
    IDeviceRepository deviceRepository,
    IAdminConfigRepository adminConfigRepository)
    : IWifiEvaluator
{
    private readonly WifiConfig _wifiConfig = protocolEvaluatorConfigOptions.Value.Wifi;

    private readonly ICollection<string> _suggestions = new List<string>();

    public async Task<EvaluationResult> Evaluate(EvaluateWifiCommand command)
    {
        logger.LogInformation("Evaluating Wifi");

        var adminConfigs =
            await adminConfigRepository.GetAdminConfigsAsync(new GetAdminConfigsQuery(Protocol.WiFi));

        _wifiConfig.MeanDowntimeInMinutes =
            int.Parse(adminConfigs
                .FirstOrDefault(x => x is { Property: "MeanDowntimeInMinutes", Protocol: Protocol.WiFi })?.Value!);

        _wifiConfig.MeanTimeToRepairInMinutes =
            int.Parse(adminConfigs
                .FirstOrDefault(x => x is { Property: "MeanTimeToRepairInMinutes", Protocol: Protocol.WiFi })?.Value!);
        
        // TODO: Lifetime is not utilized in the code. Check why is missing

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
        NetworkFailuresSuggestions(command.NetworkDetails.NetworkFailures);
        //CheckTopology(evaluateCommand);

        return new EvaluationResult
        {
            Suggestions = _suggestions
        };
    }

    private void CheckFirewall(bool firewallEnabled)
    {
        if (!firewallEnabled)
        {
            _suggestions.Add("1. Firewall suggestion: Need to enable WiFi firewall");
        }
    }

    private void CheckLogMonitoring(bool logMonitoringEnabled)
    {
        if (!logMonitoringEnabled)
        {
            _suggestions.Add("2. Log monitoring suggestion: Need to enable log monitoring");
        }
    }

    private void CheckMaxNumberOfDevices(EvaluateWifiCommand command, int totalWifiDevices)
    {
        var cidr = command.IpRange;
        var totalSupportedIps = TotalSupportedIps(cidr);

        if (totalWifiDevices > totalSupportedIps)
        {
            _suggestions.Add(
                $"3. Supported IP range: Current number of IoMT devices cannot be supported by the current network configuration. You need an additional {totalWifiDevices - totalSupportedIps} IP(s)");
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
                    logger.LogError(
                        "The specified standard or frequency is not supported by the configuration. Standard: {Standard}, Frequency: {Frequency}",
                        accessPoint.StandardUtilized, frequency.Key);
                    _suggestions.Add(
                        "The specified standard or frequency is not supported by the configuration. Please check the configuration file");
                    continue;
                }

                var encryptionTypeSupported = _wifiConfig.Standards[accessPoint.StandardUtilized]
                    .OperationFrequenciesInGHz[frequency.Key].Encryption.Keys
                    .ToList(); // Note that the order is based from the least to the most secure.
                // First position is the least secure. We propose the user to utilize whatever encryption type is higher than the currently selected
                var selectedIndex =
                    encryptionTypeSupported.IndexOf(accessPoint
                        .EncyprionUtilized); // Remember that the encryptionSupported needs to be ordered from the least to the most
                if (selectedIndex <= encryptionTypeSupported.Count)
                {
                    encryptionTypeSupported
                        .RemoveAt(selectedIndex); // Remove the currently selected encryption type
                    encryptionTypeSupported =
                        encryptionTypeSupported.Skip(selectedIndex).Reverse()
                            .ToList(); // Splice the suggestions list and reverse it
                    if (encryptionTypeSupported.Count >
                        0) // Avoid suggestions if the user already utilizing the best encryption type
                    {
                        _suggestions.Add(
                            $"4.1 Encryption suggestions: [{accessPoint.AccessPointName}{frequency.Key}] We suggest to utilize one of the following options in the current order to improve your network security: {string.Join(", ", encryptionTypeSupported)}");
                    }
                }

                //var supportedKeyLengths = _wifiConfig.Standards[accessPoint.StandardUtilized].OperationFrequenciesInGHz[frequency.Key].Encryption[accessPoint.EncyprionUtilized].Algorithm[accessPoint.OperationFrequencies[frequency.Key].EncryptionAlgorithmUtilized].KeyLength.Keys.ToList();

                // if (supportedKeyLengths.Count > 1 is List<int> keyLengthsList)
                // {
                //     var selectedIndexx = keyLengthsList.IndexOf(accessPoint.OperationFrequencies[frequency.Key].EncryptionAlgorithmKeyLengthUtilized);
                //     if (selectedIndex <= keyLengthsList.Count)
                //     {
                //         keyLengthsList.RemoveAt(selectedIndex);
                //         var keyLengthSuggestions = keyLengthsList.Skip(selectedIndex).Reverse().ToList();
                //         if (keyLengthSuggestions.Count > 0)
                //         {
                //             Suggestions.Add($"4.2 Encryption key length suggestion: [{accessPoint.AccessPointName}{frequency.Key}|{accessPoint.OperationFrequencies[frequency.Key].EncryptionAlgorithmUtilized}] We suggest to utilize one of the following encryption key length in the current order to improve your network security: {string.Join(", ", keyLengthSuggestions)}");
                //         }
                //     }
                // }
            }

            if (!accessPoint.HiddenSsid)
            {
                _suggestions.Add(
                    $"4.3 SSID Suggestion: [{accessPoint.AccessPointName}] We suggest you hide your AP SSID to improve security");
            }

            if (DateTime.Now.Year - accessPoint.FirmwareUpdatedYear > _wifiConfig.FirmwareUpgradeThreshold)
            {
                _suggestions.Add(
                    $"4.4 Firmware upgrade suggestion: [{accessPoint.AccessPointName}] Your access point firmware is more than {_wifiConfig.FirmwareUpgradeThreshold} years old. We suggest you upgrade your firmware");
            }
        }
    }

    private void CheckBandwidth(EvaluateWifiCommand command, IEnumerable<Device> wifiDevices)
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
                    logger.LogError(
                        "The specified standard or frequency is not supported by the configuration. Standard: {Standard}, Frequency: {Frequency}",
                        accessPoint.StandardUtilized, frequency.Key);
                    _suggestions.Add(
                        "The specified standard or frequency is not supported by the configuration. Please check the configuration file");
                    continue;
                }

                totalAccessPointsDataRate += int.Parse(_wifiConfig.Standards[accessPoint.StandardUtilized]
                    .OperationFrequenciesInGHz[frequency.Key].DataRateInMbps);

                var totalIomtDataRates = wifiDevices.Sum(wifiDevice => int.Parse(_wifiConfig
                    .Standards[wifiDevice.WifiSpecs.StandardUtilized]
                    .OperationFrequenciesInGHz[wifiDevice.WifiSpecs.FrequencyUtilized].DataRateInMbps));

                if (totalIomtDataRates > totalAccessPointsDataRate)
                {
                    _suggestions.Add(
                        $"5.1 Network bandwidth suggestions: The total IoMT data transfer rate ({totalIomtDataRates} Mbps) is higher than the total access point data rate ({totalAccessPointsDataRate} Mbps). Your network needs additional {totalIomtDataRates - totalAccessPointsDataRate} Mbps");
                }

                if (totalIomtDataRates > command.BackboneNetworkSpeedInMpbs)
                {
                    _suggestions.Add(
                        $"5.3 Network bandwidth suggestions: The total IoMT data transfer rate ({totalIomtDataRates} Mbps) is higher than your backbone network data rate ({command.BackboneNetworkSpeedInMpbs} Mbps). Update your backbone network transfer rates to support at least {totalIomtDataRates - command.BackboneNetworkSpeedInMpbs} additional Mbps");
                }

                if (command.Placement != WifiPlacement.Local &&
                    command.IspConnectionSpeedInMpbs < totalIomtDataRates)
                    _suggestions.Add(
                        $"5.4 Network bandwidth suggestions: The total IoMT data transfer rate ({totalIomtDataRates} Mbps) is higher than your ISP connection speed ({command.IspConnectionSpeedInMpbs} Mbps). Update your ISP connection speed to support at least {totalIomtDataRates - command.IspConnectionSpeedInMpbs} additional Mbps");

                // TODO: Check also bottleneck between AP and Backbone
            }
        }
    }

    private void CheckLocation(EvaluateWifiCommand command)
    {
        foreach (var accessPoint in command.NetworkDetails.WifiDeploymentDetails.AccessPoints)
        {
            foreach (var frequency in accessPoint.OperationFrequencies)
            {
                if (!_wifiConfig.Standards.TryGetValue(accessPoint.StandardUtilized,
                        out Standard? value) ||
                    !value.OperationFrequenciesInGHz.ContainsKey(frequency.Key))
                {
                    logger.LogError(
                        "The specified standard or frequency is not supported by the configuration. Standard: {Standard}, Frequency: {Frequency}",
                        accessPoint.StandardUtilized, frequency.Key);
                    continue;
                }

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
                    _suggestions.Add(
                        $"6.1 Access point physical location suggestions: We suggest to change your access point [{accessPoint.AccessPointName}] physical location with one of the following options in the current order to improve your network security: {string.Join(", ", suggestedLocations)}");
                }
            }
        }
    }

    private void CheckPlacement(EvaluateWifiCommand command)
    {
        if (!_wifiConfig.Placement.Contains(command.Placement))
        {
            _suggestions.Add(
                $"6. The specified Placement is not supported by the configuration. Please check the configuration file.");
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
            _suggestions.Add(
                $"6.2 Placement suggestions: We suggest to change your network placement with one of the following options in the current order to improve your network security: {string.Join(", ", suggestedPlacements)}");
        }
    }

    private void CheckTopology(EvaluateWifiCommand command)
    {
        throw new NotImplementedException();
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

    private void CheckForGeneralIssues(EvaluateWifiCommand command)
    {
        throw new NotImplementedException();
    }

    private static int TotalSupportedIps(string cidr)
    {
        var subnets = int.Parse(cidr.Split('/')[1]);

        return (int)Math.Pow(2, 32 - subnets);
    }
}