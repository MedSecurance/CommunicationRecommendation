using MedSecurance.ProtocolEvaluator.Models;
using MedSecurance.ProtocolEvaluator.Models.Wifi;

namespace MedSecurance.ProtocolEvaluator.Commands;

public record EvaluateWifiCommandResponse(
    ICollection<EvaluationSuggestion> Mitigations,
    ICollection<EvaluationSuggestion> SafeConfigs,
    ProtocolReplacementEvaluationResult Replacements,
    ICollection<TvraCve> Vulnerabilities
) : EvaluateCommandResponse(Mitigations, SafeConfigs, Replacements);