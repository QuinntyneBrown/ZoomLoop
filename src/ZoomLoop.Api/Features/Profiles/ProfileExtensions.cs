// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using ZoomLoop.Core.Models;

namespace ZoomLoop.Api.Features.Profiles;

public static class ProfileExtensions
{
    public static ProfileDto ToDto(this Profile profile)
    {
        return new ProfileDto
        {
            ProfileId = profile.ProfileId,
            ProfileImageUrl = profile.ProfileImageUrl,
            FirstName = profile.FirstName,
            LastName = profile.LastName,
            PhoneNumber = profile.PhoneNumber,
            DateOfBirth = profile.DateOfBirth,
            HomeAddress = profile.HomeAddress.ToDto()
        };
    }

    public static AddressDto ToDto(this Address address)
    {
        return new AddressDto
        {
            Address1 = address.Address1,
            Address2 = address.Address2,
            City = address.City,
            Province = address.Province,
            PostalCode = address.PostalCode
        };
    }

    public static void UpdateFromDto(this Profile profile, ProfileDto dto)
    {
        ArgumentNullException.ThrowIfNull(dto.HomeAddress);
        
        profile.ProfileImageUrl = dto.ProfileImageUrl;
        profile.FirstName = dto.FirstName;
        profile.LastName = dto.LastName;
        profile.PhoneNumber = dto.PhoneNumber;
        profile.DateOfBirth = dto.DateOfBirth;
        profile.HomeAddress.Address1 = dto.HomeAddress.Address1;
        profile.HomeAddress.Address2 = dto.HomeAddress.Address2;
        profile.HomeAddress.City = dto.HomeAddress.City;
        profile.HomeAddress.Province = dto.HomeAddress.Province;
        profile.HomeAddress.PostalCode = dto.HomeAddress.PostalCode;
    }
}
