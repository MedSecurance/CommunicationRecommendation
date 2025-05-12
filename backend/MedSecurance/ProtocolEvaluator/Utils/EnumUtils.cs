namespace MedSecurance.ProtocolEvaluator.Utils;

public static class EnumUtils
{
    public static List<T> GetHigherEnumOptions<T>(T selectedOption) where T : Enum
    {
        var selectedValue = Convert.ToInt32(selectedOption);
        return Enum.GetValues(typeof(T))
            .Cast<T>()
            .Where(e => Convert.ToInt32(e) > selectedValue)
            .ToList();
    }    
}
