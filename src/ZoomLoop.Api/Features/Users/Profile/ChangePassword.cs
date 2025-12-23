// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.Users.Profile;

public record ChangePasswordRequest(string CurrentPassword, string NewPassword) : IRequest<bool>;
