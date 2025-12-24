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

// API Request/Response types matching backend
export interface PriceRange {
  min?: number;
  max?: number;
}

export interface IntRange {
  min?: number;
  max?: number;
}

export interface ApiSearchFilters {
  isNewest?: boolean;
  colors?: string[];
  interiorCondition?: string;
  exteriorCondition?: string;
  doors?: number;
  transmissions?: string[];
  price?: PriceRange;
  age?: IntRange;
  year?: IntRange;
  makes?: string[];
  models?: string[];
  accidentFree?: boolean;
  kilometers?: IntRange;
}

export interface SortCriteria {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SearchVehiclesRequest {
  filters?: ApiSearchFilters;
  sort?: SortCriteria[];
  page?: number;
  pageSize?: number;
}

export interface VehicleSearchResultDto {
  vehicleId: string;
  vin: string;
  stockNumber: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  mileage: number;
  exteriorColor: string;
  interiorColor: string;
  transmission: string;
  doors: number;
  price?: number;
  isNew: boolean;
  isCertified: boolean;
  accidentFree?: boolean;
  primaryImageUrl?: string;
  listedDate?: string;
}

export interface SearchVehiclesResponse {
  items: VehicleSearchResultDto[];
  total: number;
  page: number;
  pageSize: number;
  appliedFilters?: ApiSearchFilters;
}
