// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.Users;

public record GetUsersRequest() : IRequest<GetUsersResponse>;

public class GetUsersResponse
{
    public List<UserDto> Users { get; set; } = [];
}
