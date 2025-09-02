using System.Security.Claims;
using MediatR;
using MedSecurance.ActivityLog.Models;
using MedSecurance.ActivityLog.Repositories.Interfaces;
using MedSecurance.Extensions;
using MedSecurance.ProtocolEvaluator.Commands;
using MedSecurance.ProtocolEvaluator.Commands.Gsm;
using MedSecurance.ProtocolEvaluator.Evaluators.Interfaces;
using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Repository.Interfaces;
using MedSecurance.Services;
using MedSecurance.Services.Models;

namespace MedSecurance.ProtocolEvaluator.Handlers;

public class EvaluateGsmCommandHandler(
    ILogger<EvaluateGsmCommandHandler> logger,
    IGsmEvaluator gsmEvaluator,
    IRiskAssessmentRepository riskAssessmentRepository,
    IHttpContextAccessor httpContextAccessor,
    IActivityLogRepository activityLogRepository,
    IEvidenceManagerService evidenceManagerService
) : IRequestHandler<EvaluateGsmCommand, EvaluateCommandResponse>
{
    public async Task<EvaluateCommandResponse> Handle(EvaluateGsmCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Handling {@RequestType} with Request=[{@Request}]",
            nameof(EvaluateGsmCommand),
            request
        );

        // Retrieve the userId of the user that called the API
        var userId = Guid.Parse(httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        var evaluatorResult = await gsmEvaluator.Evaluate(request);

        var isValidGuid = Guid.TryParse(request.RiskAssessmentId, out var riskAssessmentId);

        var riskAssessment = new Models.RiskAssessment.RiskAssessment
        {
            Id = isValidGuid ? riskAssessmentId : Guid.NewGuid(),
            Protocol = Protocol.GSM,
            UserId = userId,
            NetworkName = request.NetworkName,
            Body = request.RiskAssessmentBody
        };

        // Create or Update the RiskAssessment Form in the DB
        await riskAssessmentRepository.CreateOrUpdateAsync(riskAssessment);

        await activityLogRepository.CreateActivityLog(new ActivityLogEntity
        {
            UserId = userId,
            UserFullName = httpContextAccessor.GetUserFullName(),
            Category = ActivityLog.Models.Enums.ActivityLogCategory.RiskAssessment,
            Action = ActivityLog.Models.Enums.ActivityLogAction.Execute,
            Details = $"{nameof(EvaluateGsmCommand)} RiskAssessment with id {riskAssessment.Id} has been executed"
        });
        
        var response = new EvaluateCommandResponse(
            evaluatorResult.Mitigations,
            evaluatorResult.SafeConfigs,
            evaluatorResult.Replacements
        );
        
        var riskAssessmentEvidence = new RiskAssessmentEvidence(
            riskAssessment.Id, 
            riskAssessment.Protocol, 
            riskAssessment.NetworkName,
            evaluatorResult
        );
        await evidenceManagerService.UploadRiskAssessmentEvidence(riskAssessmentEvidence);

        return response;
    }
}