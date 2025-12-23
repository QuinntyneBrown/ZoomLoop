// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.Auth;

public class VerifyEmailHandler : IRequestHandler<VerifyEmailRequest, bool>
{
    private readonly IZoomLoopContext _context;
    private readonly ILogger<VerifyEmailHandler> _logger;

    public VerifyEmailHandler(IZoomLoopContext context, ILogger<VerifyEmailHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<bool> Handle(VerifyEmailRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(
                u => u.EmailVerificationToken == request.Token &&
                     u.EmailVerificationTokenExpiry > DateTime.UtcNow,
                cancellationToken);

        if (user == null)
        {
            _logger.LogWarning("Email verification failed - invalid or expired token");
            return false;
        }

        user.EmailVerified = true;
        user.EmailVerifiedAt = DateTime.UtcNow;
        user.EmailVerificationToken = null;
        user.EmailVerificationTokenExpiry = null;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Email verified successfully for user: {UserId}", user.UserId);

        return true;
    }
}
