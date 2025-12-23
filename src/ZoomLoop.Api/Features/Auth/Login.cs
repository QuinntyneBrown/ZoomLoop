// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.Auth;

public record LoginRequest(string Email, string Password, bool RememberMe) : IRequest<LoginResponse?>;

public record LoginResponse(string AccessToken, string RefreshToken, int ExpiresIn, UserDto User);

public record UserDto(
    Guid UserId,
    string Email,
    string FirstName,
    string LastName,
    bool EmailVerified,
    bool PhoneVerified,
    DateTime CreatedAt,
    DateTime? LastLoginAt);
