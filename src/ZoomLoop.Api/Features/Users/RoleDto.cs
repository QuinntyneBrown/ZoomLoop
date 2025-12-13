// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Api.Features.Users;

public class RoleDto
{
    public Guid? RoleId { get; set; }
    public string Name { get; set; } = string.Empty;
}
