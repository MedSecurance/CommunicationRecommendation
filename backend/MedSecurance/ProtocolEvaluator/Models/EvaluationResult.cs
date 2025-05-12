namespace MedSecurance.ProtocolEvaluator.Models;

public class EvaluationResult
{
    public ICollection<EvaluationSuggestion> Mitigations { get; init; } = new List<EvaluationSuggestion>();
    public ICollection<EvaluationSuggestion> SafeConfigs { get; init; } = new List<EvaluationSuggestion>();
    public ProtocolReplacementEvaluationResult Replacements { get; init; } = new();
}