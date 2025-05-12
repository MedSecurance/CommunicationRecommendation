using MedSecurance.DeviceManager.Models;
using MedSecurance.DeviceManager.Queries;

namespace MedSecurance.DeviceManager.Repositories.Interfaces;

public interface IDeviceRepository
{
    Task<ICollection<Device>> GetAllDevicesAsync(GetDevicesQuery request);
    Task<Device?> GetDeviceByIdAsync(Guid id);
    Task<Guid> AddDeviceAsync(Device device);
    Task UpdateDeviceAsync(Guid id, DeviceRequest device);
    Task DeleteDeviceAsync(Guid id);
    Task<bool> AnyMacAddressExists(ICollection<string> macAddresses, Guid? excludedDeviceId = null);
}