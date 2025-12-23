// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Security.Claims;
using System.Text.RegularExpressions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;
using ZoomLoop.Core.Services.Security;

namespace ZoomLoop.Api.Features.Users.Profile;

public partial class ChangePasswordHandler : IRequestHandler<ChangePasswordRequest, bool>
{
    private readonly IZoomLoopContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<ChangePasswordHandler> _logger;

    public ChangePasswordHandler(
        IZoomLoopContext context,
        IPasswordHasher passwordHasher,
        IHttpContextAccessor httpContextAccessor,
        ILogger<ChangePasswordHandler> logger)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    public async Task<bool> Handle(ChangePasswordRequest request, CancellationToken cancellationToken)
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return false;
        }

        if (!IsValidPassword(request.NewPassword))
        {
            _logger.LogWarning("Password change failed - new password does not meet requirements for user: {UserId}", userId);
            return false;
        }

        var user = await _context.Users
            .Include(u => u.Sessions)
            .FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);

        if (user == null)
        {
            return false;
        }

        if (!_passwordHasher.VerifyPassword(request.CurrentPassword, user.PasswordHash))
        {
            _logger.LogWarning("Password change failed - invalid current password for user: {UserId}", userId);
            return false;
        }

        user.PasswordHash = _passwordHasher.HashPassword(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;

        foreach (var session in user.Sessions)
        {
            session.IsRevoked = true;
        }

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Password changed for user: {UserId}", userId);

        return true;
    }

    private static bool IsValidPassword(string password)
    {
        if (password.Length < 8)
        {
            return false;
        }

        if (!UppercaseRegex().IsMatch(password))
        {
            return false;
        }

        if (!NumberRegex().IsMatch(password))
        {
            return false;
        }

        return true;
    }

    [GeneratedRegex("[A-Z]")]
    private static partial Regex UppercaseRegex();

    [GeneratedRegex("[0-9]")]
    private static partial Regex NumberRegex();
}
