// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.Users;

public record UpdateUserRequest(UserDto User) : IRequest<UpdateUserResponse>;

public class UpdateUserResponse
{
    public UserDto User { get; set; } = default!;
}
