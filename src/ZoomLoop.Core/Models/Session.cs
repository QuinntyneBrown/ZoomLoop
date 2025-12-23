// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class Session
{
    public Session()
    {
        RefreshToken = string.Empty;
        Device = string.Empty;
        IpAddress = string.Empty;
        UserAgent = string.Empty;
    }

    public Guid SessionId { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string RefreshToken { get; set; }
    public string Device { get; set; }
    public string IpAddress { get; set; }
    public string UserAgent { get; set; }
    public string? Location { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime LastActiveAt { get; set; }
    public bool IsRevoked { get; set; }
}
