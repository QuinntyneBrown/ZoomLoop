// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.Vehicles;

public record CreateVehicleRequest(VehicleDto Vehicle) : IRequest<CreateVehicleResponse>;

public class CreateVehicleResponse
{
    public VehicleDto Vehicle { get; set; } = default!;
}
