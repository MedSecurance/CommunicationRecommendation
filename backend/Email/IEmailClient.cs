using Email.Models;

namespace Email;

public interface IEmailClient
{
    Task SendEmail(EmailDetails emailDetails);
}