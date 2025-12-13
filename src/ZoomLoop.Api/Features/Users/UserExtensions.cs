// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Linq;
using ZoomLoop.Core.Models;

namespace ZoomLoop.Api.Features.Users;

public static class UserExtensions
{
    public static UserDto ToDto(this User user)
    {
        return new UserDto
        {
            UserId = user.UserId,
            Username = user.Username,
            CurrentProfileId = user.CurrentProfileId,
            DefaultProfileId = user.DefaultProfileId,
            IsDeleted = user.IsDeleted,
            Roles = user.Roles.Select(x => x.ToDto()).ToList()
        };
    }

    public static RoleDto ToDto(this Role role)
    {
        return new RoleDto
        {
            RoleId = role.RoleId,
            Name = role.Name
        };
    }
}
