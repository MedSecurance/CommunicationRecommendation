using MedSecurance.ProtocolEvaluator.Models.Wifi.Enums;

namespace MedSecurance.DeviceManager.Models;

public class WifiDevice
{
    public int Bandwidth { get; set; }
    public string Firmware { get; set; }
    public DateTime FirmwareDate { get; set; }
    public List<WifiStandardType> SupportedStandards { get; set; }
    public List<WifiFrequencyOption> SupportedFrequencies { get; set; }
    public WifiStandardType StandardUtilized { get; set; }
    public WifiFrequencyOption FrequencyUtilized { get; set; }
    public string IpAddress { get; set; }
    public string MacAddress { get; set; }
    public WifiEncyptionType Encryption { get; set; }
}