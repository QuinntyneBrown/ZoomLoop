// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Api.Features.VehicleValuation;

public class GetVehicleValuationResponse
{
    public decimal FairValue { get; set; }
    public string Explanation { get; set; } = string.Empty;
}
