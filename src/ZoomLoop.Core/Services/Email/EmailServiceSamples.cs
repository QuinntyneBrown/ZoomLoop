// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Services.Email;

/// <summary>
/// Sample usage examples for the Email Notification Service.
/// </summary>
public static class EmailServiceSamples
{
    /// <summary>
    /// Example: Send a simple email with template rendering
    /// </summary>
    public static async Task SendWelcomeEmail(
        IEmailService emailService,
        ITemplateEngine templateEngine,
        string recipientEmail,
        string userName)
    {
        var template = @"
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .header { background-color: #007bff; color: white; padding: 20px; }
                    .content { padding: 20px; }
                </style>
            </head>
            <body>
                <div class='header'>
                    <h1>Welcome to ZoomLoop!</h1>
                </div>
                <div class='content'>
                    <p>Hello @Model.UserName,</p>
                    <p>Thank you for joining ZoomLoop. We're excited to have you on board!</p>
                    <p>Best regards,<br/>The ZoomLoop Team</p>
                </div>
            </body>
            </html>
        ";

        var model = new { UserName = userName };
        var htmlBody = await templateEngine.RenderAsync(template, model);

        var emailMessage = new EmailMessage
        {
            To = recipientEmail,
            Subject = "Welcome to ZoomLoop",
            HtmlBody = htmlBody,
            PlainTextBody = $"Hello {userName}, Welcome to ZoomLoop!"
        };

        await emailService.SendEmailAsync(emailMessage);
    }

    /// <summary>
    /// Example: Send email with embedded QR code
    /// </summary>
    public static async Task SendVerificationEmailWithQrCode(
        IEmailService emailService,
        ITemplateEngine templateEngine,
        IQrCodeGenerator qrCodeGenerator,
        string recipientEmail,
        string verificationToken)
    {
        var verificationUrl = $"https://zoomloop.com/verify?token={verificationToken}";
        var qrCodeBase64 = qrCodeGenerator.GenerateQrCodeBase64(verificationUrl, pixelsPerModule: 10);

        var template = @"
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .qr-container { text-align: center; margin: 30px 0; }
                    .qr-code { border: 2px solid #ddd; padding: 10px; display: inline-block; }
                </style>
            </head>
            <body>
                <h1>Verify Your Email</h1>
                <p>Please verify your email address by scanning the QR code below or clicking the link.</p>
                <div class='qr-container'>
                    <div class='qr-code'>
                        <img src='data:image/png;base64,@Model.QrCode' alt='Verification QR Code' />
                    </div>
                </div>
                <p>Or click here: <a href='@Model.VerificationUrl'>Verify Email</a></p>
                <p><small>This link will expire in 24 hours.</small></p>
            </body>
            </html>
        ";

        var model = new
        {
            QrCode = qrCodeBase64,
            VerificationUrl = verificationUrl
        };

        var htmlBody = await templateEngine.RenderAsync(template, model);

        var emailMessage = new EmailMessage
        {
            To = recipientEmail,
            Subject = "Verify Your Email Address",
            HtmlBody = htmlBody,
            PlainTextBody = $"Please verify your email by visiting: {verificationUrl}"
        };

        await emailService.SendEmailAsync(emailMessage);
    }

    /// <summary>
    /// Example: Send notification with dynamic content
    /// </summary>
    public static async Task SendVehicleListingNotification(
        IEmailService emailService,
        ITemplateEngine templateEngine,
        IQrCodeGenerator qrCodeGenerator,
        string recipientEmail,
        string vehicleMake,
        string vehicleModel,
        int year,
        decimal price,
        string listingUrl)
    {
        var qrCodeBase64 = qrCodeGenerator.GenerateQrCodeBase64(listingUrl);

        var template = @"
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .vehicle-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0; }
                    .vehicle-title { color: #333; font-size: 24px; margin-bottom: 10px; }
                    .price { color: #28a745; font-size: 28px; font-weight: bold; }
                    .qr-section { text-align: center; margin-top: 20px; padding: 20px; background-color: #f8f9fa; }
                </style>
            </head>
            <body>
                <h1>New Vehicle Listing Alert!</h1>
                <div class='vehicle-card'>
                    <div class='vehicle-title'>@Model.Year @Model.Make @Model.Model</div>
                    <div class='price'>$@Model.Price.ToString(""N2"")</div>
                    <p><a href='@Model.ListingUrl'>View Details</a></p>
                </div>
                <div class='qr-section'>
                    <p><strong>Scan to view on mobile:</strong></p>
                    <img src='data:image/png;base64,@Model.QrCode' alt='Listing QR Code' />
                </div>
            </body>
            </html>
        ";

        var model = new
        {
            Year = year,
            Make = vehicleMake,
            Model = vehicleModel,
            Price = price,
            ListingUrl = listingUrl,
            QrCode = qrCodeBase64
        };

        var htmlBody = await templateEngine.RenderAsync(template, model);

        var emailMessage = new EmailMessage
        {
            To = recipientEmail,
            Subject = $"New Listing: {year} {vehicleMake} {vehicleModel}",
            HtmlBody = htmlBody,
            PlainTextBody = $"Check out this {year} {vehicleMake} {vehicleModel} for ${price:N2}. View at: {listingUrl}"
        };

        await emailService.SendEmailAsync(emailMessage);
    }
}
