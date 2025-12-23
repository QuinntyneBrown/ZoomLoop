// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.Users.Profile;

public record GetSessionsRequest : IRequest<GetSessionsResponse>;

public record GetSessionsResponse(List<SessionDto> Sessions);

public record SessionDto(
    Guid SessionId,
    string Device,
    string? Location,
    DateTime LastActive,
    bool Current);
