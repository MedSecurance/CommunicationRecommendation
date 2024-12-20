using System.Text.Json.Serialization;

namespace MedSecurance.ProtocolEvaluator.Models.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum GatewayBackboneConnectionTypes
{
    GSM,
    WiFi,
    Cable
}