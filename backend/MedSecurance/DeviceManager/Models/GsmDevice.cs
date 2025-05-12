using MedSecurance.ProtocolEvaluator.Models.Gsm.Enums;

namespace MedSecurance.DeviceManager.Models;

public class GsmDevice
{
    public int Bandwidth { get; set; }
    public string Firmware { get; set; }
    public DateTime FirmwareDate { get; set; }
    public List<GsmGeneration> SupportedGenerations { get; set; }
    public GsmGeneration UtilizedGeneration { get; set; }
    public string MacAddress { get; set; }
}