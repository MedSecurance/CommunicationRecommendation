using MedSecurance.DeviceManager.Models.Enums;
using MedSecurance.ProtocolEvaluator.Models.Enums;

namespace MedSecurance.DeviceManager.Models;

public record DeviceRequest(
 string Name,
 DeviceTypes Type,
 string? SerialNumber,
 string? Manufacturer,
 string? Description,
 DateTime? ManufacturingDate,
 List<Protocol> SupportedCommunicationProtocols,
 Protocol CommunicationProtocol,
 string NetworkName,
 string? NetworkIdentifier,
 string? DoctorId,
 PhysicalLocation? Location,
 int? BatteryStatus,
 bool Validated,
 bool StandardCompliance,
 WifiDevice? WifiSpecs,
 BluetoothDevice? BluetoothSpecs,
 LorawanDevice? LorawanSpecs,
 GsmDevice? GsmSpecs);