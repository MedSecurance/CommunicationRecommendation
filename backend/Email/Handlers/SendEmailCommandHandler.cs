using Email.Commands;
using Email.Models;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Email.Handlers;

public class SendEmailCommandHandler(ILogger<SendEmailCommand> logger, IEmailClient emailClient)
    : IRequestHandler<SendEmailCommand>
{
    public async Task Handle(SendEmailCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling {@RequestType}", nameof(SendEmailCommand));

        var emailDetails = new EmailDetails(
            request.Recipient, 
            request.Subject, 
            request.HtmlContent
        );

        await emailClient.SendEmail(emailDetails);
    }
}