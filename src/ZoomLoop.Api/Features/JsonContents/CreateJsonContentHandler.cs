// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using ZoomLoop.Core;
using DomainJsonContent = ZoomLoop.Core.Models.JsonContent;

namespace ZoomLoop.Api.Features.JsonContents;

public class CreateJsonContentHandler : IRequestHandler<CreateJsonContentRequest, CreateJsonContentResponse>
{
    private readonly IZoomLoopContext _context;

    public CreateJsonContentHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<CreateJsonContentResponse> Handle(CreateJsonContentRequest request, CancellationToken cancellationToken)
    {
        var jsonContent = new DomainJsonContent
        {
            JsonContentId = Guid.NewGuid(),
            Name = request.JsonContent.Name,
            Json = request.JsonContent.Json
        };

        _context.JsonContents.Add(jsonContent);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateJsonContentResponse { JsonContent = jsonContent.ToDto() };
    }
}
