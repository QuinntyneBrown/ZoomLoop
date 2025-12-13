// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class Privilege
{
    public Privilege()
    {
        Aggregate = string.Empty;
    }

    public Guid PrivilegeId { get; set; }
    public Guid RoleId { get; set; }
    public AccessRight AccessRight { get; set; }
    public string Aggregate { get; set; }
    public Role? Role { get; set; }
}
