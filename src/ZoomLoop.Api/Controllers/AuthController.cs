// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Net;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZoomLoop.Api.Features.Auth;

namespace ZoomLoop.Api.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IMediator mediator, ILogger<AuthController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [AllowAnonymous]
    [HttpPost("register", Name = "RegisterRoute")]
    [ProducesResponseType(typeof(RegisterResponse), (int)HttpStatusCode.Created)]
    [ProducesResponseType(typeof(ProblemDetails), (int)HttpStatusCode.BadRequest)]
    public async Task<ActionResult<RegisterResponse>> Register([FromBody] RegisterRequest request)
    {
        _logger.LogInformation("Registration request received for email: {Email}", request.Email);

        try
        {
            var response = await _mediator.Send(request);
            return CreatedAtRoute("GetCurrentUserRoute", null, response);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Registration failed for email: {Email}", request.Email);
            return BadRequest(new ProblemDetails { Title = "Registration Failed", Detail = ex.Message });
        }
    }

    [AllowAnonymous]
    [HttpPost("login", Name = "LoginRoute")]
    [ProducesResponseType(typeof(LoginResponse), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        _logger.LogInformation("Login request received for email: {Email}", request.Email);

        var response = await _mediator.Send(request);

        if (response == null)
        {
            return Unauthorized();
        }

        return Ok(response);
    }

    [Authorize]
    [HttpPost("logout", Name = "LogoutRoute")]
    [ProducesResponseType((int)HttpStatusCode.NoContent)]
    public async Task<IActionResult> Logout()
    {
        await _mediator.Send(new LogoutRequest());
        return NoContent();
    }

    [AllowAnonymous]
    [HttpPost("refresh", Name = "RefreshTokenRoute")]
    [ProducesResponseType(typeof(RefreshTokenResponse), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
    public async Task<ActionResult<RefreshTokenResponse>> Refresh([FromBody] RefreshTokenRequest request)
    {
        var response = await _mediator.Send(request);

        if (response == null)
        {
            return Unauthorized();
        }

        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost("forgot-password", Name = "ForgotPasswordRoute")]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        await _mediator.Send(request);
        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("reset-password", Name = "ResetPasswordRoute")]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var result = await _mediator.Send(request);

        if (!result)
        {
            return BadRequest(new ProblemDetails { Title = "Reset Failed", Detail = "Invalid or expired token." });
        }

        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("verify-email", Name = "VerifyEmailRoute")]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequest request)
    {
        var result = await _mediator.Send(request);

        if (!result)
        {
            return BadRequest(new ProblemDetails { Title = "Verification Failed", Detail = "Invalid or expired token." });
        }

        return Ok();
    }

    [Authorize]
    [HttpPost("verify-phone", Name = "VerifyPhoneRoute")]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<IActionResult> VerifyPhone([FromBody] VerifyPhoneRequest request)
    {
        var result = await _mediator.Send(request);

        if (!result)
        {
            return BadRequest(new ProblemDetails { Title = "Verification Failed", Detail = "Invalid or expired code." });
        }

        return Ok();
    }

    [Authorize]
    [HttpPost("send-verification", Name = "SendVerificationRoute")]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<IActionResult> SendVerification([FromBody] SendVerificationRequest request)
    {
        var result = await _mediator.Send(request);

        if (!result)
        {
            return BadRequest(new ProblemDetails { Title = "Failed", Detail = "Could not send verification." });
        }

        return Ok();
    }
}
