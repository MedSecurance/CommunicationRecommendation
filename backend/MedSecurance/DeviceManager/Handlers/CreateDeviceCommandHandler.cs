using System.Security.Claims;
using Mapster;
using MediatR;
using MedSecurance.ActivityLog.Models;
using MedSecurance.ActivityLog.Models.Enums;
using MedSecurance.ActivityLog.Repositories.Interfaces;
using MedSecurance.DeviceManager.Commands;
using MedSecurance.DeviceManager.Extensions;
using MedSecurance.DeviceManager.Models;
using MedSecurance.DeviceManager.Repositories.Interfaces;
using MedSecurance.Extensions;

namespace MedSecurance.DeviceManager.Handlers;

public class CreateDeviceCommandHandler(
    IDeviceRepository repository,
    ILogger<CreateDeviceCommandHandler> logger,
    IActivityLogRepository activityLogRepository,
    IHttpContextAccessor httpContextAccessor)
    : IRequestHandler<CreateDeviceCommand, Guid>
{
    public async Task<Guid> Handle(CreateDeviceCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling {@RequestType}", nameof(CreateDeviceCommand));

        var device = request.NewDevice.Adapt<Device>();

        await CheckMacAddressesUniqueness(device);

        var returnedId = await repository.AddDeviceAsync(device);

        logger.LogInformation("Device with id {@DeviceId} has been created", returnedId);
        
        var userId = Guid.Parse(httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        
        await activityLogRepository.CreateActivityLog(new ActivityLogEntity
        {
            UserId = userId, 
            UserFullName = httpContextAccessor.GetUserFullName(),
            Category = ActivityLogCategory.DeviceManagement, 
            Action = ActivityLogAction.Add,
            Details = $"Device with id {returnedId} has been created"
        });

        return returnedId;
    }

    private async Task CheckMacAddressesUniqueness(Device device)
    {
        var macAddresses = device.FilterMacAddresses();

        if (macAddresses.Count != macAddresses.Distinct().Count())
        {
            throw new ApplicationException("The given MAC addresses are duplicated");
        }

        if (await repository.AnyMacAddressExists(macAddresses))
        {
            throw new ApplicationException("The given MAC addresses already exist");
        }
    }
}