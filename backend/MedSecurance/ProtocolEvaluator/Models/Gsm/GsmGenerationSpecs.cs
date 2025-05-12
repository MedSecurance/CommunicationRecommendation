using MedSecurance.ProtocolEvaluator.Models.Gsm.Enums;

namespace MedSecurance.ProtocolEvaluator.Models.Gsm;

public class GsmGenerationSpecs
{
    public GsmGeneration Generation { get; set; }
    public List<int> DataSpeedRangeInMbps { get; set; }
    public int LatencyInMilliseconds { get; set; }
    public string SpectrumEfficiency { get; set; }
    public PeakDataRateInMbps PeakDataRateInMbps { get; set; }
    public List<int> SignalStrengthInDbm { get; set; }
    public List<int> SignalToNoiseRationInDb { get; set; }
    public List<double> PacketLossRatePercent { get; set; }
    public Encryption Encryption { get; set; }
}