using Mapster;
using MedSecurance.DBAccess;
using MedSecurance.ProtocolEvaluator.Models.RiskAssessment;
using MedSecurance.ProtocolEvaluator.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MedSecurance.ProtocolEvaluator.Repository;

public class RiskAssessmentRepository(ApplicationDbContext dbContext) : IRiskAssessmentRepository
{
    public async Task<ICollection<RiskAssessmentDto>> GetRiskAssessmentsAsync()
    {
        IQueryable<RiskAssessment> riskAssessmentsQuery = dbContext.RiskAssessments;

        // TODO: Add filtering, sorting, and pagination

        var riskAssessments = await riskAssessmentsQuery
            .ProjectToType<RiskAssessmentDto>()
            .ToListAsync();

        return riskAssessments;
    }

    public async Task<RiskAssessment?> GetRiskAssessmentByIdAsync(Guid id)
    {
        return await dbContext.RiskAssessments.FindAsync(id);
    }

    public async Task<Guid> CreateOrUpdateAsync(RiskAssessment riskAssessment)
    {
        // Create a new RiskAssessment if it doesn't exist or Update the existing one
        
        var existingRiskAssessment = await dbContext.RiskAssessments.FindAsync(riskAssessment.Id);
        
        if (existingRiskAssessment == null)
        {
            await dbContext.RiskAssessments.AddAsync(riskAssessment);
        }
        else
        {
            existingRiskAssessment.NetworkName = riskAssessment.NetworkName;
            existingRiskAssessment.Body = riskAssessment.Body;
            existingRiskAssessment.Protocol = riskAssessment.Protocol;
            existingRiskAssessment.UserId = riskAssessment.UserId;
            existingRiskAssessment.UpdatedAt = DateTimeOffset.UtcNow;
        }
        
        await dbContext.SaveChangesAsync();
        return riskAssessment.Id;
    }

    public async Task DeleteRiskAssessmentAsync(Guid id)
    {
        var riskAssessment = await dbContext.RiskAssessments.FindAsync(id);
        
        if (riskAssessment is not null)
        {
            dbContext.RiskAssessments.Remove(riskAssessment);
            await dbContext.SaveChangesAsync();
        }
    }
}