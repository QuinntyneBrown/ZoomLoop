// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using ZoomLoop.Core;
using ZoomLoop.Core.Models;

namespace ZoomLoop.Api.Features.Users;

public class GetUsersPageHandler : IRequestHandler<GetUsersPageRequest, GetUsersPageResponse>
{
    private readonly IZoomLoopContext _context;

    public GetUsersPageHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<GetUsersPageResponse> Handle(GetUsersPageRequest request, CancellationToken cancellationToken)
    {
        var query = _context.Users
            .Include(x => x.Roles)
            .Where(x => x.Status != UserStatus.Deleted);

        var length = await query.CountAsync(cancellationToken);
        var users = await query
            .OrderBy(x => x.Email)
            .Skip(request.Index * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new GetUsersPageResponse
        {
            Length = length,
            Entities = users.Select(x => x.ToDto()).ToList()
        };
    }
}
