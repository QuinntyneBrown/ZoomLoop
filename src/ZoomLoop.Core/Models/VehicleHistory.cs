// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class VehicleHistory
{
    public VehicleHistory()
    {
        VIN = string.Empty;
        ReportType = string.Empty;
        ReportProvider = string.Empty;
        ReportData = string.Empty;
    }

    public Guid VehicleHistoryId { get; set; }
    public Guid VehicleId { get; set; }
    public string VIN { get; set; }
    public string ReportType { get; set; }
    public string ReportProvider { get; set; }
    public string ReportData { get; set; }
    public int NumberOfOwners { get; set; }
    public bool HasAccidents { get; set; }
    public bool HasServiceRecords { get; set; }
    public bool IsCleanTitle { get; set; }
    public DateTime ReportDate { get; set; }
    public DateTime CreatedDate { get; set; }
    public Vehicle? Vehicle { get; set; }
}
