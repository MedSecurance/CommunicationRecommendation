using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Models.Wifi.Enums;

namespace MedSecurance.ProtocolEvaluator.Models.Wifi;

public class WifiNetworkDetails
{
    public WifiDeploymentDetails WifiDeploymentDetails { get; set; }
    public List<NetworkFailure> NetworkFailures { get; set; }
}

public class WifiDeploymentDetails
{
    public List<AccessPoint> AccessPoints { get; set; }
}

public class AccessPoint
{
    public List<WifiStandardType> SupportedStandards { get; set; }
    public WifiStandardType StandardUtilized { get; set; }
    public WifiEncyptionType EncyprionUtilized { get; set; }
    public Dictionary<WifiFrequencyOption, Frequency> OperationFrequencies { get; set; }
    public string AccessPointName { get; set; }
    public string Ssid { get; set; }
    public bool HiddenSsid { get; set; }
    public string Manufacturer { get; set; }
    public string Model { get; set; }
    public List<string> AntennaType { get; set; }
    public int FirmwareUpdatedYear { get; set; }
    public PhysicalLocation PhysicalLocation { get; set; }
}

public class Frequency
{
    public WifiAlgorithmType EncryptionAlgorithmUtilized { get; set; }
    public string EncryptionAlgorithmKeyLengthUtilized { get; set; }
}

