using MediatR;

namespace MedSecurance.ProtocolEvaluator.Queries;

public record GetRiskAssessmentsQuery : IRequest<GetRiskAssessmentsQueryResponse>;