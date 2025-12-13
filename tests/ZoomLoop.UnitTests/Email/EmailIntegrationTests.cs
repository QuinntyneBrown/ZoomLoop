// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using NUnit.Framework;
using ZoomLoop.Core.Services.Email;

namespace ZoomLoop.UnitTests.Email;

[TestFixture]
public class EmailIntegrationTests
{
    private ITemplateEngine _templateEngine = null!;
    private IQrCodeGenerator _qrCodeGenerator = null!;

    [SetUp]
    public void Setup()
    {
        _templateEngine = new RazorTemplateEngine();
        _qrCodeGenerator = new QrCodeGenerator();
    }

    [Test]
    public async Task CanEmbedQrCodeInEmailTemplate()
    {
        // Arrange
        var qrContent = "https://example.com/verify?token=abc123";
        var qrCodeBase64 = _qrCodeGenerator.GenerateQrCodeBase64(qrContent);

        var emailTemplate = @"
            <html>
            <body>
                <h1>Welcome @Model.UserName!</h1>
                <p>Please scan the QR code below to verify your account:</p>
                <img src=""data:image/png;base64,@Model.QrCode"" alt=""QR Code"" />
                <p>Or click this link: <a href=""@Model.VerificationUrl"">@Model.VerificationUrl</a></p>
            </body>
            </html>
        ";

        var model = new
        {
            UserName = "John Doe",
            QrCode = qrCodeBase64,
            VerificationUrl = qrContent
        };

        // Act
        var result = await _templateEngine.RenderAsync(emailTemplate, model);

        // Assert
        Assert.That(result, Does.Contain("Welcome John Doe!"));
        Assert.That(result, Does.Contain($"data:image/png;base64,{qrCodeBase64}"));
        Assert.That(result, Does.Contain(qrContent));
    }

    [Test]
    public async Task CanGenerateCompleteEmailWithMultipleQrCodes()
    {
        // Arrange
        var qrCode1 = _qrCodeGenerator.GenerateQrCodeBase64("https://example.com/download");
        var qrCode2 = _qrCodeGenerator.GenerateQrCodeBase64("https://example.com/support");

        var emailTemplate = @"
            <html>
            <body>
                <h1>@Model.Title</h1>
                <div>
                    <h2>Download App</h2>
                    <img src=""data:image/png;base64,@Model.DownloadQrCode"" />
                </div>
                <div>
                    <h2>Contact Support</h2>
                    <img src=""data:image/png;base64,@Model.SupportQrCode"" />
                </div>
            </body>
            </html>
        ";

        var model = new
        {
            Title = "Welcome to ZoomLoop",
            DownloadQrCode = qrCode1,
            SupportQrCode = qrCode2
        };

        // Act
        var result = await _templateEngine.RenderAsync(emailTemplate, model);

        // Assert
        Assert.That(result, Does.Contain("Welcome to ZoomLoop"));
        Assert.That(result, Does.Contain($"data:image/png;base64,{qrCode1}"));
        Assert.That(result, Does.Contain($"data:image/png;base64,{qrCode2}"));
        Assert.That(result, Does.Contain("Download App"));
        Assert.That(result, Does.Contain("Contact Support"));
    }

    [Test]
    public async Task EmailMessage_CanBeCreatedWithTemplatedContent()
    {
        // Arrange
        var qrContent = "https://example.com/reset-password?token=xyz789";
        var qrCodeBase64 = _qrCodeGenerator.GenerateQrCodeBase64(qrContent);

        var template = @"
            <h1>Password Reset Request</h1>
            <p>Hello @Model.Name,</p>
            <p>You requested to reset your password. Scan the QR code below:</p>
            <img src=""data:image/png;base64,@Model.QrCode"" alt=""Reset QR Code"" />
            <p>This link will expire in @Model.ExpirationMinutes minutes.</p>
        ";

        var model = new
        {
            Name = "Jane Smith",
            QrCode = qrCodeBase64,
            ExpirationMinutes = 30
        };

        var htmlBody = await _templateEngine.RenderAsync(template, model);

        // Act
        var emailMessage = new EmailMessage
        {
            To = "jane.smith@example.com",
            Subject = "Password Reset Request",
            HtmlBody = htmlBody,
            PlainTextBody = "Please use the HTML version of this email to reset your password.",
            From = "noreply@zoomloop.com"
        };

        // Assert
        Assert.That(emailMessage.To, Is.EqualTo("jane.smith@example.com"));
        Assert.That(emailMessage.Subject, Is.EqualTo("Password Reset Request"));
        Assert.That(emailMessage.HtmlBody, Does.Contain("Jane Smith"));
        Assert.That(emailMessage.HtmlBody, Does.Contain(qrCodeBase64));
        Assert.That(emailMessage.HtmlBody, Does.Contain("30 minutes"));
        Assert.That(emailMessage.PlainTextBody, Is.Not.Empty);
    }
}
