// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.Users;

public class GetUserByIdHandler : IRequestHandler<GetUserByIdRequest, GetUserByIdResponse>
{
    private readonly IZoomLoopContext _context;

    public GetUserByIdHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<GetUserByIdResponse> Handle(GetUserByIdRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(x => x.Roles)
            .ThenInclude(x => x.Privileges)
            .SingleOrDefaultAsync(x => x.UserId == request.UserId, cancellationToken);

        return new GetUserByIdResponse { User = user?.ToDto() };
    }
}
