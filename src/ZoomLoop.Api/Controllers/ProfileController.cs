// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using ZoomLoop.Api.Features.Profiles;

namespace ZoomLoop.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProfileController
{
    private readonly IMediator _mediator;
    private readonly ILogger<ProfileController> _logger;

    public ProfileController(IMediator mediator, ILogger<ProfileController> logger)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [HttpGet("current", Name = "GetCurrentProfileRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(GetCurrentProfileResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetCurrentProfileResponse>> GetCurrent()
        => await _mediator.Send(new GetCurrentProfileRequest());

    [HttpPut(Name = "UpdateProfileRoute")]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(UpdateProfileResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<UpdateProfileResponse>> Update([FromBody] UpdateProfileRequest request)
        => await _mediator.Send(request);
}
