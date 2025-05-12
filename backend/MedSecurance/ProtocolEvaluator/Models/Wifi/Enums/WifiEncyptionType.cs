using System.Text.Json.Serialization;

namespace MedSecurance.ProtocolEvaluator.Models.Wifi.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum WifiEncyptionType
{
    Open,
    WEP,
    WPA,
    WPA2,
    WPA3
}