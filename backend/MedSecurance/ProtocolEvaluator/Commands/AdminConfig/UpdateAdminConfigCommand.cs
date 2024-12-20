using MediatR;

namespace MedSecurance.ProtocolEvaluator.Commands.AdminConfig;

public record UpdateAdminConfigCommand(Configuration.AdminConfig UpdatedAdminConfig) : IRequest;