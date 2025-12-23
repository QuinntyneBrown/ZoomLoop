import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Home } from './home';
import { VehicleService, FavoritesService } from '../../services';
import { of } from 'rxjs';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let vehicleServiceSpy: jasmine.SpyObj<VehicleService>;
  let favoritesServiceSpy: jasmine.SpyObj<FavoritesService>;

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
    vehicleServiceSpy = jasmine.createSpyObj('VehicleService', ['getFeaturedVehicles']);
    vehicleServiceSpy.getFeaturedVehicles.and.returnValue(of(mockVehicles));

    favoritesServiceSpy = jasmine.createSpyObj('FavoritesService', ['toggle', 'isFavoriteSync']);
    favoritesServiceSpy.isFavoriteSync.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [Home, RouterTestingModule],
      providers: [
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
