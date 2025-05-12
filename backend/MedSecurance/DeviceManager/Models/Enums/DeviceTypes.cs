using System.Text.Json.Serialization;

namespace MedSecurance.DeviceManager.Models.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum DeviceTypes
{
    Sensor,
    Actuator,
    Collector    
}