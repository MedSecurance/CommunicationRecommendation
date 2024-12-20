using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Models.Gsm;

namespace MedSecurance.ProtocolEvaluator.Configuration;

public class GsmConfig
{
    public int LifetimeInYears { get; set; }
    public int SecurityAuditFrequencyInYears { get; set; }
    public int MeanTimeToRepairInMinutes { get; set; }
    public int MeanDowntimeInMinutes { get; set; }
    public Dictionary<CauseOfFailure, List<string>> CauseOfFailure { get; init; }
    public Dictionary<string, GsmGenerationSpecs> ConnectionType { get; set; }
}