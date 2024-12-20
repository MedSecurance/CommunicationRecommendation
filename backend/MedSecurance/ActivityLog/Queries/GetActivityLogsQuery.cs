using MediatR;
using MedSecurance.ActivityLog.Models;

namespace MedSecurance.ActivityLog.Queries;

public record GetActivityLogsQuery(
    ActivityLogFilters Filters
) : IRequest<GetActivityLogsQueryResponse>;