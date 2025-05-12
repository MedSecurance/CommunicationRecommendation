using MedSecurance.ProtocolEvaluator.Commands.Gsm;
using MedSecurance.ProtocolEvaluator.Models;

namespace MedSecurance.ProtocolEvaluator.Evaluators.Interfaces;

public interface IGsmEvaluator
{
    Task<EvaluationResult> Evaluate(EvaluateGsmCommand command);
}