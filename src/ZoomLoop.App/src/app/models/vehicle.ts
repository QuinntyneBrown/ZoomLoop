// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export interface Vehicle {
  vehicleId?: string;
  vin: string;
  stockNumber: string;
  makeId?: string;
  vehicleModelId?: string;
  year: number;
  trim: string;
  mileage: number;
  exteriorColor: string;
  interiorColor: string;
  transmission: string;
  fuelType: string;
  driveType: string;
  bodyType: string;
  doors: number;
  seats: number;
  engineSize?: number;
  cylinders?: number;
  horsepower?: number;
  cityFuelConsumption?: number;
  highwayFuelConsumption?: number;
  description: string;
  isNew: boolean;
  isCertified: boolean;
  manufactureDate?: Date;
  images: VehicleImage[];
  features: VehicleFeature[];
}

export interface VehicleImage {
  vehicleImageId?: string;
  vehicleId?: string;
  imageUrl: string;
  thumbnailUrl: string;
  caption: string;
  displayOrder: number;
  isPrimary: boolean;
  createdDate: Date;
}

export interface VehicleFeature {
  vehicleFeatureId?: string;
  vehicleId?: string;
  name: string;
  category: string;
  description: string;
  isStandard: boolean;
}

export interface Make {
  makeId?: string;
  name: string;
  logoUrl: string;
  isActive: boolean;
}

export interface VehicleModel {
  vehicleModelId?: string;
  makeId?: string;
  name: string;
  description: string;
  isActive: boolean;
}
