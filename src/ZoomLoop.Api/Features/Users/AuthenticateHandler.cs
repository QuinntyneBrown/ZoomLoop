// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ZoomLoop.Core;
using ZoomLoop.Core.Services.Security;

namespace ZoomLoop.Api.Features.Users;

public class AuthenticateHandler : IRequestHandler<AuthenticateRequest, AuthenticateResponse?>
{
    private readonly IZoomLoopContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenBuilder _tokenBuilder;

    public AuthenticateHandler(IZoomLoopContext context, IPasswordHasher passwordHasher, ITokenBuilder tokenBuilder)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenBuilder = tokenBuilder;
    }

    public async Task<AuthenticateResponse?> Handle(AuthenticateRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(x => x.Roles)
            .ThenInclude(x => x.Privileges)
            .SingleOrDefaultAsync(x => x.Username == request.Username && !x.IsDeleted, cancellationToken);

        if (user == null)
        {
            return null;
        }

        var transformedPassword = _passwordHasher.HashPassword(user.Salt, request.Password);
        if (user.Password != transformedPassword)
        {
            return null;
        }

        _tokenBuilder.AddUsername(user.Username);
        _tokenBuilder.AddOrUpdateClaim(new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()));

        var accessToken = _tokenBuilder.Build();

        return new AuthenticateResponse(accessToken, user.UserId);
    }
}
