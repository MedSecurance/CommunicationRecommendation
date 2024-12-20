namespace MedSecurance.ProtocolEvaluator.Commands;

public record EvaluateWifiCommandResponse(ICollection<string> Suggestions);