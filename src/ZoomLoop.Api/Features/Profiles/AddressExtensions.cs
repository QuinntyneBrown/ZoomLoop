// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using ZoomLoop.Core.Models;

namespace ZoomLoop.Api.Features.Profiles;

public static class AddressExtensions
{
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
}
