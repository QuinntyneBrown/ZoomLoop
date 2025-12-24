// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;
using ZoomLoop.Core.Models;
using ZoomLoop.Core.Services.Security;

namespace ZoomLoop.Api.Features.Auth;

public class LoginHandler : IRequestHandler<LoginRequest, LoginResponse?>
{
    private const int MaxConcurrentSessions = 5;
    private const int AccessTokenExpiryMinutes = 15;
    private const int RefreshTokenExpiryDays = 30;

    private readonly IZoomLoopContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenBuilder _tokenBuilder;
    private readonly ITokenProvider _tokenProvider;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<LoginHandler> _logger;

    public LoginHandler(
        IZoomLoopContext context,
        IPasswordHasher passwordHasher,
        ITokenBuilder tokenBuilder,
        ITokenProvider tokenProvider,
        IHttpContextAccessor httpContextAccessor,
        ILogger<LoginHandler> logger)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenBuilder = tokenBuilder;
        _tokenProvider = tokenProvider;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    public async Task<LoginResponse?> Handle(LoginRequest request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Login attempt for email: {Email}", request.Email);

        var user = await _context.Users
            .Include(u => u.Roles)
            .ThenInclude(r => r.Privileges)
            .Include(u => u.Sessions)
            .FirstOrDefaultAsync(u => u.Email == request.Email && u.Status == UserStatus.Active, cancellationToken);

        if (user == null)
        {
            _logger.LogWarning("Login failed - user not found: {Email}", request.Email);
            return null;
        }

        if (!_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            _logger.LogWarning("Login failed - invalid password for: {Email}", request.Email);
            return null;
        }

        await EnforceSessionLimit(user, cancellationToken);

        var refreshToken = _tokenProvider.GenerateRefreshToken();
        var httpContext = _httpContextAccessor.HttpContext;

        var session = new Session
        {
            SessionId = Guid.NewGuid(),
            UserId = user.UserId,
            RefreshToken = refreshToken,
            Device = GetDeviceInfo(httpContext),
            IpAddress = httpContext?.Connection.RemoteIpAddress?.ToString() ?? "Unknown",
            UserAgent = httpContext?.Request.Headers.UserAgent.ToString() ?? "Unknown",
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(RefreshTokenExpiryDays),
            LastActiveAt = DateTime.UtcNow,
        };

        _context.Sessions.Add(session);

        user.LastLoginAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        _tokenBuilder.AddUsername(user.Email);
        _tokenBuilder.AddOrUpdateClaim(new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()));
        _tokenBuilder.AddOrUpdateClaim(new Claim(ClaimTypes.Email, user.Email));
        _tokenBuilder.AddOrUpdateClaim(new Claim("session_id", session.SessionId.ToString()));

        foreach (var role in user.Roles)
        {
            _tokenBuilder.AddClaim(new Claim(ClaimTypes.Role, role.Name));
        }

        var accessToken = _tokenBuilder.Build();

        _logger.LogInformation("Login successful for user: {UserId}, Email: {Email}", user.UserId, user.Email);

        return new LoginResponse(
            accessToken,
            refreshToken,
            AccessTokenExpiryMinutes * 60,
            new UserDto(
                user.UserId,
                user.Email,
                user.FirstName,
                user.LastName,
                user.EmailVerified,
                user.PhoneVerified,
                user.CreatedAt,
                user.LastLoginAt,
                user.Roles.Select(r => new RoleDto(r.RoleId, r.Name)).ToList()));
    }

    private async Task EnforceSessionLimit(User user, CancellationToken cancellationToken)
    {
        var activeSessions = user.Sessions
            .Where(s => !s.IsRevoked && s.ExpiresAt > DateTime.UtcNow)
            .OrderBy(s => s.CreatedAt)
            .ToList();

        if (activeSessions.Count >= MaxConcurrentSessions)
        {
            var sessionsToRevoke = activeSessions.Take(activeSessions.Count - MaxConcurrentSessions + 1);
            foreach (var session in sessionsToRevoke)
            {
                session.IsRevoked = true;
                _logger.LogInformation("Revoked session {SessionId} due to session limit", session.SessionId);
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    private static string GetDeviceInfo(HttpContext? context)
    {
        if (context == null)
        {
            return "Unknown";
        }

        var userAgent = context.Request.Headers.UserAgent.ToString();

        if (userAgent.Contains("Mobile", StringComparison.OrdinalIgnoreCase))
        {
            return "Mobile Device";
        }

        if (userAgent.Contains("Windows", StringComparison.OrdinalIgnoreCase))
        {
            return "Windows PC";
        }

        if (userAgent.Contains("Mac", StringComparison.OrdinalIgnoreCase))
        {
            return "Mac";
        }

        if (userAgent.Contains("Linux", StringComparison.OrdinalIgnoreCase))
        {
            return "Linux PC";
        }

        return "Web Browser";
    }
}
