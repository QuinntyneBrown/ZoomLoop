// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using OpenAI.Chat;
using ZoomLoop.Core.Services.VehicleIngestion;

namespace ZoomLoop.Core.Services.VehicleValuation;

public class VehicleValuationService : IVehicleValuationService
{
    private readonly IAzureOpenAIService _openAIService;

    public VehicleValuationService(IAzureOpenAIService openAIService)
    {
        _openAIService = openAIService;
    }

    public async Task<VehicleInfoByVinResult> GetVehicleInfoByVinAsync(
        string vin,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(vin))
        {
            throw new ArgumentException("VIN cannot be null or empty", nameof(vin));
        }

        var messages = new List<ChatMessage>
        {
            new SystemChatMessage(@"You are a vehicle identification expert. Given a VIN number, provide the year, make, and model of the vehicle. Respond only with a JSON object in this exact format: {""year"": 2020, ""make"": ""Toyota"", ""model"": ""Camry""}"),
            new UserChatMessage($"VIN: {vin}")
        };

        var content = await _openAIService.CompleteChatAsync(messages, cancellationToken);

        return ParseJson<VehicleInfoByVinResult>(content, root => new VehicleInfoByVinResult
        {
            Year = root.GetProperty("year").GetInt32(),
            Make = root.GetProperty("make").GetString() ?? string.Empty,
            Model = root.GetProperty("model").GetString() ?? string.Empty
        }, "Failed to parse vehicle information from VIN");
    }

    public async Task<VehicleValuationResult> GetVehicleValuationAsync(
        VehicleValuationRequest request,
        CancellationToken cancellationToken = default)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        var messages = new List<ChatMessage>
        {
            new SystemChatMessage(@"You are a professional vehicle appraisal expert. Based on the vehicle details provided, calculate the fair market value in CAD and provide a detailed explanation of the valuation. 
Consider the year, make, model, mileage, accident history, condition, and location. 
Respond only with a JSON object in this exact format: 
{""fairValue"": 25000.00, ""explanation"": ""Detailed explanation of the valuation considering all factors...""}"),
            new UserChatMessage($@"Please provide a fair market value for this vehicle:
VIN: {request.Vin}
Year: {request.Year}
Make: {request.Make}
Model: {request.Model}
Postal Code: {request.PostalCode}
Kilometers: {request.Kilometers}
Number of Accidents: {request.Accidents}
Interior Condition: {request.InteriorCondition}
Exterior Condition: {request.ExteriorCondition}")
        };

        var content = await _openAIService.CompleteChatAsync(messages, cancellationToken);

        return ParseJson<VehicleValuationResult>(content, root => new VehicleValuationResult
        {
            FairValue = root.GetProperty("fairValue").GetDecimal(),
            Explanation = root.GetProperty("explanation").GetString() ?? string.Empty
        }, "Failed to parse vehicle valuation from AI response");
    }

    private static T ParseJson<T>(string content, Func<System.Text.Json.JsonElement, T> parser, string errorMessage)
    {
        var jsonStart = content.IndexOf('{');
        var jsonEnd = content.LastIndexOf('}');
        if (jsonStart >= 0 && jsonEnd > jsonStart)
        {
            var json = content.Substring(jsonStart, jsonEnd - jsonStart + 1);
            using var parsed = System.Text.Json.JsonDocument.Parse(json);
            var root = parsed.RootElement;
            return parser(root);
        }

        throw new InvalidOperationException(errorMessage);
    }
}
