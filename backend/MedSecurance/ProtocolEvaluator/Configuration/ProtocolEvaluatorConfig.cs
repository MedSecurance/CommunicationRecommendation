namespace MedSecurance.ProtocolEvaluator.Configuration;

public class ProtocolEvaluatorConfig
{
    public const string ProtocolEvaluator = "ProtocolEvaluator";

    public WifiConfig Wifi { get; init; } = new();
    public BluetoothConfig Bluetooth { get; init; } = new();
    public LorawanConfig Lorawan { get; init; } = new();
    public LorawanNodeConfig LorawanNode { get; init; } = new();
    public GsmConfig Gsm { get; init; } = new();
}