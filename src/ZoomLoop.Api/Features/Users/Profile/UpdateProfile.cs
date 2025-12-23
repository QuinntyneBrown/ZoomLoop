// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.Users.Profile;

public record UpdateProfileRequest(
    string FirstName,
    string LastName,
    string? Phone,
    DateTime? DateOfBirth) : IRequest<bool>;
