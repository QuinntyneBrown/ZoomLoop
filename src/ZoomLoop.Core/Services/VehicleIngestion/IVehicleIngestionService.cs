// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Services.VehicleIngestion;

public interface IVehicleIngestionService
{
    Task<VehicleIngestionResult> IngestVehicleAsync(VehicleIngestionRequest request, CancellationToken cancellationToken = default);
}
