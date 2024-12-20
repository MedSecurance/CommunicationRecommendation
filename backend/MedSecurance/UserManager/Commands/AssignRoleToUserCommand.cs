using MediatR;
using MedSecurance.UserManager.Models;

namespace MedSecurance.UserManager.Commands;

public record AssignRoleToUserCommand(Guid UserId, AssignRoleRequest Role) : IRequest;