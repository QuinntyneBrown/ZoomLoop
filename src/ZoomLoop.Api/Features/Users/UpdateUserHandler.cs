// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using ZoomLoop.Core;
using ZoomLoop.Core.Services.Security;

namespace ZoomLoop.Api.Features.Users;

public class UpdateUserHandler : IRequestHandler<UpdateUserRequest, UpdateUserResponse>
{
    private readonly IZoomLoopContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public UpdateUserHandler(IZoomLoopContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<UpdateUserResponse> Handle(UpdateUserRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(x => x.Roles)
            .SingleAsync(x => x.UserId == request.User.UserId, cancellationToken);

        user.Username = request.User.Username;

        if (!string.IsNullOrWhiteSpace(request.User.Password))
        {
            user.Password = _passwordHasher.HashPassword(user.Salt, request.User.Password);
        }

        if (request.User.Roles?.Any() == true)
        {
            var roleIds = request.User.Roles
                .Where(x => x.RoleId.HasValue)
                .Select(x => x.RoleId!.Value)
                .ToList();

            var roles = await _context.Roles
                .Where(x => roleIds.Contains(x.RoleId))
                .ToListAsync(cancellationToken);

            user.Roles = roles;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new UpdateUserResponse { User = user.ToDto() };
    }
}
