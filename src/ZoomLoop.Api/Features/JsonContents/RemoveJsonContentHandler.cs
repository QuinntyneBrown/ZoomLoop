// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.JsonContents;

public class RemoveJsonContentHandler : IRequestHandler<RemoveJsonContentRequest, RemoveJsonContentResponse>
{
    private readonly IZoomLoopContext _context;

    public RemoveJsonContentHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<RemoveJsonContentResponse> Handle(RemoveJsonContentRequest request, CancellationToken cancellationToken)
    {
        var jsonContent = await _context.JsonContents
            .SingleAsync(x => x.JsonContentId == request.JsonContentId, cancellationToken);

        _context.JsonContents.Remove(jsonContent);
        await _context.SaveChangesAsync(cancellationToken);

        return new RemoveJsonContentResponse { JsonContent = jsonContent.ToDto() };
    }
}
