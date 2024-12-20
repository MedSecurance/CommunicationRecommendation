namespace MedSecurance.UserManager.Models;

public class CreateUserWithRoleRequest
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string Role { get; set; }
}