// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.JsonContents;

public record RemoveJsonContentRequest(Guid JsonContentId) : IRequest<RemoveJsonContentResponse>;

public class RemoveJsonContentResponse
{
    public JsonContentDto JsonContent { get; set; } = default!;
}
