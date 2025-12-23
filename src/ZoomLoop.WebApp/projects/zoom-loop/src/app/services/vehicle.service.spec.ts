import { TestBed } from '@angular/core/testing';
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
    it('should return vehicles', (done) => {
      service.getVehicles().subscribe(vehicles => {
        expect(vehicles.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should return vehicles with required properties', (done) => {
      service.getVehicles().subscribe(vehicles => {
        const vehicle = vehicles[0];
        expect(vehicle.id).toBeDefined();
        expect(vehicle.title).toBeDefined();
        expect(vehicle.make).toBeDefined();
        expect(vehicle.model).toBeDefined();
        expect(vehicle.price).toBeDefined();
        done();
      });
    });
  });

  describe('getVehicleById', () => {
    it('should return a vehicle when found', (done) => {
      service.getVehicleById('1').subscribe(vehicle => {
        expect(vehicle).toBeDefined();
        expect(vehicle?.id).toBe('1');
        done();
      });
    });

    it('should return undefined when not found', (done) => {
      service.getVehicleById('nonexistent').subscribe(vehicle => {
        expect(vehicle).toBeUndefined();
        done();
      });
    });
  });

  describe('searchVehicles', () => {
    it('should return all vehicles with empty filters', (done) => {
      service.searchVehicles({}).subscribe(result => {
        expect(result.vehicles.length).toBeGreaterThan(0);
        expect(result.total).toBeGreaterThan(0);
        done();
      });
    });

    it('should filter by query', (done) => {
      service.searchVehicles({ query: 'Honda' }).subscribe(result => {
        expect(result.vehicles.every(v => v.make === 'Honda' || v.title.includes('Honda'))).toBe(true);
        done();
      });
    });

    it('should filter by makes', (done) => {
      service.searchVehicles({ makes: ['Toyota'] }).subscribe(result => {
        expect(result.vehicles.every(v => v.make === 'Toyota')).toBe(true);
        done();
      });
    });

    it('should filter by price range', (done) => {
      service.searchVehicles({ minPrice: 30000, maxPrice: 40000 }).subscribe(result => {
        expect(result.vehicles.every(v => v.price >= 30000 && v.price <= 40000)).toBe(true);
        done();
      });
    });

    it('should paginate results', (done) => {
      service.searchVehicles({}, 1, 4).subscribe(result => {
        expect(result.vehicles.length).toBeLessThanOrEqual(4);
        expect(result.page).toBe(1);
        expect(result.pageSize).toBe(4);
        done();
      });
    });
  });

  describe('getFeaturedVehicles', () => {
    it('should return featured vehicles', (done) => {
      service.getFeaturedVehicles().subscribe(vehicles => {
        expect(vehicles.every(v => v.isFeatured)).toBe(true);
        done();
      });
    });

    it('should return max 8 vehicles', (done) => {
      service.getFeaturedVehicles().subscribe(vehicles => {
        expect(vehicles.length).toBeLessThanOrEqual(8);
        done();
      });
    });
  });
});
