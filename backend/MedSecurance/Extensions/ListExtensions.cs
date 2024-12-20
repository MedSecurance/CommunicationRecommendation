namespace MedSecurance.Extensions;

public static class ListExtensions
{
    public static void AddIfNotNullOrWhiteSpace(this List<string> list, string? value)
    {
        if (!string.IsNullOrWhiteSpace(value))
        {
            list.Add(value);
        }
    }
}