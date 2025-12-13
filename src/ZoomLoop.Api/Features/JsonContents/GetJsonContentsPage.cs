// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.JsonContents;

public record GetJsonContentsPageRequest(int PageSize, int Index) : IRequest<GetJsonContentsPageResponse>;

public class GetJsonContentsPageResponse
{
    public int Length { get; set; }
    public List<JsonContentDto> Entities { get; set; } = [];
}
