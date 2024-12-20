using MediatR;
using MedSecurance.UserManager.Models;

namespace MedSecurance.UserManager.Commands;

public record CreateUserWithRoleCommand(CreateUserWithRoleRequest User) : IRequest;