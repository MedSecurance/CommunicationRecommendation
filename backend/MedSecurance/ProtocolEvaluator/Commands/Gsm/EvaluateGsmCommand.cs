using MediatR;
using MedSecurance.ProtocolEvaluator.Models;
using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Models.Gsm;

namespace MedSecurance.ProtocolEvaluator.Commands.Gsm;

public record EvaluateGsmCommand(
    string NetworkName,
    string? RiskAssessmentId,
    string RiskAssessmentBody,
    string ServiceDescription,
    bool AlreadyImplemented,
    bool LogMonitoringEnabled,
    bool RedundancyMeasures,
    bool FirmwareIntegrityCheck,
    bool IntrusionDetectionSystem,
    int LifetimeInYears,
    DataPrivacyMeasures DataPrivacyMeasures,
    int SecurityAuditFrequencyInYears,
    List<GsmNode> GsmNode,
    List<NetworkFailure> NetworkFailures,
    Summary Summary,
    List<Attacks> Attacks
    ) : IRequest<EvaluateCommandResponse>;