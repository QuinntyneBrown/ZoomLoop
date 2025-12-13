// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Azure.AI.Vision.ImageAnalysis;
using System.Reflection;

namespace ZoomLoop.Core.Services.VehicleIngestion;

public class FakeAzureVisionService : IAzureVisionService
{
    private readonly Func<BinaryData, VisualFeatures, ImageAnalysisResult>? _analyzeFunc;

    public FakeAzureVisionService(Func<BinaryData, VisualFeatures, ImageAnalysisResult>? analyzeFunc = null)
    {
        _analyzeFunc = analyzeFunc ?? DefaultAnalyzeFunc;
    }

    public Task<ImageAnalysisResult> AnalyzeImageAsync(
        BinaryData imageData,
        VisualFeatures visualFeatures,
        CancellationToken cancellationToken = default)
    {
        return Task.FromResult(_analyzeFunc(imageData, visualFeatures));
    }

    private static ImageAnalysisResult DefaultAnalyzeFunc(BinaryData imageData, VisualFeatures features)
    {
        // Provide a minimal working default that returns empty results
        // Create instance using non-public constructor via reflection
        var instance = (ImageAnalysisResult)Activator.CreateInstance(
            typeof(ImageAnalysisResult),
            nonPublic: true)!;
        
        return instance;
    }
}
