// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.JsonContents;

public class GetJsonContentsHandler : IRequestHandler<GetJsonContentsRequest, GetJsonContentsResponse>
{
    private readonly IZoomLoopContext _context;

    public GetJsonContentsHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<GetJsonContentsResponse> Handle(GetJsonContentsRequest request, CancellationToken cancellationToken)
    {
        var jsonContents = await _context.JsonContents
            .ToListAsync(cancellationToken);

        return new GetJsonContentsResponse { JsonContents = jsonContents.Select(x => x.ToDto()).ToList() };
    }
}
