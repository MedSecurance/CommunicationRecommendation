namespace Email.Configuration;

public class EmailConfig
{
    public const string Email = "Email";

    public required string Host { get; init; }
    public required int HostPort { get; init; }
    public required string SenderEmail { get; init; }
    public required string SenderPassword { get; init; }
    public required string SenderName { get; init; }
}