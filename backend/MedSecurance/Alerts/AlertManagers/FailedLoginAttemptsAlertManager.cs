using Email;
using Email.Models;
using MedSecurance.Alerts.AlertManagers.Interfaces;
using MedSecurance.Alerts.Configuration;
using MedSecurance.Alerts.EmailTemplates;
using MedSecurance.Alerts.Models.Enums;
using Microsoft.Extensions.Options;

namespace MedSecurance.Alerts.AlertManagers;

public class FailedLoginAttemptsAlertManager(
    ILogger<FailedLoginAttemptsAlertManager> logger,
    IEmailClient emailClient,
    IOptions<AlertsConfig> alertsConfigOptions
) : IFailedLoginAttemptsAlertManager
{
    private const string EmailSubject = "Account Security Alert";
    
    private readonly int _failedLoginAttempts = alertsConfigOptions.Value.FailedLoginAttempts;
    
    public async Task Send(string userEmail)
    {
        logger.LogInformation(
            "Will send alert to UserEmail=[{@UserEmail}] for {@FailedLoginAttempts} failed login attempts", 
            userEmail,
            _failedLoginAttempts
        );

        var htmlContent = await EmailTemplateResolver.GetContent(AlertType.FailedLoginAttempts);
        
        var formattedHtmlContent = string.Format(
            htmlContent, 
            _failedLoginAttempts, 
            DateTime.UtcNow.Year
        );

        var emailDetails = new EmailDetails(
            userEmail,
            EmailSubject,
            formattedHtmlContent
        );

        await emailClient.SendEmail(emailDetails);
    }
}