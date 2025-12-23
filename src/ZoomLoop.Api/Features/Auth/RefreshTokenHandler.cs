// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Security.Claims;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;
using ZoomLoop.Core.Services.Security;

namespace ZoomLoop.Api.Features.Auth;

public class RefreshTokenHandler : IRequestHandler<RefreshTokenRequest, RefreshTokenResponse?>
{
    private const int AccessTokenExpiryMinutes = 15;
    private const int RefreshTokenExpiryDays = 30;

    private readonly IZoomLoopContext _context;
    private readonly ITokenBuilder _tokenBuilder;
    private readonly ITokenProvider _tokenProvider;
    private readonly ILogger<RefreshTokenHandler> _logger;

    public RefreshTokenHandler(
        IZoomLoopContext context,
        ITokenBuilder tokenBuilder,
        ITokenProvider tokenProvider,
        ILogger<RefreshTokenHandler> logger)
    {
        _context = context;
        _tokenBuilder = tokenBuilder;
        _tokenProvider = tokenProvider;
        _logger = logger;
    }

    public async Task<RefreshTokenResponse?> Handle(RefreshTokenRequest request, CancellationToken cancellationToken)
    {
        var session = await _context.Sessions
            .Include(s => s.User)
            .ThenInclude(u => u.Roles)
            .FirstOrDefaultAsync(
                s => s.RefreshToken == request.RefreshToken && !s.IsRevoked && s.ExpiresAt > DateTime.UtcNow,
                cancellationToken);

        if (session == null)
        {
            _logger.LogWarning("Invalid or expired refresh token");
            return null;
        }

        session.RefreshToken = _tokenProvider.GenerateRefreshToken();
        session.ExpiresAt = DateTime.UtcNow.AddDays(RefreshTokenExpiryDays);
        session.LastActiveAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        var user = session.User;

        _tokenBuilder.AddUsername(user.Email);
        _tokenBuilder.AddOrUpdateClaim(new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()));
        _tokenBuilder.AddOrUpdateClaim(new Claim(ClaimTypes.Email, user.Email));
        _tokenBuilder.AddOrUpdateClaim(new Claim("session_id", session.SessionId.ToString()));

        foreach (var role in user.Roles)
        {
            _tokenBuilder.AddClaim(new Claim(ClaimTypes.Role, role.Name));
        }

        var accessToken = _tokenBuilder.Build();

        _logger.LogInformation("Token refreshed for user: {UserId}", user.UserId);

        return new RefreshTokenResponse(accessToken, AccessTokenExpiryMinutes * 60);
    }
}
