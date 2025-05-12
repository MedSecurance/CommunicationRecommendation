using System.Text.Json.Serialization;

namespace MedSecurance.ProtocolEvaluator.Models.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Countries
{
    Europe,
    India,
    MiddleEast,
    Africa,
    UnitedStates,
    Canada,
    SouthAmerica,
    Australia,
    AsiaPacificregion,
    NewZealand,
    SoutheastAsia,
    Japan,
    China,
    SouthKorea,
    Russia
}