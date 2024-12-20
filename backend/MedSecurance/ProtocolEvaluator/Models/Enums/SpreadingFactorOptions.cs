using System.Text.Json.Serialization;

namespace MedSecurance.ProtocolEvaluator.Models.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum SpreadingFactorOptions
{
    SF7 = 7,
    SF8,
    SF9,
    SF10,
    SF11,
    SF12
}