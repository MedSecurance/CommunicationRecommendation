using Mapster;
using MedSecurance.DBAccess;
using MedSecurance.DeviceManager.Models;
using MedSecurance.DeviceManager.Queries;
using MedSecurance.DeviceManager.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MedSecurance.DeviceManager.Repositories;

public class DeviceRepository : IDeviceRepository
{
    private readonly ApplicationDbContext _dbContext;

    public DeviceRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ICollection<Device>> GetAllDevicesAsync(GetDevicesQuery request)
    {
        var devicesQuery = _dbContext.Devices
            .Include(d => d.WifiSpecs)
            .Include(d => d.BluetoothSpecs)
            .Include(d => d.LorawanSpecs)
            .Include(d => d.GsmSpecs)
            .AsSplitQuery();

        // Conditionally apply the Where filter
        if (request.CommunicationProtocol.HasValue) // Assuming CommunicationProtocol is a nullable enum
            devicesQuery = devicesQuery
                .Where(d => d.CommunicationProtocol == request.CommunicationProtocol);

        if (!string.IsNullOrEmpty(request.IpAddress))
            devicesQuery = devicesQuery
                .Where(d => d.WifiSpecs != null && d.WifiSpecs.IpAddress == request.IpAddress);

        if (!string.IsNullOrEmpty(request.MacAddress))
        {
            var macAddress = request.MacAddress.ToUpper();
            
            devicesQuery = devicesQuery
                .Where(d => 
                    d.WifiSpecs != null && d.WifiSpecs.MacAddress.ToUpper() == macAddress || 
                    d.BluetoothSpecs != null && d.BluetoothSpecs.MacAddress.ToUpper() == macAddress || 
                    d.LorawanSpecs != null && d.LorawanSpecs.MacAddress.ToUpper() == macAddress || 
                    d.GsmSpecs != null && d.GsmSpecs.MacAddress.ToUpper() == macAddress
                );
        }
            

        if (!string.IsNullOrEmpty(request.NetworkName))
            devicesQuery = devicesQuery
                .Where(d => d.NetworkName == request.NetworkName);

        return await devicesQuery.ToListAsync();
    }

    public async Task<Device?> GetDeviceByIdAsync(Guid id)
    {
        var device = await _dbContext.Devices.FindAsync(id);

        return device;
    }

    public async Task<Guid> AddDeviceAsync(Device device)
    {
        await _dbContext.Devices.AddAsync(device);
        await _dbContext.SaveChangesAsync();

        return device.Id;
    }

    public async Task UpdateDeviceAsync(Guid id, DeviceRequest device)
    {
        // Retrieve the existing entity from the database
        var existingDevice = await _dbContext.Devices.FindAsync(id);

        if (existingDevice != null)
        {
            // Use Mapster to map the properties from the DTO to the existing entity 
            device.Adapt(existingDevice);
            
            // Manually set the UpdatedAt field
            existingDevice.UpdatedAt = DateTime.UtcNow;
            
            // Save changes to the database
            await _dbContext.SaveChangesAsync();
        }
    }

    public async Task DeleteDeviceAsync(Guid id)
    {
        var device = await GetDeviceByIdAsync(id);

        if (device is not null)
        {
            _dbContext.Devices.Remove(device);
            await _dbContext.SaveChangesAsync();
        }
    }

    public async Task<bool> AnyMacAddressExists(ICollection<string> macAddresses, Guid? excludedDeviceId = null)
    {
        var query = _dbContext.Devices
            .Include(d => d.WifiSpecs)
            .Include(d => d.BluetoothSpecs)
            .Include(d => d.LorawanSpecs)
            .Include(d => d.GsmSpecs)
            .AsSplitQuery()
            .Where(d => 
                d.WifiSpecs != null && macAddresses.Contains(d.WifiSpecs.MacAddress)
                || d.BluetoothSpecs != null && macAddresses.Contains(d.BluetoothSpecs.MacAddress)
                || d.LorawanSpecs != null && macAddresses.Contains(d.LorawanSpecs.MacAddress)
                || d.GsmSpecs != null && macAddresses.Contains(d.GsmSpecs.MacAddress)
            );

        if (excludedDeviceId is not null)
        {
            query = query.Where(d => d.Id != excludedDeviceId);
        }
        
        return await query.AnyAsync();
    }
}