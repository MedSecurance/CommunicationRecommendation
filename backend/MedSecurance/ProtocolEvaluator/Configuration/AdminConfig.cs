using MedSecurance.ProtocolEvaluator.Models.Enums;

namespace MedSecurance.ProtocolEvaluator.Configuration;

public class AdminConfig
{
    public Protocol Protocol { get; set; }
    public string Property { get; set; }
    public string? Value { get; set; }
}