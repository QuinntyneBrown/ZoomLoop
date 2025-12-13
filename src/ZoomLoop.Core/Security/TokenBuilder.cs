// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace ZoomLoop.Core.Security;

public interface ITokenBuilder
{
    TokenBuilder AddOrUpdateClaim(Claim claim);
    TokenBuilder AddClaim(Claim claim);
    TokenBuilder AddUsername(string username);
    string Build();
    TokenBuilder FromClaimsPrincipal(ClaimsPrincipal claimsPrincipal);
    TokenBuilder RemoveClaim(Claim claim);
}

public class TokenBuilder : ITokenBuilder
{
    private readonly ITokenProvider _tokenProvider;
    private string _username;
    private List<Claim> _claims = new List<Claim>();

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
        _username = claimsPrincipal.Identity?.Name;
        if (string.IsNullOrEmpty(_username))
        {
            _username = claimsPrincipal.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")?.Value;
        }
        _claims = claimsPrincipal.Claims.ToList();
        return this;
    }

    public TokenBuilder RemoveClaim(Claim claim)
    {
        _claims.Remove(_claims.SingleOrDefault(x => x.Type == claim.Type));
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
