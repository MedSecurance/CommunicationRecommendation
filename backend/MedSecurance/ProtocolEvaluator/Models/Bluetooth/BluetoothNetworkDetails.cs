using MedSecurance.ProtocolEvaluator.Models.Bluetooth.Enums;
using MedSecurance.ProtocolEvaluator.Models.Enums;

namespace MedSecurance.ProtocolEvaluator.Models.Bluetooth;

public class BluetoothNetworkDetails
{
    public BluetoothDeploymentDetails DeploymentDetails { get; set; }
    public List<NetworkFailure> NetworkFailures { get; set; }
    public int OtherConnectedDevices { get; set; }
}

public class BluetoothDeploymentDetails
{
    public BluetoothTopologyType TopologyType { get; set; }
    public int AreaCoverageInMeters { get; set; }
    public LevelOfInterference LevelOfInterference { get; set; }
    public int LifetimeInYears { get; set; }
    public double TypicalLatencyInMs { get; set; }
    public double BandwidthInMbps { get; set; }
    public List<BluetoothNode> BleNodes { get; set; }
}