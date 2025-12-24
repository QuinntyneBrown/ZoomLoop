// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VehicleService } from './vehicle.service';
import { SearchVehiclesResponse, VehicleSearchResultDto } from '../models';

const mockVehicleData: VehicleSearchResultDto[] = [
  {
    vehicleId: '1',
    vin: 'ABC123',
    stockNumber: 'STK001',
    make: 'Honda',
    model: 'Civic',
    year: 2022,
    trim: 'Touring',
    mileage: 24500,
    exteriorColor: 'Sonic Gray',
    interiorColor: 'Black',
    transmission: 'automatic',
    doors: 4,
    price: 28995,
    isNew: false,
    isCertified: true,
    accidentFree: true,
    primaryImageUrl: 'https://example.com/image1.jpg',
    listedDate: '2024-01-15T00:00:00Z'
  },
  {
    vehicleId: '2',
    vin: 'DEF456',
    stockNumber: 'STK002',
    make: 'Toyota',
    model: 'RAV4',
    year: 2023,
    trim: 'XLE',
    mileage: 15200,
    exteriorColor: 'Magnetic Gray',
    interiorColor: 'Black',
    transmission: 'automatic',
    doors: 4,
    price: 36995,
    isNew: true,
    isCertified: true,
    accidentFree: true,
    primaryImageUrl: 'https://example.com/image2.jpg',
    listedDate: '2024-01-10T00:00:00Z'
  },
  {
    vehicleId: '3',
    vin: 'GHI789',
    stockNumber: 'STK003',
    make: 'Ford',
    model: 'F-150',
    year: 2021,
    trim: 'XLT',
    mileage: 45000,
    exteriorColor: 'Agate Black',
    interiorColor: 'Gray',
    transmission: 'automatic',
    doors: 4,
    price: 42995,
    isNew: false,
    isCertified: true,
    accidentFree: false,
    primaryImageUrl: 'https://example.com/image3.jpg',
    listedDate: '2024-01-05T00:00:00Z'
  }
];

