// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using NUnit.Framework;
using ZoomLoop.Core.Services.Email;

namespace ZoomLoop.UnitTests.Email;

[TestFixture]
public class QrCodeGeneratorTests
{
    private IQrCodeGenerator _qrCodeGenerator = null!;

    [SetUp]
    public void Setup()
    {
        _qrCodeGenerator = new QrCodeGenerator();
    }

    [Test]
    public void GenerateQrCode_WithValidContent_ReturnsByteArray()
    {
        // Arrange
        var content = "https://example.com";

        // Act
        var result = _qrCodeGenerator.GenerateQrCode(content);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Length, Is.GreaterThan(0));
        
        // PNG files start with specific bytes
        Assert.That(result[0], Is.EqualTo(0x89));
        Assert.That(result[1], Is.EqualTo(0x50)); // 'P'
        Assert.That(result[2], Is.EqualTo(0x4E)); // 'N'
        Assert.That(result[3], Is.EqualTo(0x47)); // 'G'
    }

    [Test]
    public void GenerateQrCode_WithDifferentContent_GeneratesDifferentQrCodes()
    {
        // Arrange
        var content1 = "https://example1.com";
        var content2 = "https://example2.com";

        // Act
        var result1 = _qrCodeGenerator.GenerateQrCode(content1);
        var result2 = _qrCodeGenerator.GenerateQrCode(content2);

        // Assert
        Assert.That(result1, Is.Not.EqualTo(result2));
    }

    [Test]
    public void GenerateQrCode_WithCustomPixelsPerModule_GeneratesDifferentSizes()
    {
        // Arrange
        var content = "https://example.com";

        // Act
        var result1 = _qrCodeGenerator.GenerateQrCode(content, pixelsPerModule: 10);
        var result2 = _qrCodeGenerator.GenerateQrCode(content, pixelsPerModule: 20);

        // Assert
        Assert.That(result1.Length, Is.Not.EqualTo(result2.Length));
        Assert.That(result2.Length, Is.GreaterThan(result1.Length));
    }

    [Test]
    public void GenerateQrCodeBase64_WithValidContent_ReturnsBase64String()
    {
        // Arrange
        var content = "https://example.com";

        // Act
        var result = _qrCodeGenerator.GenerateQrCodeBase64(content);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Length, Is.GreaterThan(0));
        
        // Verify it's valid base64 by attempting to decode
        Assert.DoesNotThrow(() => Convert.FromBase64String(result));
    }

    [Test]
    public void GenerateQrCodeBase64_WithValidContent_CanBeDecodedToOriginalBytes()
    {
        // Arrange
        var content = "https://example.com";

        // Act
        var base64Result = _qrCodeGenerator.GenerateQrCodeBase64(content);
        var bytesFromBase64 = Convert.FromBase64String(base64Result);
        var directBytes = _qrCodeGenerator.GenerateQrCode(content);

        // Assert
        Assert.That(bytesFromBase64, Is.EqualTo(directBytes));
    }

    [Test]
    public void GenerateQrCode_WithEmptyString_GeneratesQrCode()
    {
        // Arrange
        var content = string.Empty;

        // Act & Assert
        Assert.DoesNotThrow(() => _qrCodeGenerator.GenerateQrCode(content));
    }

    [Test]
    public void GenerateQrCode_WithLongContent_GeneratesQrCode()
    {
        // Arrange
        var content = new string('A', 1000);

        // Act
        var result = _qrCodeGenerator.GenerateQrCode(content);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Length, Is.GreaterThan(0));
    }
}
