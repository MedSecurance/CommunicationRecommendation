using System.Text.Json.Serialization;

namespace MedSecurance.ProtocolEvaluator.Models.Wifi.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum WifiStandardType
{
    _802_11a,
    _802_11b,
    _802_11g,
    _802_11n,
    _802_11ac,
    _802_11ax
}