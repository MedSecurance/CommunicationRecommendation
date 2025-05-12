using System.Security.Claims;
using MediatR;
using MedSecurance.ActivityLog.Models;
using MedSecurance.ActivityLog.Models.Enums;
using MedSecurance.ActivityLog.Repositories.Interfaces;
using MedSecurance.DeviceManager.Commands;
using MedSecurance.DeviceManager.Extensions;
using MedSecurance.DeviceManager.Repositories.Interfaces;
using MedSecurance.Extensions;

namespace MedSecurance.DeviceManager.Handlers;

public class UpdateDeviceCommandHandler(
    IDeviceRepository repository,
    ILogger<UpdateDeviceCommandHandler> logger,
    IActivityLogRepository activityLogRepository,
    IHttpContextAccessor httpContextAccessor)
    : IRequestHandler<UpdateDeviceCommand>
{
    public async Task Handle(UpdateDeviceCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling {@RequestType}", nameof(UpdateDeviceCommand));

        var userId = Guid.Parse(httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        if (await repository.GetDeviceByIdAsync(request.Id) == null)
        {
            throw new KeyNotFoundException($"Device with id {request.Id} not found");
        }

        await CheckMacAddressesUniqueness(request);

        await repository.UpdateDeviceAsync(request.Id, request.UpdatedDevice);

        await activityLogRepository.CreateActivityLog(new ActivityLogEntity
        {
            UserId = userId,
            UserFullName = httpContextAccessor.GetUserFullName(),
            Category = ActivityLogCategory.DeviceManagement,
            Action = ActivityLogAction.Update,
            Details = $"Device with id {request.Id} has been updated"
        });
    }

    private async Task CheckMacAddressesUniqueness(UpdateDeviceCommand request)
    {
        var macAddresses = request.UpdatedDevice.FilterMacAddresses();

        if (macAddresses.Count != macAddresses.Distinct().Count())
        {
            throw new ApplicationException("The given MAC addresses are duplicated");
        }

        if (await repository.AnyMacAddressExists(macAddresses, request.Id))
        {
            throw new ApplicationException("The given MAC addresses already exist");
        }
    }
}