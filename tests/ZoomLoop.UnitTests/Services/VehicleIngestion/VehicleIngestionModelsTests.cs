// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using NUnit.Framework;
using ZoomLoop.Core.Services.VehicleIngestion;

namespace ZoomLoop.UnitTests.Services.VehicleIngestion;

[TestFixture]
public class VehicleIngestionModelsTests
{
    [Test]
    public void VehicleIngestionRequest_ShouldInitializeWithEmptyArray()
    {
        // Arrange & Act
        var request = new VehicleIngestionRequest();

        // Assert
        Assert.That(request.Images, Is.Not.Null);
        Assert.That(request.Images, Is.Empty);
    }

    [Test]
    public void VehicleIngestionResult_ShouldInitializeWithDefaults()
    {
        // Arrange & Act
        var result = new VehicleIngestionResult();

        // Assert
        Assert.That(result.VIN, Is.EqualTo(string.Empty));
        Assert.That(result.Year, Is.EqualTo(0));
        Assert.That(result.Make, Is.EqualTo(string.Empty));
        Assert.That(result.Model, Is.EqualTo(string.Empty));
        Assert.That(result.InteriorCondition, Is.EqualTo(string.Empty));
        Assert.That(result.ExteriorCondition, Is.EqualTo(string.Empty));
        Assert.That(result.NumberOfDoors, Is.EqualTo(0));
        Assert.That(result.Description, Is.EqualTo(string.Empty));
    }

    [Test]
    public void VehicleIngestionConfiguration_ShouldInitializeWithDefaults()
    {
        // Arrange & Act
        var config = new VehicleIngestionConfiguration();

        // Assert
        Assert.That(config.AzureComputerVisionEndpoint, Is.EqualTo(string.Empty));
        Assert.That(config.AzureComputerVisionKey, Is.EqualTo(string.Empty));
        Assert.That(config.AzureOpenAIEndpoint, Is.EqualTo(string.Empty));
        Assert.That(config.AzureOpenAIKey, Is.EqualTo(string.Empty));
        Assert.That(config.AzureOpenAIDeploymentName, Is.EqualTo(string.Empty));
    }
}
