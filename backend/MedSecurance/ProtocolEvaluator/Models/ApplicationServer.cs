namespace MedSecurance.ProtocolEvaluator.Models;

public class ApplicationServer
{
    public string Name { get; set; }
    public List<DeploymentTypes> DeploymentType { get; set; }
    public bool FirewallEnable { get; set; }
    public bool LogMonitoringEnable { get; set; }
    public int BandwidthInMbps { get; set; }
}