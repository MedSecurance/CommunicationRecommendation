using MedSecurance.DeviceManager.Models.Enums;
using MedSecurance.ProtocolEvaluator.Models.Enums;

namespace MedSecurance.DeviceManager.Models;

public class Device
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public DeviceTypes Type { get; set; }
    public string Name { get; set; }
    public string SerialNumber { get; set; }
    public string? Manufacturer { get; set; }
    public string? Description { get; set; } = string.Empty;
    public DateTime? ManufacturingDate { get; set; }
    public List<Protocol>? SupportedCommunicationProtocols { get; set; }
    public Protocol CommunicationProtocol { get; set; }
    public string NetworkName { get; set; }
    public string? NetworkIdentifier { get; set; }
    public string? DoctorId { get; set; }
    public PhysicalLocation? Location { get; set; }
    public int? BatteryStatus { get; set; }
    public bool Validated { get; set; }
    public bool StandardCompliance { get; set; }
    public WifiDevice? WifiSpecs { get; set; }
    public BluetoothDevice? BluetoothSpecs { get; set; }
    public LorawanDevice? LorawanSpecs { get; set; }
    public GsmDevice? GsmSpecs { get; set; }
    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}