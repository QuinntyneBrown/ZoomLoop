// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Collections.Generic;
using System.Security.Claims;

namespace ZoomLoop.Core.Services.Security;

public interface ITokenProvider
{
    string Get(string uniqueName, IEnumerable<Claim>? customClaims = null);
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    string GenerateRefreshToken();
}
