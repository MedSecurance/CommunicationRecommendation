using System.Text.Json.Serialization;

namespace MedSecurance.ProtocolEvaluator.Models.Gsm.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum GsmGeneration
{
    ThreeG,
    FourG,
    FiveG
}