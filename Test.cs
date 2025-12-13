using NUnit.Framework;
using ZoomLoop.Core.Services.VehicleIngestion;

[TestFixture]
public class TestFakes
{
    [Test]
    public async Task FakeServices_ShouldWork()
    {
        var fakeVision = new FakeAzureVisionService();
        var fakeOpenAI = new FakeAzureOpenAIService();
        var service = new VehicleIngestionService(fakeVision, fakeOpenAI);
        
        Assert.That(service, Is.Not.Null);
        
        // Test that it validates input
        var request = new VehicleIngestionRequest { Images = Array.Empty<byte[]>() };
        Assert.ThrowsAsync<ArgumentException>(async () => await service.IngestVehicleAsync(request));
    }
}
