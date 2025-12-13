// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Azure;
using Azure.Communication.Email;

namespace ZoomLoop.Core.Email;

public class AzureEmailService : IEmailService
{
    private readonly EmailClient _emailClient;
    private readonly string _defaultFromAddress;

    public AzureEmailService(string connectionString, string defaultFromAddress)
    {
        _emailClient = new EmailClient(connectionString);
        _defaultFromAddress = defaultFromAddress;
    }

    public async Task SendEmailAsync(EmailMessage message, CancellationToken cancellationToken = default)
    {
        var emailContent = new EmailContent(message.Subject)
        {
            Html = message.HtmlBody
        };

        if (!string.IsNullOrWhiteSpace(message.PlainTextBody))
        {
            emailContent.PlainText = message.PlainTextBody;
        }

        var emailMessage = new Azure.Communication.Email.EmailMessage(
            senderAddress: message.From ?? _defaultFromAddress,
            recipientAddress: message.To,
            content: emailContent);

        EmailSendOperation emailSendOperation = await _emailClient.SendAsync(
            WaitUntil.Completed,
            emailMessage,
            cancellationToken);

        // Check if the email was successfully sent
        if (emailSendOperation.HasValue && emailSendOperation.Value.Status == EmailSendStatus.Succeeded)
        {
            return;
        }

        var status = emailSendOperation.HasValue ? emailSendOperation.Value.Status.ToString() : "Unknown";
        throw new InvalidOperationException($"Failed to send email. Status: {status}");
    }
}
