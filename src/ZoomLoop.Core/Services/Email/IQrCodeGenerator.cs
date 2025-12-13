// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Services.Email;

public interface IQrCodeGenerator
{
    byte[] GenerateQrCode(string content, int pixelsPerModule = 20);
    string GenerateQrCodeBase64(string content, int pixelsPerModule = 20);
}
