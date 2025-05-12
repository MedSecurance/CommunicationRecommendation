using FluentValidation;
using MediatR;
using MedSecurance.ProtocolEvaluator.Commands;
using MedSecurance.ProtocolEvaluator.Commands.AdminConfig;
using MedSecurance.ProtocolEvaluator.Commands.Gsm;
using MedSecurance.ProtocolEvaluator.Commands.Lorawan;
using MedSecurance.ProtocolEvaluator.Commands.RiskAssessment;
using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Queries;
using Microsoft.AspNetCore.Mvc;

namespace MedSecurance.ProtocolEvaluator;

public static class ProtocolEvaluatorEndpointsInit
{
    public static WebApplication AddEvaluatorEndpoints(this WebApplication app)
    {
        app
            .MapPost("protocol-evaluator/evaluate/wifi",
                async (EvaluateWifiCommand command, IMediator mediator, IValidator<EvaluateWifiCommand> validator) =>
                {
                    var validationResult = await validator.ValidateAsync(command);
                    if (!validationResult.IsValid)
                    {
                        var errorMessages = validationResult.Errors
                            .Select(x => $"{x.PropertyName}: {x.ErrorMessage}")
                            .ToList();
                        
                        return Results.BadRequest(errorMessages);
                    }
                    
                    var commandResponse = await mediator.Send(command);
                    return Results.Ok(commandResponse);
                })
            .WithName("Evaluate Wifi")
            .WithTags("Protocol Evaluator")
            .RequireAuthorization("Create");

        app
            .MapPost("protocol-evaluator/evaluate/bluetooth",
                async (EvaluateBluetoothCommand command, IMediator mediator) =>
                {
                    return await mediator.Send(command);
                })
            .WithName("Evaluate Bluetooth")
            .WithTags("Protocol Evaluator")
            .RequireAuthorization("Create");

        app
            .MapPost("protocol-evaluator/evaluate/lorawan",
                async (EvaluateLorawanCommand command, IMediator mediator) => { return await mediator.Send(command); })
            .WithName("Evaluate Lorawan")
            .WithTags("Protocol Evaluator")
            .RequireAuthorization("Create");

        app
            .MapPost("protocol-evaluator/evaluate/gsm",
                async (EvaluateGsmCommand command, IMediator mediator) => { return await mediator.Send(command); })
            .WithName("Evaluate GSM")
            .WithTags("Protocol Evaluator")
            .RequireAuthorization("Create");

        app
            .MapGet("protocol-evaluator/risk-assessments",
                async (IMediator mediator) => { return await mediator.Send(new GetRiskAssessmentsQuery()); })
            .WithName("Get Risk Assessments")
            .WithTags("Protocol Evaluator")
            .RequireAuthorization("View");


        app
            .MapGet("protocol-evaluator/risk-assessments/{id:guid}",
                async (IMediator mediator, Guid id) =>
                {
                    return Results.Ok(await mediator.Send(new GetRiskAssessmentByIdQuery(id)));
                })
            .WithName("Get Risk Assessment By Id")
            .WithTags("Protocol Evaluator")
            .RequireAuthorization("View");

        app.MapDelete("protocol-evaluator/risk-assessments/{id:guid}",
                async (IMediator mediator, Guid id) =>
                {
                    await mediator.Send(new DeleteRiskAssessmentCommand(id));

                    return Results.NoContent();
                })
            .WithName("Delete Risk Assessment")
            .WithTags("Protocol Evaluator")
            .RequireAuthorization("Delete");

        app
            .MapGet("protocol-evaluator/admin-config",
                async (IMediator mediator, [FromQuery] Protocol? communicationProtocol, [FromQuery] string? property,
                    [FromQuery] string? value) =>
                {
                    return await mediator.Send(new GetAdminConfigsQuery(communicationProtocol, property, value));
                })
            .WithName("Get Admin Config")
            .WithTags("Protocol Evaluator")
            .RequireAuthorization("UserAdmin");


        app.MapPut("protocol-evaluator/admin-config",
                async (IMediator mediator, UpdateAdminConfigCommand command) =>
                {
                    try
                    {
                        await mediator.Send(command);

                        return Results.NoContent();
                    }
                    catch (ApplicationException ex)
                    {
                        return Results.BadRequest(ex.Message);
                    }
                })
            .WithName("Update Admin Config")
            .WithTags("Protocol Evaluator")
            .RequireAuthorization("UserAdmin");


        return app;
    }
}