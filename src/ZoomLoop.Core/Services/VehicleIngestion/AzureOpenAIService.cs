// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Azure.AI.OpenAI;
using OpenAI.Chat;
using System.ClientModel;

namespace ZoomLoop.Core.Services.VehicleIngestion;

public class AzureOpenAIService : IAzureOpenAIService
{
    private readonly AzureOpenAIClient _client;
    private readonly string _deploymentName;

    public AzureOpenAIService(string endpoint, string key, string deploymentName)
    {
        _client = new AzureOpenAIClient(
            new Uri(endpoint),
            new ApiKeyCredential(key));
        _deploymentName = deploymentName;
    }

    public async Task<string> CompleteChatAsync(
        IEnumerable<ChatMessage> messages,
        CancellationToken cancellationToken = default)
    {
        var chatClient = _client.GetChatClient(_deploymentName);
        var response = await chatClient.CompleteChatAsync(messages, cancellationToken: cancellationToken);
        return response.Value.Content[0].Text;
    }
}
