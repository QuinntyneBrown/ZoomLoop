// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Services.VehicleValuation;

public interface IVehicleValuationService
{
    Task<VehicleInfoByVinResult> GetVehicleInfoByVinAsync(string vin, CancellationToken cancellationToken = default);
    Task<VehicleValuationResult> GetVehicleValuationAsync(VehicleValuationRequest request, CancellationToken cancellationToken = default);
}
