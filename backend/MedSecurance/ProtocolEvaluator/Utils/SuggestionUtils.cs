using MedSecurance.ProtocolEvaluator.Models;

namespace MedSecurance.ProtocolEvaluator.Utils;

public static class SuggestionUtils
{
    public static void AddSuggestion(ICollection<EvaluationSuggestion> suggestions, string message, int weight)
    {
        suggestions.Add(new EvaluationSuggestion { Message = message, Weight = weight });
    }
}