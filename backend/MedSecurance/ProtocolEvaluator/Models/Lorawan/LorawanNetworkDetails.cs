using MedSecurance.ProtocolEvaluator.Models.Enums;

namespace MedSecurance.ProtocolEvaluator.Models.Lorawan;

public class LorawanNetworkDetails
{
    public Countries DeploymentCountry { get; set; }
    public int LifetimeInYears { get; set; }
    public bool MulticastEnable { get; set; }
    public List<Gateway> Gateways { get; set; }
    public NetworkServer NetworkServer { get; set; }
    public ApplicationServer ApplicationServer { get; set; }
}