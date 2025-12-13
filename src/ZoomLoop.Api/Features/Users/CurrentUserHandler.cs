// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.Users;

public class CurrentUserHandler : IRequestHandler<CurrentUserRequest, CurrentUserResponse>
{
    private readonly IZoomLoopContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserHandler(IZoomLoopContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<CurrentUserResponse> Handle(CurrentUserRequest request, CancellationToken cancellationToken)
    {
        var principal = _httpContextAccessor.HttpContext?.User;
        if (principal?.Identity?.IsAuthenticated != true)
        {
            return new CurrentUserResponse();
        }

        var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? principal.FindFirst("userId")?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return new CurrentUserResponse();
        }

        var user = await _context.Users
            .Include(x => x.Roles)
            .ThenInclude(x => x.Privileges)
            .SingleOrDefaultAsync(x => x.UserId == userId, cancellationToken);

        return new CurrentUserResponse { User = user?.ToDto() };
    }
}
