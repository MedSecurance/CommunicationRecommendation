using MedSecurance.ProtocolEvaluator.Models.Bluetooth.Enums;

namespace MedSecurance.DeviceManager.Models;

public class BluetoothDevice
{
    public int Bandwidth { get; set; }
    public string Firmware { get; set; }
    public DateTime FirmwareDate { get; set; }
    public List<BluetoothAntennaType> SupportedAntenas { get; set; }
    public List<BluetoothAuthenticationMethod> SupportedAuthenticationMethods { get; set; }
    public List<BluetoothDataIntegrity> SupportedDataIntegrities { get; set; }
    public List<BluetoothTopologyType> SupportedTopologies { get; set; }
    public List<BluetoothAccessControlMechanism> SupportedAccessControlMechanisms { get; set; }
    public List<Decimal> SupportedVersions { get; set; }
    public BluetoothAntennaType UtilizedAntena { get; set; }
    public BluetoothAuthenticationMethod UtilizedAuthenticationMethod { get; set; }
    public BluetoothDataIntegrity UtilizedDataIntegrity { get; set; }
    public BluetoothTopologyType UtilizedTopology { get; set; }
    public BluetoothAccessControlMechanism UtilizedAccessControlMechanism { get; set; }
    public string MacAddress { get; set; }
    public decimal UtilizedVersion { get; set; }
}