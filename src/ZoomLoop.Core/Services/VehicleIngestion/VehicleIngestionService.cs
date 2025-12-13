// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Azure;
using Azure.AI.OpenAI;
using Azure.AI.Vision.ImageAnalysis;
using OpenAI.Chat;
using System.ClientModel;

namespace ZoomLoop.Core.Services.VehicleIngestion;

public class VehicleIngestionService : IVehicleIngestionService
{
    private readonly ImageAnalysisClient _visionClient;
    private readonly AzureOpenAIClient _openAIClient;
    private readonly string _deploymentName;

    public VehicleIngestionService(
        string visionEndpoint,
        string visionKey,
        string openAIEndpoint,
        string openAIKey,
        string deploymentName)
    {
        _visionClient = new ImageAnalysisClient(
            new Uri(visionEndpoint),
            new AzureKeyCredential(visionKey));

        _openAIClient = new AzureOpenAIClient(
            new Uri(openAIEndpoint),
            new ApiKeyCredential(openAIKey));

        _deploymentName = deploymentName;
    }

    public async Task<VehicleIngestionResult> IngestVehicleAsync(
        VehicleIngestionRequest request,
        CancellationToken cancellationToken = default)
    {
        if (request.Images == null || request.Images.Length == 0)
        {
            throw new ArgumentException("At least one image is required", nameof(request));
        }

        // Step 1: Extract VIN from images
        var vin = await ExtractVINFromImagesAsync(request.Images, cancellationToken);

        // Step 2: Process concurrently
        var vinTask = GetVehicleInfoFromVINAsync(vin, cancellationToken);
        var detailsTask = GetVehicleDetailsFromImagesAsync(request.Images, cancellationToken);
        var descriptionTask = GenerateVehicleDescriptionAsync(request.Images, cancellationToken);

        await Task.WhenAll(vinTask, detailsTask, descriptionTask);

        var vinInfo = await vinTask;
        var details = await detailsTask;
        var description = await descriptionTask;

        return new VehicleIngestionResult
        {
            VIN = vin,
            Year = vinInfo.Year,
            Make = vinInfo.Make,
            Model = vinInfo.Model,
            InteriorCondition = details.InteriorCondition,
            ExteriorCondition = details.ExteriorCondition,
            NumberOfDoors = details.NumberOfDoors,
            Description = description
        };
    }

    private async Task<string> ExtractVINFromImagesAsync(byte[][] images, CancellationToken cancellationToken)
    {
        foreach (var imageBytes in images)
        {
            try
            {
                var imageData = new BinaryData(imageBytes);
                var result = await _visionClient.AnalyzeAsync(
                    imageData,
                    VisualFeatures.Read,
                    cancellationToken: cancellationToken);

                if (result.Value.Read?.Blocks != null)
                {
                    foreach (var block in result.Value.Read.Blocks)
                    {
                        foreach (var line in block.Lines)
                        {
                            var text = line.Text;
                            // VIN is 17 alphanumeric characters
                            var cleanedText = new string(text.Where(c => char.IsLetterOrDigit(c)).ToArray());
                            if (cleanedText.Length == 17)
                            {
                                return cleanedText.ToUpperInvariant();
                            }
                        }
                    }
                }
            }
            catch
            {
                // Continue to next image if this one fails
                continue;
            }
        }

        throw new InvalidOperationException("Could not extract VIN from any of the provided images");
    }

    private async Task<(int Year, string Make, string Model)> GetVehicleInfoFromVINAsync(
        string vin,
        CancellationToken cancellationToken)
    {
        var chatClient = _openAIClient.GetChatClient(_deploymentName);

        var messages = new List<ChatMessage>
        {
            new SystemChatMessage("You are a vehicle identification expert. Given a VIN number, provide the year, make, and model of the vehicle. Respond only with a JSON object in this exact format: {\"year\": 2020, \"make\": \"Toyota\", \"model\": \"Camry\"}"),
            new UserChatMessage($"VIN: {vin}")
        };

        var response = await chatClient.CompleteChatAsync(messages, cancellationToken: cancellationToken);
        var content = response.Value.Content[0].Text;

        // Parse JSON response
        var jsonStart = content.IndexOf('{');
        var jsonEnd = content.LastIndexOf('}');
        if (jsonStart >= 0 && jsonEnd > jsonStart)
        {
            var json = content.Substring(jsonStart, jsonEnd - jsonStart + 1);
            using var parsed = System.Text.Json.JsonDocument.Parse(json);
            var root = parsed.RootElement;

            return (
                Year: root.GetProperty("year").GetInt32(),
                Make: root.GetProperty("make").GetString() ?? string.Empty,
                Model: root.GetProperty("model").GetString() ?? string.Empty
            );
        }

        throw new InvalidOperationException("Failed to parse vehicle information from VIN");
    }