describe('VehicleService', () => {
  let service: VehicleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(VehicleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getVehicles', () => {
    it('should return vehicles', async () => {
      const vehiclesPromise = firstValueFrom(service.getVehicles());

      const req = httpMock.expectOne('https://localhost:7217/api/vehicle/search');
      expect(req.request.method).toBe('POST');
      req.flush({
        items: mockVehicleData,
        total: mockVehicleData.length,
        page: 1,
        pageSize: 100
      } as SearchVehiclesResponse);

      const vehicles = await vehiclesPromise;
      expect(vehicles.length).toBe(3);
    });

    it('should return vehicles with required properties', async () => {
      const vehiclesPromise = firstValueFrom(service.getVehicles());

      const req = httpMock.expectOne('https://localhost:7217/api/vehicle/search');
      req.flush({
        items: mockVehicleData,
        total: mockVehicleData.length,
        page: 1,
        pageSize: 100
      } as SearchVehiclesResponse);

      const vehicles = await vehiclesPromise;
      const vehicle = vehicles[0];
      expect(vehicle.id).toBeDefined();
      expect(vehicle.title).toBeDefined();
      expect(vehicle.make).toBeDefined();
      expect(vehicle.model).toBeDefined();
      expect(vehicle.price).toBeDefined();
    });
  });

  describe('getVehicleById', () => {
    it('should return a vehicle when found', async () => {
      const vehiclePromise = firstValueFrom(service.getVehicleById('1'));

      const req = httpMock.expectOne('https://localhost:7217/api/vehicle/1');
      expect(req.request.method).toBe('GET');
      req.flush({ vehicle: mockVehicleData[0] });

      const vehicle = await vehiclePromise;
      expect(vehicle).toBeDefined();
      expect(vehicle?.id).toBe('1');
    });

    it('should return undefined when not found', async () => {
      const vehiclePromise = firstValueFrom(service.getVehicleById('nonexistent'));

      const req = httpMock.expectOne('https://localhost:7217/api/vehicle/nonexistent');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });

      const vehicle = await vehiclePromise;
      expect(vehicle).toBeUndefined();
    });
  });

  describe('searchVehicles', () => {
    it('should return all vehicles with empty filters', async () => {
      const resultPromise = firstValueFrom(service.searchVehicles({}));

      const req = httpMock.expectOne('https://localhost:7217/api/vehicle/search');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        filters: {},
        page: 1,
        pageSize: 12
      });
      req.flush({
        items: mockVehicleData,
        total: mockVehicleData.length,
        page: 1,
        pageSize: 12
      } as SearchVehiclesResponse);

      const result = await resultPromise;
      expect(result.vehicles.length).toBe(3);
      expect(result.total).toBe(3);
    });

    it('should filter by makes', async () => {
      const resultPromise = firstValueFrom(service.searchVehicles({ makes: ['Toyota'] }));

      const req = httpMock.expectOne('https://localhost:7217/api/vehicle/search');
      expect(req.request.body.filters.makes).toEqual(['Toyota']);
      req.flush({
        items: [mockVehicleData[1]],
        total: 1,
        page: 1,
        pageSize: 12
      } as SearchVehiclesResponse);

      const result = await resultPromise;
      expect(result.vehicles.every(v => v.make === 'Toyota')).toBe(true);
    });

    it('should filter by price range', async () => {
      const resultPromise = firstValueFrom(service.searchVehicles({ minPrice: 30000, maxPrice: 40000 }));

      const req = httpMock.expectOne('https://localhost:7217/api/vehicle/search');
      expect(req.request.body.filters.price).toEqual({ min: 30000, max: 40000 });

      const filteredData = mockVehicleData.filter(v => v.price! >= 30000 && v.price! <= 40000);
      req.flush({
        items: filteredData,
        total: filteredData.length,
        page: 1,
        pageSize: 12
      } as SearchVehiclesResponse);

      const result = await resultPromise;
      expect(result.vehicles.every(v => v.price >= 30000 && v.price <= 40000)).toBe(true);
    });

    it('should paginate results', async () => {
      const resultPromise = firstValueFrom(service.searchVehicles({}, 1, 4));

      const req = httpMock.expectOne('https://localhost:7217/api/vehicle/search');
      expect(req.request.body).toEqual({
        filters: {},
        page: 1,
        pageSize: 4
      });
      req.flush({
        items: mockVehicleData,
        total: 10,
        page: 1,
        pageSize: 4
      } as SearchVehiclesResponse);

      const result = await resultPromise;
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(4);
    });

    it('should handle API errors gracefully', async () => {
      const resultPromise = firstValueFrom(service.searchVehicles({}));

      const req = httpMock.expectOne('https://localhost:7217/api/vehicle/search');
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

      const result = await resultPromise;
      expect(result.vehicles).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('getFeaturedVehicles', () => {
    it('should return featured vehicles', async () => {
      const vehiclesPromise = firstValueFrom(service.getFeaturedVehicles());

      const req = httpMock.expectOne('https://localhost:7217/api/vehicle/search');
      expect(req.request.body.filters.isNewest).toBe(true);
      expect(req.request.body.pageSize).toBe(8);

      const featuredData = mockVehicleData.filter(v => v.isNew);
      req.flush({
        items: featuredData,
        total: featuredData.length,
        page: 1,
        pageSize: 8
      } as SearchVehiclesResponse);

      const vehicles = await vehiclesPromise;
      expect(vehicles.every(v => v.isFeatured)).toBe(true);
    });

    it('should return max 8 vehicles', async () => {
      const vehiclesPromise = firstValueFrom(service.getFeaturedVehicles());

      const req = httpMock.expectOne('https://localhost:7217/api/vehicle/search');
      req.flush({
        items: mockVehicleData,
        total: mockVehicleData.length,
        page: 1,
        pageSize: 8
      } as SearchVehiclesResponse);

      const vehicles = await vehiclesPromise;
      expect(vehicles.length).toBeLessThanOrEqual(8);
    });

    it('should handle API errors gracefully', async () => {
      const vehiclesPromise = firstValueFrom(service.getFeaturedVehicles());

      const req = httpMock.expectOne('https://localhost:7217/api/vehicle/search');
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

      const vehicles = await vehiclesPromise;
      expect(vehicles).toEqual([]);
    });
  });
});
