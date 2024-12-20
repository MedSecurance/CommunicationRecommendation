using MedSecurance.ProtocolEvaluator.Models.Enums;

namespace MedSecurance.ProtocolEvaluator.Models.RiskAssessment;

public class RiskAssessmentDto
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string NetworkName { get; set; }
    public Protocol Protocol { get; set; }
    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}