namespace MedSecurance.ProtocolEvaluator.Commands;

public record EvaluateBluetoothCommandResponse(ICollection<string> Suggestions);