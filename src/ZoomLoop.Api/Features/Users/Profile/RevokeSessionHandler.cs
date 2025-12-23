// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Security.Claims;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.Users.Profile;

public class RevokeSessionHandler : IRequestHandler<RevokeSessionRequest, bool>
{
    private readonly IZoomLoopContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<RevokeSessionHandler> _logger;

    public RevokeSessionHandler(
        IZoomLoopContext context,
        IHttpContextAccessor httpContextAccessor,
        ILogger<RevokeSessionHandler> logger)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    public async Task<bool> Handle(RevokeSessionRequest request, CancellationToken cancellationToken)
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return false;
        }

        var session = await _context.Sessions
            .FirstOrDefaultAsync(s => s.SessionId == request.SessionId && s.UserId == userId, cancellationToken);

        if (session == null)
        {
            return false;
        }

        session.IsRevoked = true;

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Session {SessionId} revoked by user: {UserId}", request.SessionId, userId);

        return true;
    }
}
