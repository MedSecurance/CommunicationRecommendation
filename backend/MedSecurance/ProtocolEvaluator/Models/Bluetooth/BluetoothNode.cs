using MedSecurance.ProtocolEvaluator.Models.Bluetooth.Enums;
using MedSecurance.ProtocolEvaluator.Models.Enums;

namespace MedSecurance.ProtocolEvaluator.Models.Bluetooth;

public class BluetoothNode
{
    public List<decimal> SupportedVersions { get; set; }
    public decimal VersionUtilized { get; set; }
    public bool GatewayIntermediateDevice { get; set; }
    public string DeviceName { get; set; }
    public string MacAddress { get; set; }
    public string Manufacturer { get; set; }
    public string Model { get; set; }
    public BluetoothAntennaType AntennaType { get; set; }
    public BluetoothAuthenticationMethod AuthenticationMethod { get; set; }
    public BluetoothDataIntegrity DataIntegrity { get; set; }
    public BluetoothSecureCommunicationChannel SecureCommunicationChannel { get; set; }
    public int FirmwareUpdatedYear { get; set; }
    public PhysicalLocation PhysicalLocation { get; set; }
}