// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using NUnit.Framework;
using ZoomLoop.Core.Services.Email;

namespace ZoomLoop.UnitTests.Email;

[TestFixture]
public class RazorTemplateEngineTests
{
    private ITemplateEngine _templateEngine = null!;

    [SetUp]
    public void Setup()
    {
        _templateEngine = new RazorTemplateEngine();
    }

    [Test]
    public async Task RenderAsync_WithSimpleModel_ReturnsRenderedTemplate()
    {
        // Arrange
        var template = "Hello @Model.Name!";
        var model = new { Name = "John" };

        // Act
        var result = await _templateEngine.RenderAsync(template, model);

        // Assert
        Assert.That(result, Is.EqualTo("Hello John!"));
    }

    [Test]
    public async Task RenderAsync_WithComplexModel_ReturnsRenderedTemplate()
    {
        // Arrange
        var template = @"
            <h1>Welcome @Model.FirstName @Model.LastName</h1>
            <p>Email: @Model.Email</p>
        ";
        var model = new
        {
            FirstName = "Jane",
            LastName = "Doe",
            Email = "jane.doe@example.com"
        };

        // Act
        var result = await _templateEngine.RenderAsync(template, model);

        // Assert
        Assert.That(result, Does.Contain("Welcome Jane Doe"));
        Assert.That(result, Does.Contain("Email: jane.doe@example.com"));
    }

    [Test]
    public async Task RenderAsync_WithLoopInTemplate_ReturnsRenderedTemplate()
    {
        // Arrange
        var template = @"
            <ul>
            @foreach(var item in Model.Items)
            {
                <li>@item</li>
            }
            </ul>
        ";
        var model = new { Items = new[] { "Apple", "Banana", "Cherry" } };

        // Act
        var result = await _templateEngine.RenderAsync(template, model);

        // Assert
        Assert.That(result, Does.Contain("<li>Apple</li>"));
        Assert.That(result, Does.Contain("<li>Banana</li>"));
        Assert.That(result, Does.Contain("<li>Cherry</li>"));
    }

    [Test]
    public async Task RenderAsync_WithConditionalInTemplate_ReturnsRenderedTemplate()
    {
        // Arrange
        var template = @"
            @if(Model.IsActive)
            {
                <p>User is active</p>
            }
            else
            {
                <p>User is inactive</p>
            }
        ";
        var model = new { IsActive = true };

        // Act
        var result = await _templateEngine.RenderAsync(template, model);

        // Assert
        Assert.That(result, Does.Contain("User is active"));
        Assert.That(result, Does.Not.Contain("User is inactive"));
    }
}
