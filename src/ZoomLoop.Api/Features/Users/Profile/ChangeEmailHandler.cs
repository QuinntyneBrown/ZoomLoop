// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Security.Claims;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;
using ZoomLoop.Core.Services.Security;

namespace ZoomLoop.Api.Features.Users.Profile;

public class ChangeEmailHandler : IRequestHandler<ChangeEmailRequest, bool>
{
    private readonly IZoomLoopContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<ChangeEmailHandler> _logger;

    public ChangeEmailHandler(
        IZoomLoopContext context,
        IPasswordHasher passwordHasher,
        IHttpContextAccessor httpContextAccessor,
        ILogger<ChangeEmailHandler> logger)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    public async Task<bool> Handle(ChangeEmailRequest request, CancellationToken cancellationToken)
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return false;
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);

        if (user == null)
        {
            return false;
        }

        if (!_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            _logger.LogWarning("Email change failed - invalid password for user: {UserId}", userId);
            return false;
        }

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.NewEmail && u.UserId != userId, cancellationToken);

        if (existingUser != null)
        {
            _logger.LogWarning("Email change failed - email already in use: {Email}", request.NewEmail);
            return false;
        }

        user.Email = request.NewEmail;
        user.EmailVerified = false;
        user.EmailVerificationToken = Guid.NewGuid().ToString("N");
        user.EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(24);
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Email changed for user: {UserId}, new email: {Email}", userId, request.NewEmail);

        return true;
    }
}
