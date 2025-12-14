// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ZoomLoop.Core;
using ZoomLoop.Core.Models;

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
        var userIdClaim = principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? principal?.FindFirst("userId")?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("User not authenticated");
        }

        var user = await _context.Users
            .SingleOrDefaultAsync(x => x.UserId == userId, cancellationToken);

        if (user == null)
        {
            throw new UnauthorizedAccessException("User not found");
        }

        PrivateSeller? profile;

        if (user.CurrentProfileId.HasValue)
        {
            profile = await _context.PrivateSellers
                .SingleOrDefaultAsync(x => x.PrivateSellerId == user.CurrentProfileId, cancellationToken);

            if (profile == null)
            {
                throw new InvalidOperationException("Profile not found");
            }
        }
        else
        {
            // Create new profile
            profile = new PrivateSeller
            {
                PrivateSellerId = Guid.NewGuid(),
                UserId = userId,
                CreatedDate = DateTime.UtcNow
            };
            _context.PrivateSellers.Add(profile);
            
            user.CurrentProfileId = profile.PrivateSellerId;
            if (!user.DefaultProfileId.HasValue)
            {
                user.DefaultProfileId = profile.PrivateSellerId;
            }
        }

        profile.FirstName = request.Profile.FirstName;
        profile.LastName = request.Profile.LastName;
        profile.Email = request.Profile.Email;
        profile.PhoneNumber = request.Profile.PhoneNumber;
        profile.AddressLine1 = request.Profile.AddressLine1;
        profile.AddressLine2 = request.Profile.AddressLine2;
        profile.City = request.Profile.City;
        profile.Province = request.Profile.Province;
        profile.PostalCode = request.Profile.PostalCode;
        profile.Country = request.Profile.Country;
        profile.LastModifiedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return new UpdateProfileResponse { Profile = profile.ToDto() };
    }
}
