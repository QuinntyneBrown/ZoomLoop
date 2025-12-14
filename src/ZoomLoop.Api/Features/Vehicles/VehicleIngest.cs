// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Http;

namespace ZoomLoop.Api.Features.Vehicles;

public record VehicleIngestRequest(List<IFormFile> Images) : IRequest<VehicleIngestResponse>;

public class VehicleIngestResponse
{
    public VehicleDto Vehicle { get; set; } = default!;
}
