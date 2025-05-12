using MediatR;
using MedSecurance.DeviceManager.Models;

namespace MedSecurance.DeviceManager.Commands;

public record UpdateDeviceCommand(Guid Id, DeviceRequest UpdatedDevice) : IRequest;
