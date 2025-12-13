// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.JsonContents;

public class GetJsonContentsPageHandler : IRequestHandler<GetJsonContentsPageRequest, GetJsonContentsPageResponse>
{
    private readonly IZoomLoopContext _context;

    public GetJsonContentsPageHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<GetJsonContentsPageResponse> Handle(GetJsonContentsPageRequest request, CancellationToken cancellationToken)
    {
        var query = _context.JsonContents.AsQueryable();

        var length = await query.CountAsync(cancellationToken);
        var jsonContents = await query
            .OrderBy(x => x.Name)
            .Skip(request.Index * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new GetJsonContentsPageResponse
        {
            Length = length,
            Entities = jsonContents.Select(x => x.ToDto()).ToList()
        };
    }
}
