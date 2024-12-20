using MedSecurance.ProtocolEvaluator.Models.RiskAssessment;

namespace MedSecurance.ProtocolEvaluator.Repository.Interfaces;

public interface IRiskAssessmentRepository
{
    Task<ICollection<RiskAssessmentDto>> GetRiskAssessmentsAsync();
    Task<RiskAssessment?> GetRiskAssessmentByIdAsync(Guid id);
    Task<Guid> CreateOrUpdateAsync(RiskAssessment riskAssessment);
    Task DeleteRiskAssessmentAsync(Guid id);
}