namespace MedSecurance.Alerts.AlertManagers.Interfaces;

public interface IFailedLoginAttemptsAlertManager
{
    Task Send(string userEmail);
}