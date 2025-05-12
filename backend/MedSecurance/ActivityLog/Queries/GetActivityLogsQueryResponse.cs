using MedSecurance.ActivityLog.Models;

namespace MedSecurance.ActivityLog.Queries;

public record GetActivityLogsQueryResponse(IEnumerable<ActivityLogEntity> ActivityLogs);