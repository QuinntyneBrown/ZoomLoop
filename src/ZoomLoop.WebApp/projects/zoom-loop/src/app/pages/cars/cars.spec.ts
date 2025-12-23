import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
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

  it('should search on init', () => {
    component.ngOnInit();
    expect(vehicleServiceSpy.searchVehicles).toHaveBeenCalled();
  });

  it('should update filters on search', () => {
    component.onSearch('Honda');
    expect(component.filters.query).toBe('Honda');
    expect(component.page).toBe(1);
  });

  it('should toggle make filter via filter change', () => {
    component.makeFilter.selectedValues = ['Honda'];
    component.onFiltersChange();
    expect(component.filters.makes).toContain('Honda');

    component.makeFilter.selectedValues = [];
    component.onFiltersChange();
    expect(component.filters.makes).toBeUndefined();
  });

  it('should clear filters', () => {
    component.filters = { query: 'test', makes: ['Honda'] };
    component.makeFilter.selectedValues = ['Honda'];
    component.clearFilters();
    expect(component.filters.query).toBeUndefined();
    expect(component.filters.makes).toBeUndefined();
    expect(component.makeFilter.selectedValues).toEqual([]);
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
