using MediatR;
using MedSecurance.UserManager.Commands;
using MedSecurance.UserManager.Models;
using Microsoft.AspNetCore.Mvc;

namespace MedSecurance.UserManager;

public static class UserEndpointsInit
{
    public static RouteGroupBuilder MapUserEndpoints(this RouteGroupBuilder group)
    {
        group.MapPost("/{userId:guid}/assign-role", 
                async (IMediator mediator, [FromRoute] Guid userId, [FromBody] AssignRoleRequest role) =>
        {
            await mediator.Send(new AssignRoleToUserCommand(userId, role));
            
            return Results.NoContent();
        });
        
        group.MapPost("", 
            async (IMediator mediator, [FromBody] CreateUserWithRoleRequest request) =>
        {
            await mediator.Send(new CreateUserWithRoleCommand(request));
            
            return Results.NoContent();
        });
        
        return group;
    }
}