// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using DomainJsonContent = ZoomLoop.Core.Models.JsonContent;

namespace ZoomLoop.Api.Features.JsonContents;

public static class JsonContentExtensions
{
    public static JsonContentDto ToDto(this DomainJsonContent jsonContent)
    {
        return new JsonContentDto
        {
            JsonContentId = jsonContent.JsonContentId,
            Name = jsonContent.Name,
            Json = jsonContent.Json
        };
    }
}
