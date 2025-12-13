// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.Users;

public record GetUsersPageRequest(int PageSize, int Index) : IRequest<GetUsersPageResponse>;

public class GetUsersPageResponse
{
    public int Length { get; set; }
    public List<UserDto> Entities { get; set; } = [];
}
