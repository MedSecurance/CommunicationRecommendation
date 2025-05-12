using MedSecurance.ProtocolEvaluator.Models.Bluetooth;
using MedSecurance.ProtocolEvaluator.Models.Bluetooth.Enums;
using MedSecurance.ProtocolEvaluator.Models.Enums;

namespace MedSecurance.ProtocolEvaluator.Configuration;

public class BluetoothConfig
{
    public List<BluetoothAntennaType> AntennaTypes { get; init; }
    public List<BluetoothAuthenticationMethod> AuthenticationMethods { get; init; }
    public List<BluetoothDataIntegrity> DataIntegrity { get; init; }
    public List<BluetoothSecureCommunicationChannel> SecureCommunicationChannels { get; init; }
    public List<PhysicalLocation> PhysicalLocations { get; init; }
    public List<BluetoothTopologyType> TopologyType { get; init; }
    public List<BluetoothAccessControlMechanism> AccessControlMechanisms { get; init; }
    public Dictionary<CauseOfFailure, List<string>> CauseOfFailure { get; init; }
    public int MeanTimeToRepairInMinutes { get; set; }
    public int MeanDowntimeInMinutes { get; set; }
    public Dictionary<string, BluetoothVersion> Versions { get; init; }
    public int LifetimeInYears { get; set; }
    public int SecurityAuditFrequencyInYears { get; set; }
}