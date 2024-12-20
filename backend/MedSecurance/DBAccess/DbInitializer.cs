using MedSecurance.UserManager.Configuration;
using MedSecurance.UserManager.Models;
using Microsoft.AspNetCore.Identity;

namespace MedSecurance.DBAccess;

public static class DbInitializer
{
    public static void EnsurePlatformAdminUser(ApplicationDbContext applicationDbContext, DefaultPlatformAdminConfig config)
    {
        if (string.IsNullOrWhiteSpace(config.Email))
        {
            return;
        }
        
        // Find the user with NormalizedUserName as it has unique constraint
        // on the database, thus only one user with such username exists
        var platformAdminUser = applicationDbContext.Users.SingleOrDefault(user => 
            user.NormalizedUserName == config.Email.ToUpperInvariant()
        );

        if (platformAdminUser is not null)
        {
            return;
        }
        
        var hasher = new PasswordHasher<User>();
            
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            UserName = config.Email,
            NormalizedUserName = config.Email.ToUpperInvariant(),
            Email = config.Email,
            NormalizedEmail = config.Email.ToUpperInvariant(),
            LockoutEnabled = false,
            PasswordHash = hasher.HashPassword(null, config.Password)
        };

        var platformAdminRole = applicationDbContext.Roles.First(role => role.Name == "PlatformAdmin");
        
        var userRole = new IdentityUserRole<string>
        {
            RoleId = platformAdminRole.Id,
            UserId = user.Id
        };
        
        applicationDbContext.Users.Add(user);
        applicationDbContext.UserRoles.Add(userRole);

        applicationDbContext.SaveChanges();
    }
}