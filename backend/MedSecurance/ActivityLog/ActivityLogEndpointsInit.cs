using MediatR;
using MedSecurance.ActivityLog.Models;
using MedSecurance.ActivityLog.Queries;
using Microsoft.AspNetCore.Mvc;

namespace MedSecurance.ActivityLog;

public static class ActivityLogEndpointsInit
{
    public static RouteGroupBuilder MapActivityLogEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("",
            async (IMediator mediator, [AsParameters] ActivityLogFilters filters) =>
            {
                return await mediator.Send(new GetActivityLogsQuery(filters));
            });

        return group;
    }
}