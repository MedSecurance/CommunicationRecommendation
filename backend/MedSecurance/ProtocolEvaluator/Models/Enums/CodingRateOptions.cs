using System.Text.Json.Serialization;

namespace MedSecurance.ProtocolEvaluator.Models.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum CodingRateOptions
{
    FourOverFive,
    FourOverSix,
    FourOverSeven,
    FourOverEight
}