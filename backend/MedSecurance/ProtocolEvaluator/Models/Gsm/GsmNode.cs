using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Models.Gsm.Enums;

namespace MedSecurance.ProtocolEvaluator.Models.Gsm;

public class GsmNode
{
    public string DeviceName { get; set; }
    public string Manufacturer { get; set; }
    public string Model { get; set; }
    public int FirmwareUpdatedYear { get; set; }
    public List<GsmGeneration> SupportedConnectionType { get; set; }
    public GsmGeneration ConnectionTypeUtilized { get; set; }
    public string IspProvider { get; set; }
    public List<NetworkFailure> NetworkFailures { get; set; }
    public Summary Summary { get; set; }
    public List<Attacks> Attacks { get; set; }
}