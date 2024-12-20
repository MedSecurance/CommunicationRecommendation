namespace MedSecurance.ProtocolEvaluator.Models;

public class EvaluationResult
{
    public ICollection<string> Suggestions { get; init; } = new List<string>();
}