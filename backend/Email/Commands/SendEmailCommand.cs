using MediatR;

namespace Email.Commands;

public record SendEmailCommand(string Recipient, string Subject, string HtmlContent) : IRequest;