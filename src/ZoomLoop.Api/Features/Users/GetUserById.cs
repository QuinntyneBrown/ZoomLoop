// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.Users;

public record GetUserByIdRequest(Guid UserId) : IRequest<GetUserByIdResponse>;

public class GetUserByIdResponse
{
    public UserDto? User { get; set; }
}
