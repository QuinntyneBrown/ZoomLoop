// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using ZoomLoop.Core;
using ZoomLoop.Core.Models;

namespace ZoomLoop.Api.Features.Users;

public class GetUsersHandler : IRequestHandler<GetUsersRequest, GetUsersResponse>
{
    private readonly IZoomLoopContext _context;

    public GetUsersHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<GetUsersResponse> Handle(GetUsersRequest request, CancellationToken cancellationToken)
    {
        var users = await _context.Users
            .Include(x => x.Roles)
            .Where(x => x.Status != UserStatus.Deleted)
            .ToListAsync(cancellationToken);

        return new GetUsersResponse { Users = users.Select(x => x.ToDto()).ToList() };
    }
}