    private async Task<(string InteriorCondition, string ExteriorCondition, int NumberOfDoors)> GetVehicleDetailsFromImagesAsync(
        byte[][] images,
        CancellationToken cancellationToken)
    {
        var chatClient = _openAIClient.GetChatClient(_deploymentName);

        // Note: For image analysis with GPT-4o, we would use the vision capabilities.
        // In this implementation, we use a text-based approach by first analyzing images
        // with Computer Vision, then using GPT-4o to interpret the results.
        // For production, consider using GPT-4 Vision API directly.
        
        var imageAnalysisResults = new List<string>();
        
        // Analyze each image with Computer Vision
        foreach (var imageBytes in images.Take(3)) // Analyze up to 3 images
        {
            try
            {
                var imageData = new BinaryData(imageBytes);
                var result = await _visionClient.AnalyzeAsync(
                    imageData,
                    VisualFeatures.Caption | VisualFeatures.Tags | VisualFeatures.Objects,
                    cancellationToken: cancellationToken);

                var description = result.Value.Caption?.Text ?? "No description available";
                
                var tagsList = new List<string>();
                if (result.Value.Tags != null && result.Value.Tags.Values != null)
                {
                    foreach (var tag in result.Value.Tags.Values)
                    {
                        tagsList.Add(tag.Name);
                    }
                }
                
                imageAnalysisResults.Add($"Image: {description}. Tags: {string.Join(", ", tagsList)}");
            }
            catch
            {
                // Continue with other images if one fails
                continue;
            }
        }

        var imageDescriptions = string.Join(" | ", imageAnalysisResults);
        
        var messages = new List<ChatMessage>
        {
            new SystemChatMessage("You are a vehicle inspection expert. Based on the image analysis results, provide: interior condition (Excellent/Good/Fair/Poor), exterior condition (Excellent/Good/Fair/Poor), and number of doors. Respond only with a JSON object in this exact format: {\"interiorCondition\": \"Good\", \"exteriorCondition\": \"Excellent\", \"numberOfDoors\": 4}"),
            new UserChatMessage($"Analyze these vehicle images and provide the assessment. Image analysis results: {imageDescriptions}")
        };

        var response = await chatClient.CompleteChatAsync(messages, cancellationToken: cancellationToken);
        var content = response.Value.Content[0].Text;

        // Parse JSON response
        var jsonStart = content.IndexOf('{');
        var jsonEnd = content.LastIndexOf('}');
        if (jsonStart >= 0 && jsonEnd > jsonStart)
        {
            var json = content.Substring(jsonStart, jsonEnd - jsonStart + 1);
            using var parsed = System.Text.Json.JsonDocument.Parse(json);
            var root = parsed.RootElement;

            return (
                InteriorCondition: root.GetProperty("interiorCondition").GetString() ?? "Unknown",
                ExteriorCondition: root.GetProperty("exteriorCondition").GetString() ?? "Unknown",
                NumberOfDoors: root.GetProperty("numberOfDoors").GetInt32()
            );
        }

        throw new InvalidOperationException("Failed to parse vehicle details from images");
    }

    private async Task<string> GenerateVehicleDescriptionAsync(
        byte[][] images,
        CancellationToken cancellationToken)
    {
        var chatClient = _openAIClient.GetChatClient(_deploymentName);

        // Analyze images with Computer Vision first
        var imageAnalysisResults = new List<string>();
        
        foreach (var imageBytes in images.Take(5)) // Analyze up to 5 images for description
        {
            try
            {
                var imageData = new BinaryData(imageBytes);
                var result = await _visionClient.AnalyzeAsync(
                    imageData,
                    VisualFeatures.Caption | VisualFeatures.Tags | VisualFeatures.DenseCaptions,
                    cancellationToken: cancellationToken);

                var description = result.Value.Caption?.Text ?? "No description available";
                
                var tagsList = new List<string>();
                if (result.Value.Tags != null && result.Value.Tags.Values != null)
                {
                    foreach (var tag in result.Value.Tags.Values.Take(10))
                    {
                        tagsList.Add(tag.Name);
                    }
                }
                
                imageAnalysisResults.Add($"{description}. Features: {string.Join(", ", tagsList)}");
            }
            catch
            {
                // Continue with other images if one fails
                continue;
            }
        }

        var imageDescriptions = string.Join(" | ", imageAnalysisResults);

        var messages = new List<ChatMessage>
        {
            new SystemChatMessage("You are a professional automotive writer. Create a compelling 200-word description of the vehicle based on the image analysis provided. Focus on key features, condition, and appeal. Make it engaging for potential buyers."),
            new UserChatMessage($"Generate a 200-word description for this vehicle. Image analysis: {imageDescriptions}")
        };

        var response = await chatClient.CompleteChatAsync(messages, cancellationToken: cancellationToken);
        return response.Value.Content[0].Text;
    }
}
