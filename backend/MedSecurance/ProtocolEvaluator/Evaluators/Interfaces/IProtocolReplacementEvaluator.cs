using MedSecurance.DeviceManager.Models;
using MedSecurance.ProtocolEvaluator.Models;
using MedSecurance.ProtocolEvaluator.Models.Enums;

namespace MedSecurance.ProtocolEvaluator.Evaluators.Interfaces;

public interface IProtocolReplacementEvaluator
{
    ProtocolReplacementEvaluationResult Evaluate(
        string networkName,
        Protocol utizilizedProtocol,
        ICollection<Device> devices,
        bool alreadyImplemented
    );
}