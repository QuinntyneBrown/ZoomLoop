// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export interface Address {
  address1: string;
  address2: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface Profile {
  profileId?: string;
  profileImageUrl: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
  homeAddress: Address;
}
