// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Azure;
using Azure.AI.Vision.ImageAnalysis;

namespace ZoomLoop.Core.Services.VehicleIngestion;

public class AzureVisionService : IAzureVisionService
{
    private readonly ImageAnalysisClient _client;

    public AzureVisionService(string endpoint, string key)
    {
        _client = new ImageAnalysisClient(
            new Uri(endpoint),
            new AzureKeyCredential(key));
    }

    public async Task<ImageAnalysisResult> AnalyzeImageAsync(
        BinaryData imageData,
        VisualFeatures visualFeatures,
        CancellationToken cancellationToken = default)
    {
        var result = await _client.AnalyzeAsync(
            imageData,
            visualFeatures,
            cancellationToken: cancellationToken);

        return result.Value;
    }
}
