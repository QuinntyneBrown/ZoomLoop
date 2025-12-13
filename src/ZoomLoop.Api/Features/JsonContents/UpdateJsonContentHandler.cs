// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.JsonContents;

public class UpdateJsonContentHandler : IRequestHandler<UpdateJsonContentRequest, UpdateJsonContentResponse>
{
    private readonly IZoomLoopContext _context;

    public UpdateJsonContentHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<UpdateJsonContentResponse> Handle(UpdateJsonContentRequest request, CancellationToken cancellationToken)
    {
        var jsonContent = await _context.JsonContents
            .SingleAsync(x => x.JsonContentId == request.JsonContent.JsonContentId, cancellationToken);

        jsonContent.Name = request.JsonContent.Name;
        jsonContent.Json = request.JsonContent.Json;

        await _context.SaveChangesAsync(cancellationToken);

        return new UpdateJsonContentResponse { JsonContent = jsonContent.ToDto() };
    }
}
