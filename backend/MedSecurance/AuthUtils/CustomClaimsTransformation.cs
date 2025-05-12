using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;

namespace MedSecurance.AuthUtils;

public class CustomClaimsTransformation : IClaimsTransformation
{
    public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        if (principal.Identity is ClaimsIdentity identity)
        {
            // Collect roles first
            var rolesToAdd = principal.Claims
                .Where(c => c.Type == "realm_access")
                .SelectMany(c => System.Text.Json.JsonDocument.Parse(c.Value)
                    .RootElement.GetProperty("roles").EnumerateArray()
                    .Select(role => role.GetString()))
                .Where(role => !string.IsNullOrEmpty(role))
                .ToList();

            // Add roles after collecting them
            foreach (var role in rolesToAdd)
            {
                identity.AddClaim(new Claim(ClaimTypes.Role, role));
            }
        }

        return Task.FromResult(principal);
    }
}