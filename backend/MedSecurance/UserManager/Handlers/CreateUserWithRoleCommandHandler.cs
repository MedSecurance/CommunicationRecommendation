using System.ComponentModel.DataAnnotations;
using MediatR;
using MedSecurance.UserManager.Commands;
using MedSecurance.UserManager.Models;
using Microsoft.AspNetCore.Identity;

namespace MedSecurance.UserManager.Handlers;

public class CreateUserWithRoleCommandHandler : IRequestHandler<CreateUserWithRoleCommand>
{
    private readonly ILogger<AssignRoleToUserCommandHandler> _logger;
    private readonly UserManager<User> _userManager;
    private readonly EmailAddressAttribute _emailAddressAttribute = new();

    public CreateUserWithRoleCommandHandler(
        ILogger<AssignRoleToUserCommandHandler> logger, 
        UserManager<User> userManager
    )
    {
        _logger = logger;
        _userManager = userManager;
    }
    
    public async Task Handle(CreateUserWithRoleCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling {@RequestType}", nameof(AssignRoleToUserCommand));
        
        // Email Validation
        if (string.IsNullOrEmpty(request.User.Email) || !_emailAddressAttribute.IsValid(request.User.Email))
        {
            _logger.LogError("Invalid email {Email}", request.User.Email);
            throw new Exception($"Invalid email {request.User.Email}");
        }

        var user = new User
        {
            Email = request.User.Email,
            UserName = request.User.Email,
            PasswordHash = request.User.Password
        };
        
        var result = _userManager.CreateAsync(user, request.User.Password).Result;
        
        if (!result.Succeeded)
        {
            _logger.LogError("Error creating user {Email}", request.User.Email);
            throw new Exception($"Error creating user {request.User.Email}, because {result.Errors.FirstOrDefault()}");
        }
        
        if (!_userManager.AddToRoleAsync(user, request.User.Role).Result.Succeeded)
        {
            _logger.LogError("Error assigning role {Role} to user {Email}", request.User.Role, request.User.Email);
            throw new Exception($"Error assigning role {request.User.Role} to user {request.User.Email}");
        }
        
        _logger.LogInformation("User {Email} created with role {Role}", request.User.Email, request.User.Role);
    }
}