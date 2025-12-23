// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Net;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZoomLoop.Api.Features.Users.Profile;

namespace ZoomLoop.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/users")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IMediator mediator, ILogger<UsersController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet("me", Name = "GetCurrentUserRoute")]
    [ProducesResponseType(typeof(GetCurrentUserResponse), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
    public async Task<ActionResult<GetCurrentUserResponse>> GetCurrentUser()
    {
        var response = await _mediator.Send(new GetCurrentUserRequest());

        if (response == null)
        {
            return Unauthorized();
        }

        return Ok(response);
    }

    [HttpPut("me", Name = "UpdateProfileRoute")]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var result = await _mediator.Send(request);

        if (!result)
        {
            return BadRequest();
        }

        return Ok();
    }

    [HttpPut("me/email", Name = "ChangeEmailRoute")]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<IActionResult> ChangeEmail([FromBody] ChangeEmailRequest request)
    {
        var result = await _mediator.Send(request);

        if (!result)
        {
            return BadRequest(new ProblemDetails { Title = "Failed", Detail = "Could not change email." });
        }

        return Ok();
    }

    [HttpPut("me/password", Name = "ChangePasswordRoute")]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var result = await _mediator.Send(request);

        if (!result)
        {
            return BadRequest(new ProblemDetails { Title = "Failed", Detail = "Could not change password." });
        }

        return Ok();
    }

    [HttpGet("me/preferences", Name = "GetPreferencesRoute")]
    [ProducesResponseType(typeof(GetPreferencesResponse), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
    public async Task<ActionResult<GetPreferencesResponse>> GetPreferences()
    {
        var response = await _mediator.Send(new GetPreferencesRequest());

        if (response == null)
        {
            return Unauthorized();
        }

        return Ok(response);
    }

    [HttpPut("me/preferences", Name = "UpdatePreferencesRoute")]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<IActionResult> UpdatePreferences([FromBody] UpdatePreferencesRequest request)
    {
        var result = await _mediator.Send(request);

        if (!result)
        {
            return BadRequest();
        }

        return Ok();
    }

    [HttpGet("me/sessions", Name = "GetSessionsRoute")]
    [ProducesResponseType(typeof(GetSessionsResponse), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<GetSessionsResponse>> GetSessions()
    {
        var response = await _mediator.Send(new GetSessionsRequest());
        return Ok(response);
    }

    [HttpDelete("me/sessions/{sessionId}", Name = "RevokeSessionRoute")]
    [ProducesResponseType((int)HttpStatusCode.NoContent)]
    [ProducesResponseType((int)HttpStatusCode.NotFound)]
    public async Task<IActionResult> RevokeSession([FromRoute] Guid sessionId)
    {
        var result = await _mediator.Send(new RevokeSessionRequest(sessionId));

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
}
