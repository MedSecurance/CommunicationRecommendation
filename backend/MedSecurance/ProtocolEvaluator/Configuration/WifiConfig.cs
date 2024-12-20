using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Models.Wifi.Enums;

namespace MedSecurance.ProtocolEvaluator.Configuration;

public class WifiConfig
{
    public List<WifiPlacement> Placement { get; set; }
    public List<string> ApPhysicalLocation { get; set; }
    public List<string> TopologyType { get; set; }
    public int FirmwareUpgradeThreshold { get; set; }
    public int LifetimeInYears { get; set; }
    public Dictionary<WifiStandardType, Standard> Standards { get; set; }
    public int MeanTimeToRepairInMinutes { get; set; }
    public int MeanDowntimeInMinutes { get; set; }
    public Dictionary<CauseOfFailure, List<string>> CauseOfFailure { get; init; }
}

public class Standard
{
    public Dictionary<WifiFrequencyOption, OperationFrequency> OperationFrequenciesInGHz { get; set; }
}

public class OperationFrequency
{
    public string DataRateInMbps { get; set; }
    public string RangeInMeters { get; set; }
    public string MinimumSignalSensitivityInDbm { get; set; }
    public Dictionary<WifiEncyptionType, Encryption> Encryption { get; set; }
}

public partial class Encryption
{
    public Dictionary<WifiAlgorithmType, Algorithm> Algorithm { get; set; }
}

public class Algorithm
{
    public Dictionary<string, KeyLength> KeyLength { get; set; }
}

public class KeyLength
{
    public string KeyLengthInBits { get; set; }
}