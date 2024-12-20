namespace MedSecurance.ProtocolEvaluator.Models.Bluetooth;

public class BluetoothVersion
{
    public decimal Version { get; set; }
    public int ChannelBandwidthInMHz { get; set; }
    public int DataRateInMbps { get; set; }
    public int RangeInMeters { get; set; }
    public int MinimumSignalSensitivityInDbm { get; set; }
    public required PowerConsumption PowerConsumptionModes { get; set; }

    public class PowerConsumption
    {
        public decimal SleepModeInMW { get; set; }
        public int TXInMW { get; set; }
        public int RXInMW { get; set; }
        public decimal Voltage { get; set; }
    }
}