using MedSecurance.ProtocolEvaluator.Commands;
using MedSecurance.ProtocolEvaluator.Models;

namespace MedSecurance.ProtocolEvaluator.Evaluators.Interfaces;

public interface IBluetoothEvaluator
{
    Task<EvaluationResult> Evaluate(EvaluateBluetoothCommand command);
}