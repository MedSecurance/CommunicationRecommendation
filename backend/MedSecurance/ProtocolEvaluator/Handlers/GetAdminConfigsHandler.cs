using MediatR;
using MedSecurance.ProtocolEvaluator.Configuration;
using MedSecurance.ProtocolEvaluator.Queries;
using MedSecurance.ProtocolEvaluator.Repository.Interfaces;

namespace MedSecurance.ProtocolEvaluator.Handlers;

public class GetAdminConfigsHandler(ILogger<GetAdminConfigsHandler> logger, IAdminConfigRepository repository)
    : IRequestHandler<GetAdminConfigsQuery, GetAdminConfigsQueryResponse>
{
    public async Task<GetAdminConfigsQueryResponse> Handle(GetAdminConfigsQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling {@RequestType}", nameof(GetAdminConfigsQuery));
        
        var adminConfigs = await repository.GetAdminConfigsAsync(request);
        
        logger.LogInformation("Returning total of {@TotalGlobalConfig} global config", adminConfigs.Count);
        
        return new GetAdminConfigsQueryResponse(adminConfigs);
    }
}