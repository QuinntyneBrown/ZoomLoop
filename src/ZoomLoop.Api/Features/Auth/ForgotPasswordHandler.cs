// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.Auth;

public class ForgotPasswordHandler : IRequestHandler<ForgotPasswordRequest, Unit>
{
    private readonly IZoomLoopContext _context;
    private readonly ILogger<ForgotPasswordHandler> _logger;

    public ForgotPasswordHandler(IZoomLoopContext context, ILogger<ForgotPasswordHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Unit> Handle(ForgotPasswordRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);

        if (user != null)
        {
            user.PasswordResetToken = Guid.NewGuid().ToString("N");
            user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1);
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Password reset token generated for user: {Email}", request.Email);
        }
        else
        {
            _logger.LogInformation("Password reset requested for non-existent email: {Email}", request.Email);
        }

        return Unit.Value;
    }
}
