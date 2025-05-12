using Microsoft.Extensions.DependencyInjection;

namespace Email.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddEmailClient(this IServiceCollection serviceCollection)
    {
        serviceCollection.AddScoped<
            IEmailClient,
            EmailClient
        >();
    }
}