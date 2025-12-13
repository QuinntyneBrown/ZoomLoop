// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using QRCoder;

namespace ZoomLoop.Core.Email;

public class QrCodeGenerator : IQrCodeGenerator
{
    public byte[] GenerateQrCode(string content, int pixelsPerModule = 20)
    {
        using var qrGenerator = new QRCodeGenerator();
        using var qrCodeData = qrGenerator.CreateQrCode(content, QRCodeGenerator.ECCLevel.Q);
        using var qrCode = new PngByteQRCode(qrCodeData);
        return qrCode.GetGraphic(pixelsPerModule);
    }

    public string GenerateQrCodeBase64(string content, int pixelsPerModule = 20)
    {
        var qrCodeBytes = GenerateQrCode(content, pixelsPerModule);
        return Convert.ToBase64String(qrCodeBytes);
    }
}
