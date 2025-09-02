using MedSecurance.Services.Models;

namespace MedSecurance.Services;

public interface IEvidenceManagerService
{
    Task UploadRiskAssessmentEvidence(RiskAssessmentEvidence riskAssessmentEvidence);
    Task DeleteRiskAssessmentEvidence(Guid riskAssessmentId);
}