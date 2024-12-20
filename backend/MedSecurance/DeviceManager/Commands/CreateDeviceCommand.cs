using MediatR;
using MedSecurance.DeviceManager.Models;

namespace MedSecurance.DeviceManager.Commands;

public record CreateDeviceCommand(DeviceRequest NewDevice) : IRequest<Guid>;