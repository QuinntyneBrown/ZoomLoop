// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.Profiles;

public class UpdateProfileHandler : IRequestHandler<UpdateProfileRequest, UpdateProfileResponse>
{
    private readonly IZoomLoopContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UpdateProfileHandler(IZoomLoopContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<UpdateProfileResponse> Handle(UpdateProfileRequest request, CancellationToken cancellationToken)
    {
        var principal = _httpContextAccessor.HttpContext?.User;
        if (principal?.Identity?.IsAuthenticated != true)
        {
            throw new UnauthorizedAccessException("User is not authenticated");
        }

        var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? principal.FindFirst("userId")?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user identifier");
        }

        var user = await _context.Users
            .SingleOrDefaultAsync(x => x.UserId == userId, cancellationToken);

        if (user == null)
        {
            throw new UnauthorizedAccessException("User not found");
        }

        // Get the profile to update
        var profileId = request.Profile.ProfileId;
        if (!profileId.HasValue)
        {
            throw new ArgumentException("Profile ID is required");
        }

        // Authorization: Only allow users to update their own profile
        if (user.CurrentProfileId != profileId.Value)
        {
            throw new UnauthorizedAccessException("Users can only update their own profile");
        }

        var profile = await _context.Profiles
            .SingleOrDefaultAsync(x => x.ProfileId == profileId.Value, cancellationToken);

        if (profile == null)
        {
            throw new ArgumentException("Profile not found");
        }

        profile.UpdateFromDto(request.Profile);

        await _context.SaveChangesAsync(cancellationToken);

        return new UpdateProfileResponse { Profile = profile.ToDto() };
    }
}
