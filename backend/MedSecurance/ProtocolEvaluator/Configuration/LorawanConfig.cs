using MedSecurance.ProtocolEvaluator.Models;
using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Models.Lorawan;
using MedSecurance.ProtocolEvaluator.Models.Lorawan.Enums;

namespace MedSecurance.ProtocolEvaluator.Configuration;

public class LorawanConfig
{
    public List<PhysicalLocation> PhysicalLocations { get; set; }
    public List<DeploymentTypes> DeploymentTypeOptions { get; set; }
    public List<GatewayBackboneConnectionTypes> GatewayBackboneConnectionTypeOptions { get; set; }
    public List<Countries> DeploymentCountryOptions { get; set; }
    public int LifetimeInYears { get; set; }
    public int FirmwareUpdateYearLimit { get; set; }
    public int SecurityAuditFrequencyInYears { get; set; }
    public int MeanTimeToRepairInMinutes { get; set; }
    public int MeanDowntimeInMinutes { get; set; }
    public Dictionary<CauseOfFailure, List<string>> CauseOfFailure { get; init; }
    public Dictionary<LorawanFrequencyBands, LorawanFrequencyBand> FrequencyBandOptions { get; set; }
}