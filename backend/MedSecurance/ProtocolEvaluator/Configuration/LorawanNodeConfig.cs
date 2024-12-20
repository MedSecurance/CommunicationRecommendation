using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Models.Lorawan.Enums;

namespace MedSecurance.ProtocolEvaluator.Configuration;

public class LorawanNodeConfig
{
    public List<LorawanJoinModes> JoinModeOptions { get; set; }
    public List<LorawanFrequencyBands> SupportedFrequencyBands { get; set; }
    public List<PhysicalLocation> PhysicalLocations { get; set; }
    public LorawanNodeTypes NodeType { get; set; }
}