using System.Text.Json.Serialization;

namespace MedSecurance.ProtocolEvaluator.Models.Wifi.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum WifiAlgorithmType
{
    None,
    RC4,
    TKIP,
    AES,
    AESCCMP
}