using MedSecurance.ProtocolEvaluator.Commands;
using MedSecurance.ProtocolEvaluator.Models;

namespace MedSecurance.ProtocolEvaluator.Evaluators.Interfaces;

public interface IWifiEvaluator
{
    Task<WifiEvaluationResult> Evaluate(EvaluateWifiCommand command);
}