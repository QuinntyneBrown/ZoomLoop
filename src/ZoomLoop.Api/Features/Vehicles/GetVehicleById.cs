// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.Vehicles;

public record GetVehicleByIdRequest(Guid VehicleId) : IRequest<GetVehicleByIdResponse>;

public class GetVehicleByIdResponse
{
    public VehicleDto? Vehicle { get; set; }
}
