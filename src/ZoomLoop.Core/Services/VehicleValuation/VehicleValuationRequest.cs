// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Services.VehicleValuation;

public class VehicleValuationRequest
{
    public string Vin { get; set; } = string.Empty;
    public int Year { get; set; }
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public int Kilometers { get; set; }
    public int Accidents { get; set; }
    public string InteriorCondition { get; set; } = string.Empty;
    public string ExteriorCondition { get; set; } = string.Empty;
}
