using System.Text.Json.Serialization;
using MedSecurance.ActivityLog.Models.Enums;

namespace MedSecurance.ActivityLog.Models;

public record ActivityLogFilters
{
    public Guid? UserId { get; init; } = null;
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public ActivityLogCategory? Category { get; init; } = null;
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public ActivityLogAction? Action { get; init; } = null;
}