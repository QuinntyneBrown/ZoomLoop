// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;
using ZoomLoop.Core.Models;

namespace ZoomLoop.Api.Features.Users;

public class RemoveUserHandler : IRequestHandler<RemoveUserRequest, RemoveUserResponse>
{
    private readonly IZoomLoopContext _context;

    public RemoveUserHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<RemoveUserResponse> Handle(RemoveUserRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.SingleAsync(x => x.UserId == request.UserId, cancellationToken);
        user.Status = UserStatus.Deleted;
        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveUserResponse { User = user.ToDto() };
    }
}
