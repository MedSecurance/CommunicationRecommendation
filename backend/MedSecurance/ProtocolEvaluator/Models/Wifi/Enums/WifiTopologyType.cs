using System.Text.Json.Serialization;

namespace MedSecurance.ProtocolEvaluator.Models.Wifi.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum WifiTopologyType
{
    SingleAP,
    Star,
    Mesh
}