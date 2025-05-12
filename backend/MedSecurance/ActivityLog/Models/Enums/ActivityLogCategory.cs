using System.Text.Json.Serialization;

namespace MedSecurance.ActivityLog.Models.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ActivityLogCategory
{
    UserManagement = 1,
    DeviceManagement = 2,
    RiskAssessment = 3,
    AdminConfig = 4,
}