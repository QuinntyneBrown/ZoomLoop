// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.Profiles;

public record GetCurrentProfileRequest() : IRequest<GetCurrentProfileResponse>;

public class GetCurrentProfileResponse
{
    public ProfileDto? Profile { get; set; }
}
