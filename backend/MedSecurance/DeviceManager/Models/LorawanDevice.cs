using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Models.Lorawan.Enums;

namespace MedSecurance.DeviceManager.Models;

public class LorawanDevice
{
    public int Bandwidth { get; set; }
    public string Firmware { get; set; }
    public DateTime FirmwareDate { get; set; }
    public List<LorawanFrequencyBands> SupportedFrequencyBands { get; set; }
    public LorawanFrequencyBands UtilizedFrequencyBand { get; set; }
    public LorawanJoinModes JoinMode { get; set; }
    public PhysicalLocation PhysicalLocation { get; set; }
    public bool AdaptiveDataRate { get; set; }
    public string MacAddress { get; set; }
}