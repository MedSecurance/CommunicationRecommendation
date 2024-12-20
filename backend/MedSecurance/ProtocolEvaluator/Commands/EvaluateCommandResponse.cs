namespace MedSecurance.ProtocolEvaluator.Commands;

public record EvaluateCommandResponse(ICollection<string> Suggestions);