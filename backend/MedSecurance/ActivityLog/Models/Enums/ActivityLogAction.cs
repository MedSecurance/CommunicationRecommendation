using System.Text.Json.Serialization;

namespace MedSecurance.ActivityLog.Models.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ActivityLogAction
{
    Add = 1,
    Update = 2,
    Delete = 3,
    Execute = 4
}