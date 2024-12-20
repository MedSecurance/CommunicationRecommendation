using System.Security.Claims;
using MediatR;
using MedSecurance.ActivityLog.Models;
using MedSecurance.ActivityLog.Models.Enums;
using MedSecurance.ActivityLog.Repositories.Interfaces;
using MedSecurance.DeviceManager.Commands;
using MedSecurance.DeviceManager.Repositories.Interfaces;

namespace MedSecurance.DeviceManager.Handlers;

public class DeleteDeviceCommandHandler(IDeviceRepository repository, 
    ILogger<DeleteDeviceCommandHandler> logger,
    IActivityLogRepository activityLogRepository,
    IHttpContextAccessor httpContextAccessor)
    : IRequestHandler<DeleteDeviceCommand>
{
    public async Task Handle(DeleteDeviceCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling {@RequestType}", nameof(UpdateDeviceCommand));
        
        var userId = Guid.Parse(httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        await repository.DeleteDeviceAsync(request.Id);
        
        await activityLogRepository.CreateActivityLog(new ActivityLogEntity
        {
            UserId = userId, 
            Category = ActivityLogCategory.DeviceManagement, 
            Action = ActivityLogAction.Delete,
            Details = $"Device with id {request.Id} has been deleted"
        });
    }
}