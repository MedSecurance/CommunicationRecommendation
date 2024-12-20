using MediatR;
using MedSecurance.ProtocolEvaluator.Models.Wifi;
using MedSecurance.ProtocolEvaluator.Models.Wifi.Enums;

namespace MedSecurance.ProtocolEvaluator.Commands;

public record EvaluateWifiCommand(
    bool FirewallEnabled,
    bool LogMonitoringEnabled,
    string IpRange,
    int BackboneNetworkSpeedInMpbs,
    int IspConnectionSpeedInMpbs,
    string NetworkName,
    string? RiskAssessmentId,
    string RiskAssessmentBody,
    WifiPlacement Placement,
    WifiNetworkDetails NetworkDetails) : IRequest<EvaluateWifiCommandResponse>;
    