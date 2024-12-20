using MediatR;
using MedSecurance.ProtocolEvaluator.Models;
using MedSecurance.ProtocolEvaluator.Models.Bluetooth;
using MedSecurance.ProtocolEvaluator.Models.Bluetooth.Enums;

namespace MedSecurance.ProtocolEvaluator.Commands;

public record EvaluateBluetoothCommand(
    string NetworkName,
    string? RiskAssessmentId,
    string RiskAssessmentBody,
    int MaxSupportedDevices,
    bool AlreadyImplemented,
    bool LogMonitoringEnabled,
    bool RedundancyMeasures,
    bool IntrusionDetectionSystem,
    bool FirmwareIntegrityCheck,
    DataPrivacyMeasures DataPrivacyMeasures,
    int SecurityAuditFrequencyInYears,
    BluetoothAccessControlMechanism AccessControlMechanism,
    int BackboneNetworkSpeedInMpbs,
    BluetoothNetworkDetails NetworkDetails
    ) : IRequest<EvaluateBluetoothCommandResponse>;
    