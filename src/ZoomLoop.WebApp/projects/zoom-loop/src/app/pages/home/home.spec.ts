import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { Home } from './home';
import { VehicleService, FavoritesService } from '../../services';
import { of } from 'rxjs';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let vehicleServiceSpy: { getFeaturedVehicles: Mock };
  let favoritesServiceSpy: { toggle: Mock; isFavoriteSync: Mock };

  const mockVehicles = [
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
  ];

  beforeEach(async () => {
    vehicleServiceSpy = {
      getFeaturedVehicles: vi.fn().mockReturnValue(of(mockVehicles))
    };

    favoritesServiceSpy = {
      toggle: vi.fn(),
      isFavoriteSync: vi.fn().mockReturnValue(false)
    };

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideRouter([]),
        { provide: VehicleService, useValue: vehicleServiceSpy },
        { provide: FavoritesService, useValue: favoritesServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load featured vehicles on init', () => {
    component.ngOnInit();
    expect(vehicleServiceSpy.getFeaturedVehicles).toHaveBeenCalled();
  });

  it('should have popular makes', () => {
    expect(component.popularMakes.length).toBeGreaterThan(0);
    expect(component.popularMakes).toContain('Honda');
  });

  it('should toggle favorite', () => {
    component.onFavoriteToggle({ id: '1' });
    expect(favoritesServiceSpy.toggle).toHaveBeenCalledWith('1');
  });

  it('should check if favorite', () => {
    component.isFavorite('1');
    expect(favoritesServiceSpy.isFavoriteSync).toHaveBeenCalledWith('1');
  });

  it('should convert vehicle to VehicleData', () => {
    const result = component.toVehicleCard(mockVehicles[0]);
    expect(result.id).toBe('1');
    expect(result.title).toBe('2022 Honda Civic');
    expect(result.price).toBe(25000);
    expect(result.specs.length).toBe(4);
  });
});
