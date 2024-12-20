using System.Text.Json.Serialization;

namespace MedSecurance.ProtocolEvaluator.Models.Lorawan.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum LorawanFrequencyBands
{
    EU868,
    US915,
    AS923,
    AU915,
    CN470,
    KR920,
    IN865,
    RU864,
    RU868
}