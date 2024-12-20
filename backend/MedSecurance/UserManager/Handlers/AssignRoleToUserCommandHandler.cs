using MediatR;
using MedSecurance.UserManager.Commands;
using MedSecurance.UserManager.Models;
using Microsoft.AspNetCore.Identity;

namespace MedSecurance.UserManager.Handlers;

public class AssignRoleToUserCommandHandler : IRequestHandler<AssignRoleToUserCommand>
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ILogger<AssignRoleToUserCommandHandler> _logger;

    public AssignRoleToUserCommandHandler(UserManager<User> userManager, ILogger<AssignRoleToUserCommandHandler> logger,
        RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _logger = logger;
        _roleManager = roleManager;
    }

    public async Task Handle(AssignRoleToUserCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling {@RequestType}", nameof(AssignRoleToUserCommand));
        
        if (_userManager.FindByIdAsync(request.UserId.ToString()).Result is not { } user)
        {
            _logger.LogError("User with id {UserId} not found", request.UserId);
            throw new Exception($"User with id {request.UserId} not found");
        }

        if (!await _roleManager.RoleExistsAsync(request.Role.RoleName))
        {
            _logger.LogError("Role {RoleName} does not exist", request.Role.RoleName);
            throw new Exception($"Role {request.Role.RoleName} does not exist");
        }

        if (await _userManager.IsInRoleAsync(user, request.Role.RoleName))
        {
            _logger.LogInformation("User {UserId} already has role {RoleName}", request.UserId, request.Role.RoleName);
            throw new Exception("User already has role assigned");
        }

        await _userManager.AddToRoleAsync(user, request.Role.RoleName);
        _logger.LogInformation("Role {RoleName} assigned to user {UserId}", request.Role.RoleName, request.UserId);
    }
}