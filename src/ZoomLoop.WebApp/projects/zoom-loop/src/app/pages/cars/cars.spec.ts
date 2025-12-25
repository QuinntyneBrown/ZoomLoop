// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, firstValueFrom } from 'rxjs';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { Cars } from './cars';
import { VehicleService, FavoritesService } from '../../services';

describe('Cars', () => {
  let component: Cars;
  let fixture: ComponentFixture<Cars>;
  let vehicleServiceSpy: { searchVehicles: Mock };
  let favoritesServiceSpy: { toggle: Mock; isFavoriteSync: Mock };
  let routerSpy: { navigate: Mock };

  const mockSearchResult = {
    vehicles: [
      {
        id: '1',
        title: '2022 Honda Civic',
        year: 2022,
        make: 'Honda',
        model: 'Civic',
        price: 25000,
        mileage: 20000,
        exteriorColor: 'Gray',
        interiorColor: 'Black',
        transmission: 'automatic' as const,
        drivetrain: 'FWD' as const,
        fuelType: 'gasoline' as const,
        engine: '1.5L Turbo',
        images: ['image.jpg'],
        badges: ['Certified'],
        status: 'available' as const,
        isFeatured: true,
        isCertified: true,
        location: 'Toronto'
      }
    ],
    total: 1,
    page: 1,
    pageSize: 12
  };

  beforeEach(async () => {
    vehicleServiceSpy = {
      searchVehicles: vi.fn().mockReturnValue(of(mockSearchResult))
    };

    favoritesServiceSpy = {
      toggle: vi.fn(),
      isFavoriteSync: vi.fn().mockReturnValue(false)
    };

    routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Cars],
      providers: [
        { provide: VehicleService, useValue: vehicleServiceSpy },
        { provide: FavoritesService, useValue: favoritesServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({}) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Cars);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search on subscription to vm$', async () => {
    await firstValueFrom(component.vm$);
    expect(vehicleServiceSpy.searchVehicles).toHaveBeenCalled();
  });

  it('should return vehicles via vm$ observable', async () => {
    const result = await firstValueFrom(component.vm$);
    expect(result.vehicles).toEqual(mockSearchResult.vehicles);
    expect(result.total).toBe(1);
  });

  it('should trigger search on onSearch', async () => {
    component.onSearch('Honda');
    await firstValueFrom(component.vm$);
    expect(vehicleServiceSpy.searchVehicles).toHaveBeenCalled();
  });

  it('should toggle make filter via filter change', async () => {
    component.makeFilter.selectedValues = ['Honda'];
    component.onFiltersChange();
    await firstValueFrom(component.vm$);
    expect(vehicleServiceSpy.searchVehicles).toHaveBeenCalled();
  });

  it('should clear filters', async () => {
    component.makeFilter.selectedValues = ['Honda'];
    component.clearFilters();
    expect(component.makeFilter.selectedValues).toEqual([]);
    await firstValueFrom(component.vm$);
    expect(vehicleServiceSpy.searchVehicles).toHaveBeenCalled();
  });

  it('should toggle favorite', () => {
    component.onFavoriteToggle({ id: '1' });
    expect(favoritesServiceSpy.toggle).toHaveBeenCalledWith('1');
  });

  it('should check if vehicle is favorite', () => {
    favoritesServiceSpy.isFavoriteSync.mockReturnValue(true);
    expect(component.isFavorite('1')).toBe(true);
    expect(favoritesServiceSpy.isFavoriteSync).toHaveBeenCalledWith('1');
  });
});
