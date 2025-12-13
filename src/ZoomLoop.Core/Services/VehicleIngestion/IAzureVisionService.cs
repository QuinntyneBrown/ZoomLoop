// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Azure.AI.Vision.ImageAnalysis;

namespace ZoomLoop.Core.Services.VehicleIngestion;

public interface IAzureVisionService
{
    Task<ImageAnalysisResult> AnalyzeImageAsync(
        BinaryData imageData,
        VisualFeatures visualFeatures,
        CancellationToken cancellationToken = default);
}
