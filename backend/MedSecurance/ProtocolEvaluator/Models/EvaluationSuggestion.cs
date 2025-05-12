namespace MedSecurance.ProtocolEvaluator.Models;

public class EvaluationSuggestion
{
    public required string Message { get; init; }
    public int Weight { get; init; }
}