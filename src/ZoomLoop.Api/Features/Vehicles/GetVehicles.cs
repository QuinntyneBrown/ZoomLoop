// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.Vehicles;

public record GetVehiclesRequest() : IRequest<GetVehiclesResponse>;

public class GetVehiclesResponse
{
    public List<VehicleDto> Vehicles { get; set; } = [];
}
