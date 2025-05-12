using System.Text.Json.Serialization;

namespace MedSecurance.ProtocolEvaluator.Models.Lorawan.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum LorawanJoinModes
{
    ABP,
    OTAA
}