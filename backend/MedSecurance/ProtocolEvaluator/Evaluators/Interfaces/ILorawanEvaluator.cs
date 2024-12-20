using MedSecurance.ProtocolEvaluator.Commands.Lorawan;
using MedSecurance.ProtocolEvaluator.Models;

namespace MedSecurance.ProtocolEvaluator.Evaluators.Interfaces;

public interface ILorawanEvaluator
{
    Task<EvaluationResult> Evaluate(EvaluateLorawanCommand command);
}