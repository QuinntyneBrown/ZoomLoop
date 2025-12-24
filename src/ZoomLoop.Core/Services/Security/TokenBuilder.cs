// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace ZoomLoop.Core.Services.Security;

public class TokenBuilder : ITokenBuilder
{
    private readonly ITokenProvider _tokenProvider;
    private string _username = string.Empty;
    private List<Claim> _claims = [];

    public TokenBuilder(ITokenProvider tokenProvider)
    {
        _tokenProvider = tokenProvider;
    }

    public TokenBuilder AddUsername(string username)
    {
        _username = username;
        return this;
    }

    public TokenBuilder FromClaimsPrincipal(ClaimsPrincipal claimsPrincipal)
    {
        _username = claimsPrincipal.Identity?.Name ?? string.Empty;
        if (string.IsNullOrEmpty(_username))
        {
            _username = claimsPrincipal.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")?.Value ?? string.Empty;
        }

        _claims = claimsPrincipal.Claims.ToList();
        return this;
    }

    public TokenBuilder RemoveClaim(Claim claim)
    {
        var existingClaim = _claims.SingleOrDefault(x => x.Type == claim.Type);
        if (existingClaim != null)
        {
            _claims.Remove(existingClaim);
        }

        return this;
    }

    public TokenBuilder AddClaim(Claim claim)
    {
        _claims.Add(claim);
        return this;
    }

    public TokenBuilder AddOrUpdateClaim(Claim claim)
    {
        RemoveClaim(claim);
        _claims.Add(claim);
        return this;
    }

    public string Build()
    {
        return _tokenProvider.Get(_username, _claims);
    }
}
