// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Cryptography;
using ZoomLoop.Core;
using ZoomLoop.Core.Models;
using ZoomLoop.Core.Services.Security;

namespace ZoomLoop.Api.Features.Users;

public class CreateUserHandler : IRequestHandler<CreateUserRequest, CreateUserResponse>
{
    private readonly IZoomLoopContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public CreateUserHandler(IZoomLoopContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<CreateUserResponse> Handle(CreateUserRequest request, CancellationToken cancellationToken)
    {
        var salt = RandomNumberGenerator.GetBytes(16);
        var hashedPassword = _passwordHasher.HashPassword(salt, request.User.Password);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = request.User.Username,
            Salt = salt,
            Password = hashedPassword,
            CurrentProfileId = request.User.CurrentProfileId ?? Guid.Empty,
            DefaultProfileId = request.User.DefaultProfileId ?? Guid.Empty,
            IsDeleted = false
        };

        if (request.User.Roles?.Any() == true)
        {
            var roleIds = request.User.Roles
                .Where(x => x.RoleId.HasValue)
                .Select(x => x.RoleId!.Value)
                .ToList();

            var roles = await _context.Roles
                .Where(x => roleIds.Contains(x.RoleId))
                .ToListAsync(cancellationToken);

            foreach (var role in roles)
            {
                user.Roles.Add(role);
            }
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateUserResponse { User = user.ToDto() };
    }
}
