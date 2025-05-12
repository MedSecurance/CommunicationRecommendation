using System.Text.Json.Serialization;

namespace MedSecurance.ProtocolEvaluator.Models.Bluetooth.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum BluetoothAntennaType
{
    Chip,
    PcbTrace,
    Dipole,
    Helical,
    Patch,
    Whip
}