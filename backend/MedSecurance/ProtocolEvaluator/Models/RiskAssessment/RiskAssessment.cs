using MedSecurance.ProtocolEvaluator.Models.Enums;

namespace MedSecurance.ProtocolEvaluator.Models.RiskAssessment;

public class RiskAssessment
{
    public Guid Id { get; init; }
    public Guid UserId { get; set; }
    public string? NetworkName { get; set; }
    public Protocol Protocol { get; set; }  
    public string? Body { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}