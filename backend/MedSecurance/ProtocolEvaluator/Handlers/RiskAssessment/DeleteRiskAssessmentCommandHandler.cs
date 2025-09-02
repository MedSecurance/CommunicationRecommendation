using System.Security.Claims;
using MediatR;
using MedSecurance.ActivityLog.Models;
using MedSecurance.ActivityLog.Models.Enums;
using MedSecurance.ActivityLog.Repositories.Interfaces;
using MedSecurance.Extensions;
using MedSecurance.ProtocolEvaluator.Commands.RiskAssessment;
using MedSecurance.ProtocolEvaluator.Repository.Interfaces;
using MedSecurance.Services;

namespace MedSecurance.ProtocolEvaluator.Handlers.RiskAssessment;

public class DeleteRiskAssessmentCommandHandler(
    IRiskAssessmentRepository repository,
    ILogger<DeleteRiskAssessmentCommandHandler> logger,
    IActivityLogRepository activityLogRepository,
    IHttpContextAccessor httpContextAccessor,
    IEvidenceManagerService evidenceManagerService
) : IRequestHandler<DeleteRiskAssessmentCommand>
{
    public async Task Handle(DeleteRiskAssessmentCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling {@RequestType}", nameof(DeleteRiskAssessmentCommand));

        var userId = Guid.Parse(httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        await repository.DeleteRiskAssessmentAsync(request.Id);

        await activityLogRepository.CreateActivityLog(new ActivityLogEntity
        {
            UserId = userId,
            UserFullName = httpContextAccessor.GetUserFullName(),
            Category = ActivityLogCategory.RiskAssessment,
            Action = ActivityLogAction.Delete,
            Details = $"RiskAssessment with id {request.Id} has been deleted"
        });

        await evidenceManagerService.DeleteRiskAssessmentEvidence(request.Id);
    }
}