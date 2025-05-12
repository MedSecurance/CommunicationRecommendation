using MedSecurance.ProtocolEvaluator.Models.Wifi;

namespace MedSecurance.ProtocolEvaluator.Models;

public class WifiEvaluationResult : EvaluationResult
{
    public ICollection<TvraCve> Vulnerabilities { get; init; } = new List<TvraCve>();
}