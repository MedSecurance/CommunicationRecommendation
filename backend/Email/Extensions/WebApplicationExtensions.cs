using Email.Commands;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Email.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication AddEmailEndpoints(this WebApplication app)
    {
        app
            .MapPost("email/send",
                async (SendEmailCommand command, IMediator mediator) =>
                {
                    await mediator.Send(command);
                    
                    return Results.NoContent();
                })
            .WithName("SendEmail")
            .WithTags("Email");
        
        return app;
    }
}