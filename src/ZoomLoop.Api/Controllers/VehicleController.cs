// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using ZoomLoop.Api.Features.Vehicles;

// Vehicle search endpoint allows anonymous access for public car browsing

namespace ZoomLoop.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class VehicleController
{
    private readonly IMediator _mediator;
    private readonly ILogger<VehicleController> _logger;

    public VehicleController(IMediator mediator, ILogger<VehicleController> logger)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [HttpGet("{vehicleId}", Name = "GetVehicleByIdRoute")]
    [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetVehicleByIdResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetVehicleByIdResponse>> GetById([FromRoute] GetVehicleByIdRequest request)
    {
        _logger.LogInformation("Getting vehicle by ID: {VehicleId}", request.VehicleId);

        var response = await _mediator.Send(request);
        if (response.Vehicle == null)
        {
            _logger.LogWarning("Vehicle not found: {VehicleId}", request.VehicleId);
            return new NotFoundObjectResult(request.VehicleId);
        }

        _logger.LogInformation("Vehicle retrieved successfully: {VehicleId}", request.VehicleId);
        return response;
    }

    [HttpGet(Name = "GetVehiclesRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetVehiclesResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetVehiclesResponse>> Get()
        => await _mediator.Send(new GetVehiclesRequest());

    [HttpGet("page/{pageSize}/{index}", Name = "GetVehiclesPageRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetVehiclesPageResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetVehiclesPageResponse>> Page([FromRoute] GetVehiclesPageRequest request)
        => await _mediator.Send(request);

    [HttpPost(Name = "CreateVehicleRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CreateVehicleResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CreateVehicleResponse>> Create([FromBody] CreateVehicleRequest request)
    {
        _logger.LogInformation("Creating new vehicle");
        var response = await _mediator.Send(request);
        _logger.LogInformation("Vehicle created successfully: {VehicleId}", response.Vehicle?.VehicleId);
        return response;
    }

    [HttpPut(Name = "UpdateVehicleRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateVehicleResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateVehicleResponse>> Update([FromBody] UpdateVehicleRequest request)
        => await _mediator.Send(request);

    [HttpDelete("{vehicleId}", Name = "DeleteVehicleRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(DeleteVehicleResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<DeleteVehicleResponse>> Delete([FromRoute] DeleteVehicleRequest request)
    {
        _logger.LogInformation("Deleting vehicle: {VehicleId}", request.VehicleId);
        var response = await _mediator.Send(request);
        _logger.LogInformation("Vehicle deleted successfully: {VehicleId}", request.VehicleId);
        return response;
    }

    [HttpPost("{vehicleId}/images", Name = "UploadVehicleImagesRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UploadVehicleImagesResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UploadVehicleImagesResponse>> UploadImages([FromRoute] Guid vehicleId, [FromForm] List<IFormFile> files)
    {
        var request = new UploadVehicleImagesRequest(vehicleId, files);
        return await _mediator.Send(request);
    }

    [HttpPost("ingest", Name = "VehicleIngestRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(VehicleIngestResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<VehicleIngestResponse>> Ingest([FromForm] List<IFormFile> images)
    {
        var request = new VehicleIngestRequest(images);
        return await _mediator.Send(request);
    }

    [AllowAnonymous]
    [HttpPost("search", Name = "SearchVehiclesRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(SearchVehiclesResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<SearchVehiclesResponse>> Search([FromBody] SearchVehiclesRequest request)
        => await _mediator.Send(request);

    [HttpGet("suggestions", Name = "GetVehicleSuggestionsRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetVehicleSuggestionsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetVehicleSuggestionsResponse>> GetSuggestions([FromQuery] GetVehicleSuggestionsRequest request)
        => await _mediator.Send(request);
}
