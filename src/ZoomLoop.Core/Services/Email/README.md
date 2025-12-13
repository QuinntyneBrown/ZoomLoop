# Email Notification Service

This directory contains the email notification service for ZoomLoop, which supports sending emails with Razor templates and embedded QR codes using Azure Communication Services.

## Features

- **Razor Template Engine**: Generate dynamic email content using Razor syntax
- **QR Code Generation**: Create and embed QR codes in emails
- **Azure Communication Services**: Send emails via Azure's reliable email infrastructure
- **Flexible Configuration**: Easy configuration through appsettings.json

## Components

### Interfaces

- **IEmailService**: Core email sending service
- **ITemplateEngine**: Razor template rendering engine
- **IQrCodeGenerator**: QR code generation service

### Implementations

- **AzureEmailService**: Email service using Azure Communication Services
- **RazorTemplateEngine**: Template engine powered by RazorEngineCore
- **QrCodeGenerator**: QR code generator using QRCoder library

## Configuration

Add the following to your `appsettings.json`:

```json
{
  "Email": {
    "AzureCommunicationServicesConnectionString": "endpoint=https://YOUR_RESOURCE_NAME.communication.azure.com/;accesskey=YOUR_ACCESS_KEY",
    "DefaultFromAddress": "donotreply@yourdomain.com"
  }
}
```

### Azure Setup

1. Create an Azure Communication Services resource in Azure Portal
2. Add an Email Communication Service to your resource
3. Configure a verified domain or use Azure Managed Domain
4. Copy the connection string from Keys section
5. Update the configuration in appsettings.json

## Usage Examples

### Simple Email with Template

```csharp
var template = "Hello @Model.Name!";
var model = new { Name = "John" };
var htmlBody = await templateEngine.RenderAsync(template, model);

var emailMessage = new EmailMessage
{
    To = "user@example.com",
    Subject = "Hello",
    HtmlBody = htmlBody
};

await emailService.SendEmailAsync(emailMessage);
```

### Email with Embedded QR Code

```csharp
var qrContent = "https://example.com/verify?token=abc123";
var qrCodeBase64 = qrCodeGenerator.GenerateQrCodeBase64(qrContent);

var template = @"
    <h1>Verify Your Account</h1>
    <img src='data:image/png;base64,@Model.QrCode' alt='QR Code' />
";

var model = new { QrCode = qrCodeBase64 };
var htmlBody = await templateEngine.RenderAsync(template, model);

var emailMessage = new EmailMessage
{
    To = "user@example.com",
    Subject = "Account Verification",
    HtmlBody = htmlBody,
    PlainTextBody = "Please verify your account."
};

await emailService.SendEmailAsync(emailMessage);
```

For more examples, see `EmailServiceSamples.cs`.

## Dependency Injection

Services are automatically registered in `ConfigureServices.cs`:

```csharp
services.AddSingleton<ITemplateEngine, RazorTemplateEngine>();
services.AddSingleton<IQrCodeGenerator, QrCodeGenerator>();
services.AddSingleton<IEmailService>(sp => {
    var emailConfig = configuration.GetSection("Email").Get<EmailConfiguration>();
    return new AzureEmailService(
        emailConfig.AzureCommunicationServicesConnectionString,
        emailConfig.DefaultFromAddress);
});
```

## Testing

Comprehensive unit tests are available in `tests/ZoomLoop.UnitTests/Email/`:

- **RazorTemplateEngineTests**: Template rendering tests
- **QrCodeGeneratorTests**: QR code generation tests
- **EmailIntegrationTests**: Integration tests for templates + QR codes

Run tests with:
```bash
dotnet test tests/ZoomLoop.UnitTests/ZoomLoop.UnitTests.csproj
```

## NuGet Packages Used

All packages are MIT licensed:

- **RazorEngineCore** (2024.4.1): Razor template compilation and rendering
- **QRCoder** (1.6.0): QR code generation
- **Azure.Communication.Email** (1.1.0): Azure email service client

## Best Practices

1. **Template Security**: Avoid using user-provided templates directly to prevent code injection
2. **QR Code Size**: Use appropriate `pixelsPerModule` parameter for different use cases (default: 20)
3. **Email Content**: Always provide both HTML and plain text versions when possible
4. **Error Handling**: Wrap email sending in try-catch blocks and log failures
5. **Configuration**: Use Azure Key Vault for production connection strings

## Support

For issues or questions, please refer to the main ZoomLoop documentation or create an issue in the repository.
