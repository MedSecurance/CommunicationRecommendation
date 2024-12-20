namespace MedSecurance.Alerts.Configuration;

public class AlertsConfig
{
    public const string Alerts = "Alerts";
    
    public int FailedLoginAttempts { get; init; }
}