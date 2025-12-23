// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Security.Claims;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.Users.Profile;

public class GetSessionsHandler : IRequestHandler<GetSessionsRequest, GetSessionsResponse>
{
    private readonly IZoomLoopContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetSessionsHandler(IZoomLoopContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<GetSessionsResponse> Handle(GetSessionsRequest request, CancellationToken cancellationToken)
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var currentSessionIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst("session_id")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return new GetSessionsResponse([]);
        }

        Guid.TryParse(currentSessionIdClaim, out var currentSessionId);

        var sessions = await _context.Sessions
            .Where(s => s.UserId == userId && !s.IsRevoked && s.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(s => s.LastActiveAt)
            .Select(s => new SessionDto(
                s.SessionId,
                s.Device,
                s.Location,
                s.LastActiveAt,
                s.SessionId == currentSessionId))
            .ToListAsync(cancellationToken);

        return new GetSessionsResponse(sessions);
    }
}
