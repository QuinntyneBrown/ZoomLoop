// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../models';

export interface VehiclesPageResponse {
  length: number;
  entities: Vehicle[];
}

export interface SearchFilters {
  isNewest?: boolean;
  colors?: string[];
  interiorCondition?: string;
  exteriorCondition?: string;
  doors?: number;
  transmissions?: string[];
  price?: { min?: number; max?: number };
  age?: { min?: number; max?: number };
  year?: { min?: number; max?: number };
  makes?: string[];
  models?: string[];
  accidentFree?: boolean;
  kilometers?: { min?: number; max?: number };
}

export interface SortCriteria {
  field: string;
  direction: string;
}

export interface SearchVehiclesRequest {
  filters?: SearchFilters;
  sort?: SortCriteria[];
  page?: number;
  pageSize?: number;
}

export interface VehicleSearchResult {
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
  listedDate?: Date;
}

export interface SearchVehiclesResponse {
  items: VehicleSearchResult[];
  total: number;
  page: number;
  pageSize: number;
  appliedFilters?: SearchFilters;
}

export interface VehicleSuggestionsResponse {
  suggestions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private readonly _http = inject(HttpClient);

  getVehiclesPage(pageSize: number, pageIndex: number): Observable<VehiclesPageResponse> {
    return this._http.get<VehiclesPageResponse>(`/api/vehicle/page/${pageSize}/${pageIndex}`);
  }

  getVehicleById(vehicleId: string): Observable<{ vehicle: Vehicle }> {
    return this._http.get<{ vehicle: Vehicle }>(`/api/vehicle/${vehicleId}`);
  }

  createVehicle(vehicle: Vehicle): Observable<{ vehicle: Vehicle }> {
    return this._http.post<{ vehicle: Vehicle }>('/api/vehicle', { vehicle });
  }

  updateVehicle(vehicle: Vehicle): Observable<{ vehicle: Vehicle }> {
    return this._http.put<{ vehicle: Vehicle }>('/api/vehicle', { vehicle });
  }

  deleteVehicle(vehicleId: string): Observable<{ vehicleId: string }> {
    return this._http.delete<{ vehicleId: string }>(`/api/vehicle/${vehicleId}`);
  }

  ingestVehicle(images: File[]): Observable<{ vehicle: Vehicle }> {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });
    return this._http.post<{ vehicle: Vehicle }>('/api/vehicle/ingest', formData);
  }

  searchVehicles(request: SearchVehiclesRequest): Observable<SearchVehiclesResponse> {
    return this._http.post<SearchVehiclesResponse>('/api/vehicle/search', request);
  }

  getVehicleSuggestions(query: string, field: string, limit: number = 10): Observable<VehicleSuggestionsResponse> {
    return this._http.get<VehicleSuggestionsResponse>('/api/vehicle/suggestions', {
      params: { query, field, limit: limit.toString() }
    });
  }
}
