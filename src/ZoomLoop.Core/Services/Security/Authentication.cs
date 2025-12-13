// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Services.Security;

public class Authentication
{
    public string TokenPath { get; set; }
    public int ExpirationMinutes { get; set; }
    public string JwtKey { get; set; }
    public string JwtIssuer { get; set; }
    public string JwtAudience { get; set; }
    public string AuthType { get; set; }
}
