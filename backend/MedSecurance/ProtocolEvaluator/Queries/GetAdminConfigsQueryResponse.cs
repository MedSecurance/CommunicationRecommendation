using MedSecurance.ProtocolEvaluator.Configuration;

namespace MedSecurance.ProtocolEvaluator.Queries;

public record GetAdminConfigsQueryResponse(IEnumerable<AdminConfig> AdminConfigs);