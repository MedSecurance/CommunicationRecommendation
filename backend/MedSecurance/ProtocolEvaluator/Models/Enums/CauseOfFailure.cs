using System.Text.Json.Serialization;

namespace MedSecurance.ProtocolEvaluator.Models.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum CauseOfFailure
{
    HardwareIssue,
    Interference,
    Overload,
    SoftwareFirmware,
    Power,
    Environment,
    ConfigurationError,
    NetworkCongestion
}