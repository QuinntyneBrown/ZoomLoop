// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using OpenAI.Chat;
using ZoomLoop.Core.Services.VehicleIngestion;

namespace ZoomLoop.Testing.Services.VehicleIngestion;

public class FakeAzureOpenAIService : IAzureOpenAIService
{
    private readonly Func<IEnumerable<ChatMessage>, string>? _completeChatFunc;

    public FakeAzureOpenAIService(Func<IEnumerable<ChatMessage>, string>? completeChatFunc = null)
    {
        _completeChatFunc = completeChatFunc;
    }

    public Task<string> CompleteChatAsync(
        IEnumerable<ChatMessage> messages,
        CancellationToken cancellationToken = default)
    {
        if (_completeChatFunc != null)
        {
            return Task.FromResult(_completeChatFunc(messages));
        }

        // Default fake implementation
        var systemMessage = messages.FirstOrDefault(m => m is SystemChatMessage);
        if (systemMessage != null)
        {
            var content = systemMessage.ToString();
            
            // Detect what kind of response is expected based on the system message
            if (content.Contains("VIN"))
            {
                return Task.FromResult("{\"year\": 2023, \"make\": \"Toyota\", \"model\": \"Camry\"}");
            }
            else if (content.Contains("condition"))
            {
                return Task.FromResult("{\"interiorCondition\": \"Good\", \"exteriorCondition\": \"Excellent\", \"numberOfDoors\": 4}");
            }
            else if (content.Contains("description"))
            {
                return Task.FromResult("This is a beautiful vehicle in excellent condition with premium features and modern design. Perfect for daily driving and long trips.");
            }
        }

        return Task.FromResult("Default response");
    }
}
