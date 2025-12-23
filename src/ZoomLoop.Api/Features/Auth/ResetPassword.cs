// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.Auth;

public record ResetPasswordRequest(string Token, string NewPassword) : IRequest<bool>;
