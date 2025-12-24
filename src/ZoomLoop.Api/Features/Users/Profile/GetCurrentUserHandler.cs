// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;
using ZoomLoop.Core.Services;

namespace ZoomLoop.Api.Features.Users.Profile;

public class GetCurrentUserHandler : IRequestHandler<GetCurrentUserRequest, GetCurrentUserResponse?>
{
    private readonly IZoomLoopContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<GetCurrentUserHandler> _logger;

    public GetCurrentUserHandler(
        IZoomLoopContext context,
        ICurrentUserService currentUserService,
        ILogger<GetCurrentUserHandler> logger)
    {
        _context = context;
        _currentUserService = currentUserService;
        _logger = logger;
    }

    public async Task<GetCurrentUserResponse?> Handle(GetCurrentUserRequest request, CancellationToken cancellationToken)
    {
        var user = await _currentUserService.GetAsync(cancellationToken);

        if (user == null)
        {
            return null;
        }

        // Load roles eagerly since CurrentUserService returns user without navigation properties
        await _context.Entry(user).Collection(u => u.Roles).LoadAsync(cancellationToken);

        return new GetCurrentUserResponse(
            user.UserId,
            user.Email,
            user.Phone,
            user.FirstName,
            user.LastName,
            user.DateOfBirth,
            user.EmailVerified,
            user.PhoneVerified,
            user.CreatedAt,
            user.LastLoginAt,
            user.Roles.Select(r => new RoleDto(r.RoleId, r.Name)).ToList());
    }
}
