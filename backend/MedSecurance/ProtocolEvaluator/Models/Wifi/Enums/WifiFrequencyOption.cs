using System.Text.Json.Serialization;

namespace MedSecurance.ProtocolEvaluator.Models.Wifi.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum WifiFrequencyOption
{
    _2_4GHz,
    _5GHz,
    _6GHz
}