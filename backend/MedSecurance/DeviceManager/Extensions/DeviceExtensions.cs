using MedSecurance.DeviceManager.Models;
using MedSecurance.Extensions;

namespace MedSecurance.DeviceManager.Extensions;

public static class DeviceExtensions
{
    public static ICollection<string> FilterMacAddresses(this Device device)
    {
        var macAddresses = new List<string>();
        macAddresses.AddIfNotNullOrWhiteSpace(device.WifiSpecs?.MacAddress);
        macAddresses.AddIfNotNullOrWhiteSpace(device.BluetoothSpecs?.MacAddress);
        macAddresses.AddIfNotNullOrWhiteSpace(device.LorawanSpecs?.MacAddress);
        macAddresses.AddIfNotNullOrWhiteSpace(device.GsmSpecs?.MacAddress);
        
        return macAddresses;
    }
    
    public static ICollection<string> FilterMacAddresses(this DeviceRequest device)
    {
        var macAddresses = new List<string>();
        macAddresses.AddIfNotNullOrWhiteSpace(device.WifiSpecs?.MacAddress);
        macAddresses.AddIfNotNullOrWhiteSpace(device.BluetoothSpecs?.MacAddress);
        macAddresses.AddIfNotNullOrWhiteSpace(device.LorawanSpecs?.MacAddress);
        macAddresses.AddIfNotNullOrWhiteSpace(device.GsmSpecs?.MacAddress);
        
        return macAddresses;
    }
}