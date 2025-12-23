// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Security.Claims;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.Auth;

public class VerifyPhoneHandler : IRequestHandler<VerifyPhoneRequest, bool>
{
    private readonly IZoomLoopContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<VerifyPhoneHandler> _logger;

    public VerifyPhoneHandler(
        IZoomLoopContext context,
        IHttpContextAccessor httpContextAccessor,
        ILogger<VerifyPhoneHandler> logger)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    public async Task<bool> Handle(VerifyPhoneRequest request, CancellationToken cancellationToken)
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            _logger.LogWarning("Phone verification failed - user not authenticated");
            return false;
        }

        var user = await _context.Users
            .FirstOrDefaultAsync(
                u => u.UserId == userId &&
                     u.PhoneVerificationCode == request.Code &&
                     u.PhoneVerificationCodeExpiry > DateTime.UtcNow,
                cancellationToken);

        if (user == null)
        {
            _logger.LogWarning("Phone verification failed - invalid or expired code for user: {UserId}", userId);
            return false;
        }

        user.PhoneVerified = true;
        user.PhoneVerifiedAt = DateTime.UtcNow;
        user.PhoneVerificationCode = null;
        user.PhoneVerificationCodeExpiry = null;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Phone verified successfully for user: {UserId}", user.UserId);

        return true;
    }
}
