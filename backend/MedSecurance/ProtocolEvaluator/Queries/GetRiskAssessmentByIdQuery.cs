using MediatR;

namespace MedSecurance.ProtocolEvaluator.Queries;

public record GetRiskAssessmentByIdQuery(Guid Id) : IRequest<GetRiskAssessmentByIdQueryResponse>;