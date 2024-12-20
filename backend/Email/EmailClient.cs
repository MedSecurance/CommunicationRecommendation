using Email.Configuration;
using Email.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Email;

public class EmailClient : IEmailClient
{
    private readonly ILogger<EmailClient> _logger;
    private readonly EmailConfig _emailConfig;

    public EmailClient(
        ILogger<EmailClient> logger,
        IOptions<EmailConfig> emailConfigOptions
    )
    {
        _logger = logger;
        _emailConfig = emailConfigOptions.Value;
    }
    
    public async Task SendEmail(EmailDetails emailDetails)
    {
        var message = CreateMessage(emailDetails);
        
        _logger.LogInformation(
            "Sending email to {@Recipient} with Subject=[{@Subject}]", 
            emailDetails.Recipient,
            emailDetails.Subject
        );
        
        using var client = new SmtpClient();
        try
        {
            await client.ConnectAsync(_emailConfig.Host, _emailConfig.HostPort, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_emailConfig.SenderEmail, _emailConfig.SenderPassword);
            await client.SendAsync(message);
        }
        catch (Exception exception)
        {
            _logger.LogError(
                exception, 
                "Failed to send email to {@Recipient}", 
                emailDetails.Recipient
            );
        }
        finally
        {
            await client.DisconnectAsync(true);
        }
    }

    private MimeMessage CreateMessage(EmailDetails emailDetails)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_emailConfig.SenderName, _emailConfig.SenderEmail));
        message.To.Add(new MailboxAddress(string.Empty, emailDetails.Recipient));
        message.Subject = emailDetails.Subject;

        message.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = emailDetails.HtmlContent };

        return message;
    }
}