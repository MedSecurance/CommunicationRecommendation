using MediatR;
using MedSecurance.ProtocolEvaluator.Models.Enums;

namespace MedSecurance.DeviceManager.Queries;

public record GetDevicesQuery(
    Protocol? CommunicationProtocol = null, 
    string? IpAddress = null,
    string? MacAddress = null,
    string? NetworkName = null
) : IRequest<GetDevicesQueryResponse>;