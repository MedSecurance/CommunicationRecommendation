using MediatR;

namespace MedSecurance.DeviceManager.Commands;

public record DeleteDeviceCommand(Guid Id) : IRequest;