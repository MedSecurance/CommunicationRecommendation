using MediatR;
using MedSecurance.DeviceManager.Commands;
using MedSecurance.DeviceManager.Models;
using MedSecurance.DeviceManager.Queries;
using MedSecurance.ProtocolEvaluator.Models.Enums;
using Microsoft.AspNetCore.Mvc;

namespace MedSecurance.DeviceManager;

public static class DeviceManagerEndpointsInit
{
    public static WebApplication AddDevicesEndpoints(this WebApplication app)
    {
        app
            .MapGet("device-manager/devices",
                async (IMediator mediator, Protocol? communicationProtocol, [FromQuery] string? ipAddress,
                    [FromQuery] string? macAddress, [FromQuery] string? networkName) =>
                {
                    return await mediator.Send(new GetDevicesQuery(communicationProtocol, ipAddress, macAddress,
                        networkName));
                })
            .WithName("GetDevices")
            .WithTags("Device Manager");
        //.RequireAuthorization();

        app
            .MapGet("device-manager/devices/{id:guid}",
                async (IMediator mediator, Guid id) =>
                {
                    return Results.Ok(await mediator.Send(new GetDeviceByIdQuery(id)));
                })
            .WithName("GetDeviceById")
            .WithTags("Device Manager")
            .RequireAuthorization();

        app.MapPost("device-manager/devices", async (IMediator mediator, DeviceRequest newDevice) =>
            {
                try
                {
                    var response = await mediator.Send(new CreateDeviceCommand(newDevice));

                    return Results.Created($"/device-manager/devices/{response}", response);
                }
                catch (ApplicationException ex)
                {
                    return Results.BadRequest(ex.Message);
                }
            })
            .WithName("CreateDevice")
            .WithTags("Device Manager")
            .RequireAuthorization();

        app.MapPut("device-manager/devices/{id:guid}",
                async (IMediator mediator, Guid id, DeviceRequest updatedDevice) =>
                {
                    try
                    {
                        await mediator.Send(new UpdateDeviceCommand(id, updatedDevice));

                        return Results.NoContent();
                    }
                    catch (ApplicationException ex)
                    {
                        return Results.BadRequest(ex.Message);
                    }
                })
            .WithName("UpdateDevice")
            .WithTags("Device Manager")
            .RequireAuthorization();

        app.MapDelete("device-manager/devices/{id:guid}", async (IMediator mediator, Guid id) =>
            {
                await mediator.Send(new DeleteDeviceCommand(id));

                return Results.NoContent();
            })
            .WithName("DeleteDevice")
            .WithTags("Device Manager")
            .RequireAuthorization();

        return app;
    }
}