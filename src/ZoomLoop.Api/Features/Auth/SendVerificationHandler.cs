// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Security.Claims;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.Auth;

public class SendVerificationHandler : IRequestHandler<SendVerificationRequest, bool>
{
    private readonly IZoomLoopContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<SendVerificationHandler> _logger;

    public SendVerificationHandler(
        IZoomLoopContext context,
        IHttpContextAccessor httpContextAccessor,
        ILogger<SendVerificationHandler> logger)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    public async Task<bool> Handle(SendVerificationRequest request, CancellationToken cancellationToken)
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            _logger.LogWarning("Send verification failed - user not authenticated");
            return false;
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);

        if (user == null)
        {
            return false;
        }

        if (request.Type.Equals("email", StringComparison.OrdinalIgnoreCase))
        {
            user.EmailVerificationToken = Guid.NewGuid().ToString("N");
            user.EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(24);
            _logger.LogInformation("Email verification token generated for user: {UserId}", userId);
        }
        else if (request.Type.Equals("phone", StringComparison.OrdinalIgnoreCase))
        {
            user.PhoneVerificationCode = GeneratePhoneCode();
            user.PhoneVerificationCodeExpiry = DateTime.UtcNow.AddMinutes(10);
            _logger.LogInformation("Phone verification code generated for user: {UserId}", userId);
        }
        else
        {
            return false;
        }

        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }

    private static string GeneratePhoneCode()
    {
        var random = new Random();
        return random.Next(100000, 999999).ToString();
    }
}
