// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using NUnit.Framework;
using ZoomLoop.Core.Services.VehicleIngestion;

namespace ZoomLoop.UnitTests.Services.VehicleIngestion;

[TestFixture]
public class VehicleIngestionIntegrationTests
{
    [Test]
    public async Task IngestVehicleAsync_WithFakeServices_ShouldReturnResult()
    {
        // Arrange
        var vinText = "1HGBH41JXMN109186";
        
        var fakeVisionService = new TestVisionService(vinText);
        var fakeOpenAIService = new TestOpenAIService();

        var service = new VehicleIngestionService(fakeVisionService, fakeOpenAIService);
        
        var testImage = CreateTestImage();
        var request = new VehicleIngestionRequest
        {
            Images = new[] { testImage }
        };

        // Act
        var result = await service.IngestVehicleAsync(request);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.VIN, Is.EqualTo(vinText));
        Assert.That(result.Year, Is.EqualTo(2023));
        Assert.That(result.Make, Is.EqualTo("Toyota"));
        Assert.That(result.Model, Is.EqualTo("Camry"));
        Assert.That(result.InteriorCondition, Is.EqualTo("Good"));
        Assert.That(result.ExteriorCondition, Is.EqualTo("Excellent"));
        Assert.That(result.NumberOfDoors, Is.EqualTo(4));
        Assert.That(result.Description, Is.Not.Empty);
    }

    [Test]
    public async Task IngestVehicleAsync_ConcurrentProcessing_ShouldComplete()
    {
        // Arrange
        var fakeVisionService = new TestVisionService("1HGBH41JXMN109186");
        var fakeOpenAIService = new TestOpenAIService();

        var service = new VehicleIngestionService(fakeVisionService, fakeOpenAIService);
        
        var testImage = CreateTestImage();
        var request = new VehicleIngestionRequest
        {
            Images = new[] { testImage }
        };

        // Act
        var startTime = DateTime.UtcNow;
        var result = await service.IngestVehicleAsync(request);
        var duration = DateTime.UtcNow - startTime;

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(duration.TotalSeconds, Is.LessThan(5), 
            "Service should complete quickly with fake services");
    }

    [Test]
    public void IngestVehicleAsync_WhenNoVINFound_ShouldThrowException()
    {
        // Arrange
        var fakeVisionService = new TestVisionService("No VIN here");
        var fakeOpenAIService = new TestOpenAIService();

        var service = new VehicleIngestionService(fakeVisionService, fakeOpenAIService);
        
        var testImage = CreateTestImage();
        var request = new VehicleIngestionRequest
        {
            Images = new[] { testImage }
        };

        // Act & Assert
        Assert.ThrowsAsync<InvalidOperationException>(async () =>
            await service.IngestVehicleAsync(request));
    }

    private byte[] CreateTestImage()
    {
        // Simple 1x1 white PNG image
        return new byte[]
        {
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
            0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
            0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
            0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
            0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
            0x42, 0x60, 0x82
        };
    }

    // Test helper classes
    private class TestVisionService : IAzureVisionService
    {
        private readonly string _textToReturn;

        public TestVisionService(string textToReturn)
        {
            _textToReturn = textToReturn;
        }

        public Task<ImageAnalysisResult> AnalyzeImageAsync(
            BinaryData imageData,
            VisualFeatures visualFeatures,
            CancellationToken cancellationToken = default)
        {
            // Return a mock result that contains the specified text
            var result = new TestImageAnalysisResult(_textToReturn, visualFeatures);
            return Task.FromResult<ImageAnalysisResult>(result);
        }
    }

    private class TestOpenAIService : IAzureOpenAIService
    {
        public Task<string> CompleteChatAsync(
            IEnumerable<ChatMessage> messages,
            CancellationToken cancellationToken = default)
        {
            var messageText = string.Join(" ", messages.Select(m => m.ToString()));
            
            if (messageText.Contains("VIN"))
            {
                return Task.FromResult("{\"year\": 2023, \"make\": \"Toyota\", \"model\": \"Camry\"}");
            }
            else if (messageText.Contains("condition"))
            {
                return Task.FromResult("{\"interiorCondition\": \"Good\", \"exteriorCondition\": \"Excellent\", \"numberOfDoors\": 4}");
            }
            else
            {
                return Task.FromResult("This is a beautiful vehicle in excellent condition.");
            }
        }
    }

    // Minimal test implementation of ImageAnalysisResult
    private class TestImageAnalysisResult : ImageAnalysisResult
    {
        private readonly string _text;
        private readonly VisualFeatures _features;

        public TestImageAnalysisResult(string text, VisualFeatures features)
        {
            _text = text;
            _features = features;
        }

        public new ReadResult? Read
        {
            get
            {
                if (_features.HasFlag(VisualFeatures.Read))
                {
                    return new TestReadResult(_text);
                }
                return null;
            }
        }

        public new CaptionResult? Caption
        {
            get
            {
                if (_features.HasFlag(VisualFeatures.Caption))
                {
                    return new TestCaptionResult("A vehicle photo");
                }
                return null;
            }
        }

        public new TagsResult? Tags
        {
            get
            {
                if (_features.HasFlag(VisualFeatures.Tags))
                {
                    return new TestTagsResult();
                }
                return null;
            }
        }
    }

    private class TestReadResult : ReadResult
    {
        private readonly string _text;

        public TestReadResult(string text)
        {
            _text = text;
        }

        public new IReadOnlyList<DetectedTextBlock> Blocks => new List<DetectedTextBlock>
        {
            new TestTextBlock(_text)
        };
    }

    private class TestTextBlock : DetectedTextBlock
    {
        private readonly string _text;

        public TestTextBlock(string text)
        {
            _text = text;
        }

        public new IReadOnlyList<DetectedTextLine> Lines => new List<DetectedTextLine>
        {
            new TestTextLine(_text)
        };
    }

    private class TestTextLine : DetectedTextLine
    {
        private readonly string _text;

        public TestTextLine(string text)
        {
            _text = text;
        }

        public new string Text => _text;
    }

    private class TestCaptionResult : CaptionResult
    {
        private readonly string _text;

        public TestCaptionResult(string text)
        {
            _text = text;
        }

        public new string Text => _text;
    }

    private class TestTagsResult : TagsResult
    {
        public new IReadOnlyList<DetectedTag> Values => new List<DetectedTag>
        {
            new TestDetectedTag("car"),
            new TestDetectedTag("vehicle")
        };
    }

    private class TestDetectedTag : DetectedTag
    {
        private readonly string _name;

        public TestDetectedTag(string name)
        {
            _name = name;
        }

        public new string Name => _name;
    }
}
