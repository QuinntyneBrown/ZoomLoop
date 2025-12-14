// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class User {

    public User()
    {
        Username = string.Empty;
        Password = string.Empty;
        Salt = [];
        Roles = [];
    }

    public Guid UserId { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public byte[] Salt { get; set; }
    public List<Role> Roles { get; set; }
    public Guid? CurrentProfileId { get; set; }
    public Guid? DefaultProfileId { get; set; }
    public bool IsDeleted { get; set; }

}
