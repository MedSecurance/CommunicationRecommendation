using MediatR;
using MedSecurance.DeviceManager.Models;

namespace MedSecurance.DeviceManager.Queries;

public record GetDeviceByIdQuery(Guid Id) : IRequest<Device>;