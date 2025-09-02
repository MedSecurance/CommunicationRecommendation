using System.Text;
using System.Text.Json;
using MedSecurance.ProtocolEvaluator.Models.Enums;
using MedSecurance.Services.Models;

namespace MedSecurance.Services;

public class EvidenceManagerService(
    ILogger<EvidenceManagerService> logger, 
    IHttpClientFactory factory
) : IEvidenceManagerService
{
    private const string Category = "risk-assessment";

    public async Task UploadRiskAssessmentEvidence(RiskAssessmentEvidence riskAssessmentEvidence)
    {
        var client = factory.CreateClient("EvidenceManagerApi");
        
        var requestBody = new { json_data = riskAssessmentEvidence.EvaluationResult };
        var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

        var comment = $"{riskAssessmentEvidence.Protocol};{riskAssessmentEvidence.NetworkName};{riskAssessmentEvidence.RiskAssessmentId}";
        var commentEscaped = Uri.EscapeDataString(comment);
        
        var originalFilename = EvidenceFilename(riskAssessmentEvidence.Protocol, riskAssessmentEvidence.NetworkName);
        var originalFilenameEscaped = Uri.EscapeDataString(originalFilename);
        
        var requestUri = $"/upload-json/{Category}?comment={commentEscaped}&original_filename={originalFilenameEscaped}";

        try
        {
            logger.LogInformation("Uploading evidence of RiskAssessmentId=[{@RiskAssessmentId}]", riskAssessmentEvidence.RiskAssessmentId);
            var response = await client.PostAsync(requestUri, content);

            response.EnsureSuccessStatusCode();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to upload risk assessment evidence");
        }
    }

    public async Task DeleteRiskAssessmentEvidence(Guid riskAssessmentId)
    {
        var client = factory.CreateClient("EvidenceManagerApi");
        
        try
        {
            var evidenceVersions = await FilterEvidenceVersionsByRiskAssessmentId(riskAssessmentId);

            foreach (var evidenceVersion in evidenceVersions)
            {
                var filename = Uri.EscapeDataString(evidenceVersion.OriginalFilename);
                var requestUri = $"/delete/{Category}/{filename}?version_id={evidenceVersion.VersionId}";
            
                logger.LogInformation(
                    "Deleting Filename=[{@Filename}] and VersionId=[{@VersionId}] evidence of RiskAssessmentId=[{@RiskAssessmentId}]",
                    evidenceVersion.OriginalFilename,
                    evidenceVersion.VersionId,
                    riskAssessmentId
                );
                var response = await client.DeleteAsync(requestUri);
                
                response.EnsureSuccessStatusCode();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to delete risk assessment evidence");
        }
    }

    private async Task<IReadOnlyCollection<EvidenceVersion>> FilterEvidenceVersionsByRiskAssessmentId(Guid riskAssessmentId)
    {
        var riskAssessmentsEvidence = await ListRiskAssessmentsEvidence();

        var result = new List<EvidenceVersion>();
        foreach (var riskAssessmentEvidence in riskAssessmentsEvidence)
        {
            foreach (var evidenceVersion in riskAssessmentEvidence.Value)
            {
                var comment = evidenceVersion.Comment;
                
                if (!string.IsNullOrEmpty(comment))
                {
                    var commentParts = comment.Split(';');
                    if (commentParts.Length > 0 && commentParts.Last() == riskAssessmentId.ToString())
                    {
                        result.Add(evidenceVersion);
                    }
                }
            }
        }
        
        logger.LogInformation(
            "Total of {@Count} risk assessments evidence versions found for RiskAssessmentId=[{@RiskAssessmentId}]", 
            result.Count, 
            riskAssessmentId
        );

        return result;
    }

    private async Task<IReadOnlyDictionary<string, List<EvidenceVersion>>> ListRiskAssessmentsEvidence()
    {
        var client = factory.CreateClient("EvidenceManagerApi");
        
        var listUri = $"/list/{Category}";
        var listResponse = await client.GetAsync(listUri);
        listResponse.EnsureSuccessStatusCode();

        var listJson = await listResponse.Content.ReadAsStringAsync();
        
        var riskAssessmentsEvidence = JsonSerializer.Deserialize<Dictionary<string, List<EvidenceVersion>>>(listJson) 
                                      ?? new Dictionary<string, List<EvidenceVersion>>();
        
        logger.LogInformation("Total of {@Count} risk assessments evidence found", riskAssessmentsEvidence.Count);

        return riskAssessmentsEvidence;
    }

    private static string EvidenceFilename(Protocol protocol, string networkName)
    {
        return $"{protocol}_{networkName}.json"
            .ToLower()
            .Replace(" ", "_");
    }
}