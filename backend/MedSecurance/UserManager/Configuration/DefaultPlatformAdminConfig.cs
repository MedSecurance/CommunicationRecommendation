namespace MedSecurance.UserManager.Configuration;

public class DefaultPlatformAdminConfig
{
    public const string DefaultPlatformAdmin = "DefaultPlatformAdmin";

    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}