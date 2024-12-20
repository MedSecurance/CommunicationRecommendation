using MedSecurance.DBAccess;
using MedSecurance.ProtocolEvaluator.Configuration;
using MedSecurance.ProtocolEvaluator.Queries;
using MedSecurance.ProtocolEvaluator.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MedSecurance.ProtocolEvaluator.Repository;

public class AdminConfigRepository(ApplicationDbContext dbContext) : IAdminConfigRepository
{
    public async Task<ICollection<AdminConfig>> GetAdminConfigsAsync(GetAdminConfigsQuery request)
    {
        IQueryable<AdminConfig> adminConfigsQuery = dbContext.AdminConfigs;

        // Conditionally apply the Where filter
        if (request.CommunicationProtocol.HasValue) // Assuming CommunicationProtocol is a nullable enum
            adminConfigsQuery = adminConfigsQuery
                .Where(d => d.Protocol == request.CommunicationProtocol);

        if (!string.IsNullOrEmpty(request.Property))
            adminConfigsQuery = adminConfigsQuery
                .Where(d => d.Property == request.Property);

        if (!string.IsNullOrEmpty(request.Value))
            adminConfigsQuery = adminConfigsQuery
                .Where(d => d.Value == request.Value);

        var globalConfigs = await adminConfigsQuery.ToListAsync();

        return globalConfigs;
    }

    public async Task UpdateAdminConfigAsync(AdminConfig adminConfig)
    {
        var existingAdminConfig = await dbContext.AdminConfigs.FindAsync(adminConfig.Property, adminConfig.Protocol);

        if (existingAdminConfig != null) 
            existingAdminConfig.Value = adminConfig.Value;

        await dbContext.SaveChangesAsync();
    }
}