using MedSecurance.ProtocolEvaluator.Models;
using MedSecurance.ProtocolEvaluator.Models.Enums;

namespace MedSecurance.Services.Models;

public record RiskAssessmentEvidence(
    Guid RiskAssessmentId, 
    Protocol Protocol, 
    string NetworkName, 
    EvaluationResult EvaluationResult
);