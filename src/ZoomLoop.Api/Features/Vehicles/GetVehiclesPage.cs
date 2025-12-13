// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.Vehicles;

public record GetVehiclesPageRequest(int PageSize, int Index) : IRequest<GetVehiclesPageResponse>;

public class GetVehiclesPageResponse
{
    public int Length { get; set; }
    public List<VehicleDto> Entities { get; set; } = [];
}
