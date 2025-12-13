// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Azure.AI.Vision.ImageAnalysis;

namespace ZoomLoop.Core.Services.VehicleIngestion;

public class FakeAzureVisionService : IAzureVisionService
{
    private readonly Func<BinaryData, VisualFeatures, ImageAnalysisResult>? _analyzeFunc;

    public FakeAzureVisionService(Func<BinaryData, VisualFeatures, ImageAnalysisResult>? analyzeFunc = null)
    {
        _analyzeFunc = analyzeFunc;
    }

    public Task<ImageAnalysisResult> AnalyzeImageAsync(
        BinaryData imageData,
        VisualFeatures visualFeatures,
        CancellationToken cancellationToken = default)
    {
        if (_analyzeFunc != null)
        {
            return Task.FromResult(_analyzeFunc(imageData, visualFeatures));
        }

        // Default fake implementation
        return Task.FromResult(CreateDefaultResult(visualFeatures));
    }

    private ImageAnalysisResult CreateDefaultResult(VisualFeatures features)
    {
        // Create a minimal fake result based on the features requested
        // This is a simplified implementation for testing
        throw new NotImplementedException("Use the constructor with a custom function to provide fake results");
    }
}
