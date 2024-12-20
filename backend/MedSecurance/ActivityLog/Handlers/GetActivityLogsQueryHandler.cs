using MediatR;
using MedSecurance.ActivityLog.Models;
using MedSecurance.ActivityLog.Queries;
using MedSecurance.ActivityLog.Repositories.Interfaces;

namespace MedSecurance.ActivityLog.Handlers;

public class GetActivityLogsQueryHandler(
    IActivityLogRepository repository,
    ILogger<GetActivityLogsQueryHandler> logger)
    : IRequestHandler<GetActivityLogsQuery, GetActivityLogsQueryResponse>
{
    public async Task<GetActivityLogsQueryResponse> Handle(GetActivityLogsQuery request,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling {@RequestType}", nameof(GetActivityLogsQuery));

        var activityLogs = await repository.GetActivityLogs(request.Filters);

        return new GetActivityLogsQueryResponse(activityLogs);
    }
}