// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';
import { VehicleService } from './vehicle.service';

describe('VehicleService', () => {
  let service: VehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getVehicles', () => {
    it('should return vehicles', async () => {
      const vehicles = await firstValueFrom(service.getVehicles());
      expect(vehicles.length).toBeGreaterThan(0);
    });

    it('should return vehicles with required properties', async () => {
      const vehicles = await firstValueFrom(service.getVehicles());
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
      const vehicle = await firstValueFrom(service.getVehicleById('1'));
      expect(vehicle).toBeDefined();
      expect(vehicle?.id).toBe('1');
    });

    it('should return undefined when not found', async () => {
      const vehicle = await firstValueFrom(service.getVehicleById('nonexistent'));
      expect(vehicle).toBeUndefined();
    });
  });

  describe('searchVehicles', () => {
    it('should return all vehicles with empty filters', async () => {
      const result = await firstValueFrom(service.searchVehicles({}));
      expect(result.vehicles.length).toBeGreaterThan(0);
      expect(result.total).toBeGreaterThan(0);
    });

    it('should filter by query', async () => {
      const result = await firstValueFrom(service.searchVehicles({ query: 'Honda' }));
      expect(result.vehicles.every(v => v.make === 'Honda' || v.title.includes('Honda'))).toBe(true);
    });

    it('should filter by makes', async () => {
      const result = await firstValueFrom(service.searchVehicles({ makes: ['Toyota'] }));
      expect(result.vehicles.every(v => v.make === 'Toyota')).toBe(true);
    });

    it('should filter by price range', async () => {
      const result = await firstValueFrom(service.searchVehicles({ minPrice: 30000, maxPrice: 40000 }));
      expect(result.vehicles.every(v => v.price >= 30000 && v.price <= 40000)).toBe(true);
    });

    it('should paginate results', async () => {
      const result = await firstValueFrom(service.searchVehicles({}, 1, 4));
      expect(result.vehicles.length).toBeLessThanOrEqual(4);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(4);
    });
  });

  describe('getFeaturedVehicles', () => {
    it('should return featured vehicles', async () => {
      const vehicles = await firstValueFrom(service.getFeaturedVehicles());
      expect(vehicles.every(v => v.isFeatured)).toBe(true);
    });

    it('should return max 8 vehicles', async () => {
      const vehicles = await firstValueFrom(service.getFeaturedVehicles());
      expect(vehicles.length).toBeLessThanOrEqual(8);
    });
  });
});
