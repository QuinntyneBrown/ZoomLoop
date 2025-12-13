// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Services.VehicleIngestion;

public class VehicleIngestionConfiguration
{
    public string AzureComputerVisionEndpoint { get; set; } = string.Empty;
    public string AzureComputerVisionKey { get; set; } = string.Empty;
    public string AzureOpenAIEndpoint { get; set; } = string.Empty;
    public string AzureOpenAIKey { get; set; } = string.Empty;
    public string AzureOpenAIDeploymentName { get; set; } = string.Empty;
}
