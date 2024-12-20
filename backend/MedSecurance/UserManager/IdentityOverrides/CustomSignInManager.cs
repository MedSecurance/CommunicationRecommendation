using MedSecurance.Alerts.AlertManagers.Interfaces;
using MedSecurance.Alerts.Configuration;
using MedSecurance.UserManager.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace MedSecurance.UserManager.IdentityOverrides;

public class CustomSignInManager(
    UserManager<User> userManager,
    IHttpContextAccessor contextAccessor,
    IUserClaimsPrincipalFactory<User> claimsFactory,
    IOptions<IdentityOptions> optionsAccessor,
    ILogger<SignInManager<User>> logger,
    IAuthenticationSchemeProvider schemes,
    IUserConfirmation<User> confirmation,
    IFailedLoginAttemptsAlertManager failedLoginAttemptsAlertManager,
    IOptions<AlertsConfig> alertsConfigOptions
) : SignInManager<User>(userManager, contextAccessor, claimsFactory, optionsAccessor, logger, schemes, confirmation)
{
    private readonly ILogger<SignInManager<User>> _logger = logger;

    public override async Task<SignInResult> PasswordSignInAsync(string userName, string password, bool isPersistent,
        bool lockoutOnFailure)
    {
        var user = await UserManager.FindByNameAsync(userName);
        if (user == null)
        {
            _logger.LogInformation("User with UserName=[{@UserName}] not found", userName);
            return SignInResult.Failed;
        }

        var result = await base.PasswordSignInAsync(userName, password, isPersistent, lockoutOnFailure);

        if (ShouldSendFailedLoginAttemptsAlert(result, user.AccessFailedCount))
        {
            await failedLoginAttemptsAlertManager.Send(user.Email);
        }

        return result;
    }

    private bool ShouldSendFailedLoginAttemptsAlert(SignInResult result, int accessFailedCount)
    {
        return result == SignInResult.Failed && accessFailedCount == alertsConfigOptions.Value.FailedLoginAttempts;
    }
}