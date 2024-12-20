using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Models.Lorawan.Enums;

namespace MedSecurance.ProtocolEvaluator.Models;

public class Gateway
{
    public GatewayBackboneConnectionTypes GatewayBackboneConnectionType { get; set; }
    public List<LorawanFrequencyBands> SupportedFrequencyBands { get; set; }
    public LorawanFrequencyBands FrequencyBandUtilized { get; set; }
    public string GatewayName { get; set; }
    public string Manufacturer { get; set; }
    public string Model { get; set; }
    public int FirmwareUpdatedYear { get; set; }
    public PhysicalLocation PhysicalLocation { get; set; }
    public int BandwidthInMbps { get; set; }
    public bool AdaptiveDataRate { get; set; }
}