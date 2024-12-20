using System.Text.Json.Serialization;

namespace MedSecurance.ProtocolEvaluator.Models.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Protocol
{
    WiFi,
    Bluetooth,
    GSM,
    LoraWan
}