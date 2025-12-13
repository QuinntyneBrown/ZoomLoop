// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.JsonContents;

public class GetJsonContentByNameHandler : IRequestHandler<GetJsonContentByNameRequest, GetJsonContentByNameResponse>
{
    private readonly IZoomLoopContext _context;

    public GetJsonContentByNameHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<GetJsonContentByNameResponse> Handle(GetJsonContentByNameRequest request, CancellationToken cancellationToken)
    {
        var jsonContent = await _context.JsonContents
            .SingleOrDefaultAsync(x => x.Name == request.Name, cancellationToken);

        return new GetJsonContentByNameResponse { JsonContent = jsonContent?.ToDto() };
    }
}
