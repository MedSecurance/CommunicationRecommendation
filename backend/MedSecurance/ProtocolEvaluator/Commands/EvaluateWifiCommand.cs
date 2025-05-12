using MediatR;
using MedSecurance.ProtocolEvaluator.Models.Wifi;
using MedSecurance.ProtocolEvaluator.Models.Wifi.Enums;

namespace MedSecurance.ProtocolEvaluator.Commands;

public record EvaluateWifiCommand(
    bool FirewallEnabled,
    bool AlreadyImplemented,
    bool LogMonitoringEnabled,
    bool RedundancyMeasures,
    bool IntrusionDetectionSystem,
    bool FirmwareIntegrityCheck,
    string IpRange,
    int BackboneNetworkSpeedInMpbs,
    int IspConnectionSpeedInMpbs,
    string NetworkName,
    string? RiskAssessmentId,
    string RiskAssessmentBody,
    WifiPlacement Placement,
    WifiNetworkDetails NetworkDetails,
    ICollection<TvraCve>? TvraCves) : IRequest<EvaluateWifiCommandResponse>;
    