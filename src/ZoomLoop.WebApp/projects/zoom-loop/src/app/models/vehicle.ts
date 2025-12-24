// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export interface Vehicle {
  id: string;
  title: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  price: number;
  monthlyPayment?: number;
  mileage: number;
  exteriorColor: string;
  interiorColor: string;
  transmission: 'automatic' | 'manual';
  drivetrain: 'FWD' | 'RWD' | 'AWD' | '4WD';
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  engine: string;
  images: string[];
  badges: string[];
  status: 'available' | 'reserved' | 'sold';
  isFeatured: boolean;
  isCertified: boolean;
  location: string;
}

export interface SearchFilters {
  query?: string;
  makes?: string[];
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
}

export interface SearchResult {
  vehicles: Vehicle[];
  total: number;
  page: number;
  pageSize: number;
}
