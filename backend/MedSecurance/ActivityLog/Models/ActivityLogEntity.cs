using MedSecurance.ActivityLog.Models.Enums;

namespace MedSecurance.ActivityLog.Models;

public class ActivityLogEntity
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string UserFullName { get; set; } = string.Empty;
    public ActivityLogCategory Category { get; set; }
    public ActivityLogAction Action { get; set; }
    public string? Details { get; set; }
    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; init; } = DateTimeOffset.UtcNow;
}