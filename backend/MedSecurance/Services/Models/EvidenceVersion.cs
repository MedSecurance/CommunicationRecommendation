using System.Text.Json.Serialization;

namespace MedSecurance.Services.Models;

public class EvidenceVersion
{
    [JsonPropertyName("version_id")]
    public int VersionId { get; set; }

    [JsonPropertyName("original_filename")]
    public string OriginalFilename { get; set; }

    [JsonPropertyName("comment")]
    public string Comment { get; set; }
}