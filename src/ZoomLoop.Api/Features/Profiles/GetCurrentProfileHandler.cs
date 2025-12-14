// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.Profiles;

public class GetCurrentProfileHandler : IRequestHandler<GetCurrentProfileRequest, GetCurrentProfileResponse>
{
    private readonly IZoomLoopContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetCurrentProfileHandler(IZoomLoopContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<GetCurrentProfileResponse> Handle(GetCurrentProfileRequest request, CancellationToken cancellationToken)
    {
        var principal = _httpContextAccessor.HttpContext?.User;
        if (principal?.Identity?.IsAuthenticated != true)
        {
            return new GetCurrentProfileResponse();
        }

        var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? principal.FindFirst("userId")?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return new GetCurrentProfileResponse();
        }

        var user = await _context.Users
            .SingleOrDefaultAsync(x => x.UserId == userId, cancellationToken);

        if (user?.CurrentProfileId == null)
        {
            return new GetCurrentProfileResponse();
        }

        var profile = await _context.PrivateSellers
            .SingleOrDefaultAsync(x => x.PrivateSellerId == user.CurrentProfileId, cancellationToken);

        return new GetCurrentProfileResponse { Profile = profile?.ToDto() };
    }
}
