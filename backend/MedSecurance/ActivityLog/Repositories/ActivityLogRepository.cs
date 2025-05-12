using MedSecurance.ActivityLog.Models;
using MedSecurance.ActivityLog.Repositories.Interfaces;
using MedSecurance.DBAccess;
using Microsoft.EntityFrameworkCore;

namespace MedSecurance.ActivityLog.Repositories;

public class ActivityLogRepository(ApplicationDbContext dbContext) : IActivityLogRepository
{
    public async Task<ICollection<ActivityLogEntity>> GetActivityLogs(ActivityLogFilters filters)
    {
        IQueryable<ActivityLogEntity> activityLogs = dbContext.ActivityLogsEntity;

        if (filters.UserId.HasValue)
        {
            activityLogs = activityLogs.Where(x => x.UserId == filters.UserId);
        }

        if (filters.Category.HasValue)
        {
            activityLogs = activityLogs.Where(x => x.Category == filters.Category);
        }

        if (filters.Action.HasValue)
        {
            activityLogs = activityLogs.Where(x => x.Action == filters.Action);
        }

        return await activityLogs.ToListAsync();
    }

    public async Task CreateActivityLog(ActivityLogEntity activityLog)
    {
        await dbContext.ActivityLogsEntity.AddAsync(activityLog);

        await dbContext.SaveChangesAsync();
    }
}