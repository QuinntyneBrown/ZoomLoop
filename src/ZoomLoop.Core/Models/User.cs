// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class User {

    public User()
    {
        UserName = string.Empty;
    }

    public Guid UserId { get; set; }
    public string UserName { get; set; }

}
