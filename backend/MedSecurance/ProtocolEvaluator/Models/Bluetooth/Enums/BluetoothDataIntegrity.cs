using System.Text.Json.Serialization;

namespace MedSecurance.ProtocolEvaluator.Models.Bluetooth.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum BluetoothDataIntegrity
{
    None,
    Crc,
    Mac
}