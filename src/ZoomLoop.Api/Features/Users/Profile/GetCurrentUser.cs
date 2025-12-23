// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.Users.Profile;

public record GetCurrentUserRequest : IRequest<GetCurrentUserResponse?>;

public record GetCurrentUserResponse(
    Guid UserId,
    string Email,
    string? Phone,
    string FirstName,
    string LastName,
    DateTime? DateOfBirth,
    bool EmailVerified,
    bool PhoneVerified,
    DateTime CreatedAt,
    DateTime? LastLoginAt);
