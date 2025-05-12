using MedSecurance.ProtocolEvaluator.Configuration;
using MedSecurance.ProtocolEvaluator.Queries;

namespace MedSecurance.ProtocolEvaluator.Repository.Interfaces;

public interface IAdminConfigRepository
{
    Task<ICollection<AdminConfig>> GetAdminConfigsAsync(GetAdminConfigsQuery request);
    Task UpdateAdminConfigAsync(AdminConfig adminConfig);
}