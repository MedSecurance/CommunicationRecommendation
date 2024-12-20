using MedSecurance.ProtocolEvaluator.Models.Enums;

namespace MedSecurance.ProtocolEvaluator.Models.Lorawan;

public class LorawanFrequencyBand
{
    public List<int> FrequencyRangeInMhz { get; set; }
    public PenetrationOptions Penetration { get; set; }
    public List<decimal> DataRateInKbps { get; set; }
    public DeviceCapacityOptions DeviceCapacity { get; set; }
    public List<Countries> RegulatoryCompliance { get; set; }
    public List<SpreadingFactorOptions> SpreadingFactor { get; set; }
    public List<int> Bandwidth { get; set; }
    public List<CodingRateOptions> CodingRate { get; set; }
}