using System.Security.Claims;

namespace MedSecurance.Extensions;

public static class IHttpContextAccessorExtensions
{
    public static string GetUserFullName(this IHttpContextAccessor httpContextAccessor)
    {
        if (httpContextAccessor.HttpContext is null)
        {
            return string.Empty;
        }
        
        var userName = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.GivenName)?.Value ?? string.Empty;
        var userSurname = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Surname)?.Value ?? string.Empty;
        
        return $"{userName} {userSurname}".Trim();
    }
}