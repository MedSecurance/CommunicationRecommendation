using System.Security.Claims;
using MediatR;
using MedSecurance.ActivityLog.Models;
using MedSecurance.ActivityLog.Repositories.Interfaces;
using MedSecurance.ProtocolEvaluator.Commands.AdminConfig;
using MedSecurance.ProtocolEvaluator.Queries;
using MedSecurance.ProtocolEvaluator.Repository.Interfaces;

namespace MedSecurance.ProtocolEvaluator.Handlers;

public class UpdateAdminConfigCommandHandler(
    ILogger<UpdateAdminConfigCommandHandler> logger,
    IHttpContextAccessor httpContextAccessor,
    IActivityLogRepository activityLogRepository,
    IAdminConfigRepository repository) : IRequestHandler<UpdateAdminConfigCommand>
{
    public async Task Handle(UpdateAdminConfigCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling {@RequestType}", nameof(UpdateAdminConfigCommand));

        var userId = Guid.Parse(httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        var existingAdminConfig = await repository.GetAdminConfigsAsync(
            new GetAdminConfigsQuery(request.UpdatedAdminConfig.Protocol, request.UpdatedAdminConfig.Property));

        if (existingAdminConfig.Count == 0)
        {
            throw new KeyNotFoundException(
                $"Admin config with protocol {request.UpdatedAdminConfig.Protocol} and property {request.UpdatedAdminConfig.Property} not found");
        }

        await repository.UpdateAdminConfigAsync(request.UpdatedAdminConfig);

        await activityLogRepository.CreateActivityLog(new ActivityLogEntity
        {
            UserId = userId,
            Category = ActivityLog.Models.Enums.ActivityLogCategory.AdminConfig,
            Action = ActivityLog.Models.Enums.ActivityLogAction.Update,
            Details =
                $"Admin config with protocol {request.UpdatedAdminConfig.Protocol} and property {request.UpdatedAdminConfig.Property} has been updated"
        });
    }
}