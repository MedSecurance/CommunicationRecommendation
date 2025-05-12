namespace MedSecurance.ProtocolEvaluator.Models;

public class ProtocolReplacementEvaluationResult
{
    public string Title { get; set; } = string.Empty;
    public ICollection<EvaluationSuggestion> Suggestions { get; init; } = new List<EvaluationSuggestion>();
}