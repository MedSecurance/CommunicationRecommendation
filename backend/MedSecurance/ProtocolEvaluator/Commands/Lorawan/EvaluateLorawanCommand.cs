using MediatR;
using MedSecurance.ProtocolEvaluator.Models;
using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.ProtocolEvaluator.Models.Lorawan;

namespace MedSecurance.ProtocolEvaluator.Commands.Lorawan;

public record EvaluateLorawanCommand(
    string NetworkName,
    string? RiskAssessmentId,
    string RiskAssessmentBody,
    string CommunicationProtocolDescription,
    bool AlreadyImplemented,
    int SecurityAuditFrequencyInYears,
    bool RedundancyMeasures,
    bool IntrusionDetectionSystem,
    bool FirmwareIntegrityCheck,
    DataPrivacyMeasures DataPrivacyMeasures,
    LorawanNetworkDetails NetworkDetails,
    List<NetworkFailure> NetworkFailures,
    int OtherConnectedDevices,
    Summary Summary,
    List<Attacks> Attacks) : IRequest<EvaluateCommandResponse>;