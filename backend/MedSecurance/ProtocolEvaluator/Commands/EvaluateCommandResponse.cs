using MedSecurance.ProtocolEvaluator.Models;

namespace MedSecurance.ProtocolEvaluator.Commands;

public record EvaluateCommandResponse(
    ICollection<EvaluationSuggestion> Mitigations,
    ICollection<EvaluationSuggestion> SafeConfigs,
    ProtocolReplacementEvaluationResult Replacements
);