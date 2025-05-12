using MedSecurance.Alerts.Models.Enums;

namespace MedSecurance.Alerts.EmailTemplates;

public static class EmailTemplateResolver
{
    public static async Task<string> GetContent(AlertType alertType)
    {
        var emailTemplatesPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Alerts", "EmailTemplates");
        
        var templatePath = alertType switch
        {
            AlertType.FailedLoginAttempts => Path.Combine(emailTemplatesPath, "failed-login-attempts.html"),
            _ => throw new ArgumentOutOfRangeException(nameof(alertType), alertType, null)
        };

        return await File.ReadAllTextAsync(templatePath);
    }
}