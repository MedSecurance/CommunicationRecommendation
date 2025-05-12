using MediatR;
using MedSecurance.ProtocolEvaluator.Models.Enums;

namespace MedSecurance.ProtocolEvaluator.Queries;

public record GetAdminConfigsQuery(
    Protocol? CommunicationProtocol = null,
    string? Property = null,
    string? Value = null
) : IRequest<GetAdminConfigsQueryResponse>;