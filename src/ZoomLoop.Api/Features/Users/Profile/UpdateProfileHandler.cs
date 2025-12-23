// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Security.Claims;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.Users.Profile;

public class UpdateProfileHandler : IRequestHandler<UpdateProfileRequest, bool>
{
    private readonly IZoomLoopContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<UpdateProfileHandler> _logger;

    public UpdateProfileHandler(
        IZoomLoopContext context,
        IHttpContextAccessor httpContextAccessor,
        ILogger<UpdateProfileHandler> logger)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    public async Task<bool> Handle(UpdateProfileRequest request, CancellationToken cancellationToken)
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

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Phone = request.Phone;
        user.DateOfBirth = request.DateOfBirth;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Profile updated for user: {UserId}", userId);

        return true;
    }
}
