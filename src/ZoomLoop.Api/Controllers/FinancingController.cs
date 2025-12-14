// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using ZoomLoop.Api.Features.Financing;

namespace ZoomLoop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FinancingController
{
    private readonly IMediator _mediator;
    private readonly ILogger<FinancingController> _logger;

    public FinancingController(IMediator mediator, ILogger<FinancingController> logger)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [HttpPost("calculate", Name = "CalculateFinancingRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(CalculateFinancingResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<CalculateFinancingResponse>> Calculate([FromBody] CalculateFinancingRequest request)
        => await _mediator.Send(request);

    [HttpGet("tax-rates", Name = "GetTaxRatesRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(GetTaxRatesResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetTaxRatesResponse>> GetTaxRates()
        => await _mediator.Send(new GetTaxRatesRequest());
}
