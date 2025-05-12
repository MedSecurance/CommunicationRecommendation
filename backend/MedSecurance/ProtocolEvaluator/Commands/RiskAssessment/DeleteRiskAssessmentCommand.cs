using MediatR;

namespace MedSecurance.ProtocolEvaluator.Commands.RiskAssessment;

public record DeleteRiskAssessmentCommand(Guid Id) : IRequest;