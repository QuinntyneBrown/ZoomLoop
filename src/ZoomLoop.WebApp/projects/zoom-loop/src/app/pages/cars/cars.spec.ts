import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Cars } from './cars';
import { VehicleService, FavoritesService } from '../../services';

describe('Cars', () => {
  let component: Cars;
  let fixture: ComponentFixture<Cars>;
  let vehicleServiceSpy: jasmine.SpyObj<VehicleService>;
  let favoritesServiceSpy: jasmine.SpyObj<FavoritesService>;

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
    vehicleServiceSpy = jasmine.createSpyObj('VehicleService', ['searchVehicles']);
    vehicleServiceSpy.searchVehicles.and.returnValue(of(mockSearchResult));

    favoritesServiceSpy = jasmine.createSpyObj('FavoritesService', ['toggle', 'isFavoriteSync']);
    favoritesServiceSpy.isFavoriteSync.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [Cars, RouterTestingModule],
      providers: [
        { provide: VehicleService, useValue: vehicleServiceSpy },
        { provide: FavoritesService, useValue: favoritesServiceSpy },
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

  it('should toggle make filter', () => {
    component.onMakeFilter('Honda');
    expect(component.filters.makes).toContain('Honda');

    component.onMakeFilter('Honda');
    expect(component.filters.makes).not.toContain('Honda');
  });

  it('should clear filters', () => {
    component.filters = { query: 'test', makes: ['Honda'] };
    component.clearFilters();
    expect(component.filters.query).toBeUndefined();
    expect(component.filters.makes).toBeUndefined();
  });

  it('should check make selection', () => {
    component.filters.makes = ['Honda'];
    expect(component.isMakeSelected('Honda')).toBe(true);
    expect(component.isMakeSelected('Toyota')).toBe(false);
  });

  it('should toggle favorite', () => {
    component.onFavoriteToggle({ id: '1' });
    expect(favoritesServiceSpy.toggle).toHaveBeenCalledWith('1');
  });
});
