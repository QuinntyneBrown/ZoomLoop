// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Vehicle,
  SearchFilters,
  SearchResult,
  SearchVehiclesRequest,
  SearchVehiclesResponse,
  VehicleSearchResultDto
} from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getVehicles(): Observable<Vehicle[]> {
    return this.searchVehicles({}, 1, 100).pipe(
      map(result => result.vehicles)
    );
  }

  getVehicleById(id: string): Observable<Vehicle | undefined> {
    return this.http.get<{ vehicle: VehicleSearchResultDto }>(`${this.apiUrl}/api/vehicle/${id}`).pipe(
      map(response => response.vehicle ? this.mapToVehicle(response.vehicle) : undefined),
      catchError(() => of(undefined))
    );
  }

  searchVehicles(filters: SearchFilters, page = 1, pageSize = 12): Observable<SearchResult> {
    const request: SearchVehiclesRequest = {
      filters: this.mapToApiFilters(filters),
      page,
      pageSize
    };

    return this.http.post<SearchVehiclesResponse>(`${this.apiUrl}/api/vehicle/search`, request).pipe(
      map(response => ({
        vehicles: response.items.map(item => this.mapToVehicle(item)),
        total: response.total,
        page: response.page,
        pageSize: response.pageSize
      })),
      catchError(error => {
        console.error('Search vehicles API error:', error);
        return of({ vehicles: [], total: 0, page, pageSize });
      })
    );
  }

  getFeaturedVehicles(): Observable<Vehicle[]> {
    const request: SearchVehiclesRequest = {
      filters: { isNewest: true },
      page: 1,
      pageSize: 8
    };

    return this.http.post<SearchVehiclesResponse>(`${this.apiUrl}/api/vehicle/search`, request).pipe(
      map(response => response.items.map(item => this.mapToVehicle(item))),
      catchError(error => {
        console.error('Featured vehicles API error:', error);
        return of([]);
      })
    );
  }

  private mapToApiFilters(filters: SearchFilters) {
    return {
      makes: filters.makes,
      price: (filters.minPrice != null || filters.maxPrice != null)
        ? { min: filters.minPrice, max: filters.maxPrice }
        : undefined,
      year: (filters.minYear != null || filters.maxYear != null)
        ? { min: filters.minYear, max: filters.maxYear }
        : undefined
    };
  }

  private mapToVehicle(dto: VehicleSearchResultDto): Vehicle {
    return {
      id: dto.vehicleId,
      title: `${dto.year} ${dto.make} ${dto.model}${dto.trim ? ' ' + dto.trim : ''}`,
      year: dto.year,
      make: dto.make,
      model: dto.model,
      trim: dto.trim,
      price: dto.price ?? 0,
      monthlyPayment: dto.price ? Math.round(dto.price / 72) : undefined,
      mileage: dto.mileage,
      exteriorColor: dto.exteriorColor,
      interiorColor: dto.interiorColor,
      transmission: dto.transmission?.toLowerCase() as 'automatic' | 'manual' ?? 'automatic',
      drivetrain: 'FWD',
      fuelType: 'gasoline',
      engine: '',
      images: dto.primaryImageUrl ? [dto.primaryImageUrl] : [],
      badges: this.getBadges(dto),
      status: 'available',
      isFeatured: dto.isNew,
      isCertified: dto.isCertified,
      location: ''
    };
  }

  private getBadges(dto: VehicleSearchResultDto): string[] {
    const badges: string[] = [];
    if (dto.isCertified) badges.push('Certified');
    if (dto.isNew) badges.push('New');
    if (dto.accidentFree) badges.push('Accident Free');
    if (dto.mileage < 30000) badges.push('Low KM');
    return badges;
  }
}
