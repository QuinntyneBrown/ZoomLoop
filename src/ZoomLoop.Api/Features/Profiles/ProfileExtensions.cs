// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using ZoomLoop.Core.Models;

namespace ZoomLoop.Api.Features.Profiles;

public static class ProfileExtensions
{
    public static ProfileDto ToDto(this PrivateSeller privateSeller)
    {
        return new ProfileDto
        {
            ProfileId = privateSeller.PrivateSellerId,
            UserId = privateSeller.UserId,
            FirstName = privateSeller.FirstName,
            LastName = privateSeller.LastName,
            Email = privateSeller.Email,
            PhoneNumber = privateSeller.PhoneNumber,
            AddressLine1 = privateSeller.AddressLine1,
            AddressLine2 = privateSeller.AddressLine2,
            City = privateSeller.City,
            Province = privateSeller.Province,
            PostalCode = privateSeller.PostalCode,
            Country = privateSeller.Country,
            IsVerified = privateSeller.IsVerified
        };
    }
}
