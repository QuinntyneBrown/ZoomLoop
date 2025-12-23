// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Security.Claims;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.Auth;

public class LogoutHandler : IRequestHandler<LogoutRequest, Unit>
{
    private readonly IZoomLoopContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<LogoutHandler> _logger;

    public LogoutHandler(
        IZoomLoopContext context,
        IHttpContextAccessor httpContextAccessor,
        ILogger<LogoutHandler> logger)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    public async Task<Unit> Handle(LogoutRequest request, CancellationToken cancellationToken)
    {
        var sessionIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst("session_id")?.Value;

        if (!string.IsNullOrEmpty(sessionIdClaim) && Guid.TryParse(sessionIdClaim, out var sessionId))
        {
            var session = await _context.Sessions
                .FirstOrDefaultAsync(s => s.SessionId == sessionId, cancellationToken);

            if (session != null)
            {
                session.IsRevoked = true;
                await _context.SaveChangesAsync(cancellationToken);
                _logger.LogInformation("Session {SessionId} logged out successfully", sessionId);
            }
        }

        return Unit.Value;
    }
}
