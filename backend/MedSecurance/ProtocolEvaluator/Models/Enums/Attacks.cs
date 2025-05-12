using System.Text.Json.Serialization;

namespace MedSecurance.ProtocolEvaluator.Models.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Attacks
{
    Replay,
    MitM,
    Dos,
    UnauthorizedAccess,
    Eavesdropping,
    TamperingAndManipulation,
    PhysicalAttack,
    NetworkJamming
}