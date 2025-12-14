// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using ZoomLoop.Api.Features.VehicleValuation;

namespace ZoomLoop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehicleValuationController
{
    private readonly IMediator _mediator;
    private readonly ILogger<VehicleValuationController> _logger;

    public VehicleValuationController(IMediator mediator, ILogger<VehicleValuationController> logger)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [HttpGet("vin/{vin}", Name = "GetVehicleByVinRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetVehicleByVinResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetVehicleByVinResponse>> GetByVin([FromRoute] string vin)
        => await _mediator.Send(new GetVehicleByVinRequest(vin));

    [HttpPost("valuation", Name = "GetVehicleValuationRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetVehicleValuationResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetVehicleValuationResponse>> GetValuation([FromBody] GetVehicleValuationRequest request)
        => await _mediator.Send(request);
}
