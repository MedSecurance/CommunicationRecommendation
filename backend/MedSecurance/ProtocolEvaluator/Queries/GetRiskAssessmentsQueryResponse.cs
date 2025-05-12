using MedSecurance.ProtocolEvaluator.Models.RiskAssessment;

namespace MedSecurance.ProtocolEvaluator.Queries;

public record GetRiskAssessmentsQueryResponse(IEnumerable<RiskAssessmentDto> RiskAssessments);