// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Http;

namespace ZoomLoop.Api.Features.Vehicles;

public record UploadVehicleImagesRequest(Guid VehicleId, List<IFormFile> Files) : IRequest<UploadVehicleImagesResponse>;

public class UploadVehicleImagesResponse
{
    public List<VehicleImageDto> Images { get; set; } = [];
}
