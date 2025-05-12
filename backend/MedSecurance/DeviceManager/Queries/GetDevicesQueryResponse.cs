using MedSecurance.DeviceManager.Models;

namespace MedSecurance.DeviceManager.Queries;

public record GetDevicesQueryResponse(IEnumerable<Device> Devices);
