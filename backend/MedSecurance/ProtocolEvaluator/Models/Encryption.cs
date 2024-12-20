namespace MedSecurance.ProtocolEvaluator.Models;

public class Encryption
{
    public string Type { get; set; }
    public int KeyLengthInBits { get; set; }
    public string Algorithm { get; set; }
}