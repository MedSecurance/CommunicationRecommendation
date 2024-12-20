using MedSecurance.Alerts.AlertManagers;
using MedSecurance.Alerts.AlertManagers.Interfaces;
using MedSecurance.Alerts.Configuration;

namespace MedSecurance.Alerts.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddAlerts(this IServiceCollection serviceCollection, ConfigurationManager configurationManager)
    {
        serviceCollection.Configure<AlertsConfig>(
            configurationManager.GetSection(AlertsConfig.Alerts)
        );
        
        serviceCollection.AddScoped<
            IFailedLoginAttemptsAlertManager, 
            FailedLoginAttemptsAlertManager
        >();
    }
}