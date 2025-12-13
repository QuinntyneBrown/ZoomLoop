// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.JsonContents;

public class GetJsonContentByIdHandler : IRequestHandler<GetJsonContentByIdRequest, GetJsonContentByIdResponse>
{
    private readonly IZoomLoopContext _context;

    public GetJsonContentByIdHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<GetJsonContentByIdResponse> Handle(GetJsonContentByIdRequest request, CancellationToken cancellationToken)
    {
        var jsonContent = await _context.JsonContents
            .SingleOrDefaultAsync(x => x.JsonContentId == request.JsonContentId, cancellationToken);

        return new GetJsonContentByIdResponse { JsonContent = jsonContent?.ToDto() };
    }
}
