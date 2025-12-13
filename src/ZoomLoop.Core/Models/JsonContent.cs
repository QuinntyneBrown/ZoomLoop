// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class JsonContent
{
    public Guid JsonContentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Json { get; set; } = "{}";
}
