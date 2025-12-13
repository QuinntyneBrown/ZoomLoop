// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using ZoomLoop.Core;
using ZoomLoop.Core.Models;

namespace ZoomLoop.Api.Features.JsonContents;

public static class JsonContentExtensions
{
    public static JsonContentDto ToDto(this Core.Models.JsonContent jsonContent)
    {
        return new JsonContentDto
        {
            JsonContentId = jsonContent.JsonContentId,
            Name = jsonContent.Name,
            Json = jsonContent.Json
        };
    }
}

public class JsonContentDto
{
    public Guid? JsonContentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Json { get; set; } = "{}";
}

// Queries
public record GetJsonContentByIdRequest(Guid JsonContentId) : IRequest<GetJsonContentByIdResponse>;
public class GetJsonContentByIdResponse
{
    public JsonContentDto? JsonContent { get; set; }
}

public record GetJsonContentByNameRequest(string Name) : IRequest<GetJsonContentByNameResponse>;
public class GetJsonContentByNameResponse
{
    public JsonContentDto? JsonContent { get; set; }
}

public record GetJsonContentsRequest() : IRequest<GetJsonContentsResponse>;
public class GetJsonContentsResponse
{
    public List<JsonContentDto> JsonContents { get; set; } = [];
}

public record GetJsonContentsPageRequest(int PageSize, int Index) : IRequest<GetJsonContentsPageResponse>;
public class GetJsonContentsPageResponse
{
    public int Length { get; set; }
    public List<JsonContentDto> Entities { get; set; } = [];
}

// Commands
public record CreateJsonContentRequest(JsonContentDto JsonContent) : IRequest<CreateJsonContentResponse>;
public class CreateJsonContentResponse
{
    public JsonContentDto JsonContent { get; set; } = default!;
}

public record UpdateJsonContentRequest(JsonContentDto JsonContent) : IRequest<UpdateJsonContentResponse>;
public class UpdateJsonContentResponse
{
    public JsonContentDto JsonContent { get; set; } = default!;
}

public record RemoveJsonContentRequest(Guid JsonContentId) : IRequest<RemoveJsonContentResponse>;
public class RemoveJsonContentResponse
{
    public JsonContentDto JsonContent { get; set; } = default!;
}

// Handlers
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

public class CreateJsonContentHandler : IRequestHandler<CreateJsonContentRequest, CreateJsonContentResponse>
{
    private readonly IZoomLoopContext _context;
    public CreateJsonContentHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<CreateJsonContentResponse> Handle(CreateJsonContentRequest request, CancellationToken cancellationToken)
    {
        var jsonContent = new Core.Models.JsonContent
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
