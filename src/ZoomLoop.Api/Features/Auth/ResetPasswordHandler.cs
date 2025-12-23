// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Text.RegularExpressions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;
using ZoomLoop.Core.Services.Security;

namespace ZoomLoop.Api.Features.Auth;

public partial class ResetPasswordHandler : IRequestHandler<ResetPasswordRequest, bool>
{
    private readonly IZoomLoopContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ILogger<ResetPasswordHandler> _logger;

    public ResetPasswordHandler(
        IZoomLoopContext context,
        IPasswordHasher passwordHasher,
        ILogger<ResetPasswordHandler> logger)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _logger = logger;
    }

    public async Task<bool> Handle(ResetPasswordRequest request, CancellationToken cancellationToken)
    {
        if (!IsValidPassword(request.NewPassword))
        {
            _logger.LogWarning("Password reset failed - password does not meet requirements");
            return false;
        }

        var user = await _context.Users
            .FirstOrDefaultAsync(
                u => u.PasswordResetToken == request.Token &&
                     u.PasswordResetTokenExpiry > DateTime.UtcNow,
                cancellationToken);

        if (user == null)
        {
            _logger.LogWarning("Password reset failed - invalid or expired token");
            return false;
        }

        user.PasswordHash = _passwordHasher.HashPassword(request.NewPassword);
        user.PasswordResetToken = null;
        user.PasswordResetTokenExpiry = null;
        user.UpdatedAt = DateTime.UtcNow;

        foreach (var session in user.Sessions)
        {
            session.IsRevoked = true;
        }

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Password reset successfully for user: {UserId}", user.UserId);

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
