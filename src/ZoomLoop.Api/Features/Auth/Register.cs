// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.Auth;

public record RegisterRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string? Phone,
    bool MarketingOptIn) : IRequest<RegisterResponse>;

public record RegisterResponse(Guid UserId, string Email, bool VerificationEmailSent);
