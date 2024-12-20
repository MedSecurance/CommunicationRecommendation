using MedSecurance.ProtocolEvaluator.Models.Enums;

namespace MedSecurance.ProtocolEvaluator.Models;

public class NetworkFailure
{
    public CauseOfFailure CauseOfFailure { get; set; }
    public int DowntimeInMinutes { get; set; }
    public int TimeToRepairInMinutes { get; set; }
    public string FailureHandling { get; set; }
}