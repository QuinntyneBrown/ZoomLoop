// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Services.Security;

public class Authentication
{
    public string TokenPath { get; set; } = string.Empty;

    public int ExpirationMinutes { get; set; }

    public string JwtKey { get; set; } = string.Empty;

    public string JwtIssuer { get; set; } = string.Empty;

    public string JwtAudience { get; set; } = string.Empty;

    public string AuthType { get; set; } = string.Empty;
}
