using MedSecurance.ActivityLog.Models;

namespace MedSecurance.ActivityLog.Repositories.Interfaces;

public interface IActivityLogRepository
{
    Task<ICollection<ActivityLogEntity>> GetActivityLogs(ActivityLogFilters filters);
    // TODO: We may not need it
    // Task<ActivityLogEntity> GetActivityLogById(Guid id);
    Task CreateActivityLog(ActivityLogEntity activityLog);
}