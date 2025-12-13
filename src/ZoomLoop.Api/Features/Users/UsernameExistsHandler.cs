// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.Users;

public class UsernameExistsHandler : IRequestHandler<UsernameExistsRequest, UsernameExistsResponse>
{
    private readonly IZoomLoopContext _context;

    public UsernameExistsHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<UsernameExistsResponse> Handle(UsernameExistsRequest request, CancellationToken cancellationToken)
    {
        var exists = await _context.Users.AnyAsync(x => x.Username == request.Username, cancellationToken);
        return new UsernameExistsResponse { Exists = exists };
    }
}
