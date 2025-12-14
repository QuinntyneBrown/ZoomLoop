// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.Vehicles;

public record GetVehicleSuggestionsRequest : IRequest<GetVehicleSuggestionsResponse>
{
    public string? Query { get; set; }
    public string? Field { get; set; }
    public int Limit { get; set; } = 10;
}

public class GetVehicleSuggestionsResponse
{
    public List<string> Suggestions { get; set; } = [];
}
