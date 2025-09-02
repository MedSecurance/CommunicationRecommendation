using System.Security.Claims;
using MediatR;
using MedSecurance.ActivityLog.Models;
using MedSecurance.ActivityLog.Repositories.Interfaces;
using MedSecurance.Extensions;
using MedSecurance.ProtocolEvaluator.Commands;
using MedSecurance.ProtocolEvaluator.Evaluators.Interfaces;
using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Repository.Interfaces;
using MedSecurance.Services;
using MedSecurance.Services.Models;

namespace MedSecurance.ProtocolEvaluator.Handlers;

public class EvaluateWifiCommandHandler(
    ILogger<EvaluateWifiCommandHandler> logger,
    IWifiEvaluator wifiEvaluator,
    IRiskAssessmentRepository riskAssessmentRepository,
    IHttpContextAccessor httpContextAccessor,
    IActivityLogRepository activityLogRepository,
    IEvidenceManagerService evidenceManagerService
) : IRequestHandler<EvaluateWifiCommand, EvaluateWifiCommandResponse>
{
    public async Task<EvaluateWifiCommandResponse> Handle(EvaluateWifiCommand request,
        CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Handling {@RequestType} with Request=[{@Request}]",
            nameof(EvaluateWifiCommand),
            request
        );

        // Retrive the userId of the user that called the API
        var userId = Guid.Parse(httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        var evaluatorResult = await wifiEvaluator.Evaluate(request);

        var isValidGuid = Guid.TryParse(request.RiskAssessmentId, out var riskAssessmentId);

        var riskAssessment = new Models.RiskAssessment.RiskAssessment
        {
            Id = isValidGuid ? riskAssessmentId : Guid.NewGuid(),
            Protocol = Protocol.WiFi,
            UserId = userId,
            NetworkName = request.NetworkName,
            Body = request.RiskAssessmentBody
        };

        // Store the RiskAssessment Form in the DB
        await riskAssessmentRepository.CreateOrUpdateAsync(riskAssessment);

        await activityLogRepository.CreateActivityLog(new ActivityLogEntity
        {
            UserId = userId,
            UserFullName = httpContextAccessor.GetUserFullName(),
            Category = ActivityLog.Models.Enums.ActivityLogCategory.RiskAssessment,
            Action = ActivityLog.Models.Enums.ActivityLogAction.Execute,
            Details = $"{nameof(EvaluateWifiCommand)} RiskAssessment with id {riskAssessment.Id} has been executed"
        });
        
        var response = new EvaluateWifiCommandResponse(
            evaluatorResult.Mitigations,
            evaluatorResult.SafeConfigs,
            evaluatorResult.Replacements,
            evaluatorResult.Vulnerabilities
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