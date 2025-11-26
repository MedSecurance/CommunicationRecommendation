using MedSecurance.ProtocolEvaluator.Models;
using MedSecurance.ProtocolEvaluator.Models.Wifi;

namespace MedSecurance.ProtocolEvaluator.Queries;

public record GeneratePdfReportQuery(
    ICollection<EvaluationSuggestion> Mitigations,
    ICollection<EvaluationSuggestion> SafeConfigs,
    ProtocolReplacementEvaluationResult Replacements,
    ICollection<TvraCve>? Vulnerabilities
);