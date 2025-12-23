import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vehicle, SearchFilters, SearchResult } from '../models';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private vehicles$ = new BehaviorSubject<Vehicle[]>(this.getMockVehicles());

  getVehicles(): Observable<Vehicle[]> {
    return this.vehicles$.asObservable();
  }

  getVehicleById(id: string): Observable<Vehicle | undefined> {
    return this.vehicles$.pipe(
      map(vehicles => vehicles.find(v => v.id === id))
    );
  }

  searchVehicles(filters: SearchFilters, page = 1, pageSize = 12): Observable<SearchResult> {
    return this.vehicles$.pipe(
      map(vehicles => {
        let results = [...vehicles];

        if (filters.query) {
          const q = filters.query.toLowerCase();
          results = results.filter(v =>
            v.title.toLowerCase().includes(q) ||
            v.make.toLowerCase().includes(q) ||
            v.model.toLowerCase().includes(q)
          );
        }

        if (filters.makes?.length) {
          results = results.filter(v => filters.makes!.includes(v.make));
        }

        if (filters.minPrice != null) {
          results = results.filter(v => v.price >= filters.minPrice!);
        }

        if (filters.maxPrice != null) {
          results = results.filter(v => v.price <= filters.maxPrice!);
        }

        const total = results.length;
        const start = (page - 1) * pageSize;
        const paged = results.slice(start, start + pageSize);

        return { vehicles: paged, total, page, pageSize };
      })
    );
  }

  getFeaturedVehicles(): Observable<Vehicle[]> {
    return this.vehicles$.pipe(
      map(vehicles => vehicles.filter(v => v.isFeatured).slice(0, 8))
    );
  }

  private getMockVehicles(): Vehicle[] {
    return [
      {
        id: '1',
        title: '2022 Honda Civic Touring',
        year: 2022,
        make: 'Honda',
        model: 'Civic',
        trim: 'Touring',
        price: 28995,
        monthlyPayment: 389,
        mileage: 24500,
        exteriorColor: 'Sonic Gray',
        interiorColor: 'Black',
        transmission: 'automatic',
        drivetrain: 'FWD',
        fuelType: 'gasoline',
        engine: '1.5L Turbo',
        images: ['https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800'],
        badges: ['Certified', 'Low KM'],
        status: 'available',
        isFeatured: true,
        isCertified: true,
        location: 'Mississauga, ON'
      },
      {
        id: '2',
        title: '2023 Toyota RAV4 XLE',
        year: 2023,
        make: 'Toyota',
        model: 'RAV4',
        trim: 'XLE',
        price: 36995,
        monthlyPayment: 498,
        mileage: 15200,
        exteriorColor: 'Magnetic Gray',
        interiorColor: 'Black',
        transmission: 'automatic',
        drivetrain: 'AWD',
        fuelType: 'gasoline',
        engine: '2.5L 4-Cyl',
        images: ['https://images.unsplash.com/photo-1568844293986-8c37f5e9a9f0?w=800'],
        badges: ['Low KM'],
        status: 'available',
        isFeatured: true,
        isCertified: true,
        location: 'Toronto, ON'
      },
      {
        id: '3',
        title: '2021 Ford F-150 XLT',
        year: 2021,
        make: 'Ford',
        model: 'F-150',
        trim: 'XLT',
        price: 42995,
        monthlyPayment: 578,
        mileage: 45000,
        exteriorColor: 'Agate Black',
        interiorColor: 'Gray',
        transmission: 'automatic',
        drivetrain: '4WD',
        fuelType: 'gasoline',
        engine: '3.5L V6 EcoBoost',
        images: ['https://images.unsplash.com/photo-1605410109664-0e55de912496?w=800'],
        badges: ['Certified'],
        status: 'available',
        isFeatured: true,
        isCertified: true,
        location: 'Halifax, NS'
      },
      {
        id: '4',
        title: '2022 Hyundai Tucson Preferred',
        year: 2022,
        make: 'Hyundai',
        model: 'Tucson',
        trim: 'Preferred',
        price: 31495,
        monthlyPayment: 425,
        mileage: 28900,
        exteriorColor: 'Amazon Gray',
        interiorColor: 'Black',
        transmission: 'automatic',
        drivetrain: 'AWD',
        fuelType: 'gasoline',
        engine: '2.5L 4-Cyl',
        images: ['https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800'],
        badges: [],
        status: 'available',
        isFeatured: false,
        isCertified: true,
        location: 'Mississauga, ON'
      },
      {
        id: '5',
        title: '2023 Tesla Model 3 Long Range',
        year: 2023,
        make: 'Tesla',
        model: 'Model 3',
        trim: 'Long Range',
        price: 52995,
        monthlyPayment: 715,
        mileage: 12000,
        exteriorColor: 'Pearl White',
        interiorColor: 'Black',
        transmission: 'automatic',
        drivetrain: 'AWD',
        fuelType: 'electric',
        engine: 'Dual Motor',
        images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800'],
        badges: ['Electric', 'Low KM'],
        status: 'available',
        isFeatured: true,
        isCertified: true,
        location: 'Vancouver, BC'
      },
      {
        id: '6',
        title: '2020 Mazda CX-5 GT',
        year: 2020,
        make: 'Mazda',
        model: 'CX-5',
        trim: 'GT',
        price: 27995,
        monthlyPayment: 375,
        mileage: 52000,
        exteriorColor: 'Soul Red',
        interiorColor: 'Parchment',
        transmission: 'automatic',
        drivetrain: 'AWD',
        fuelType: 'gasoline',
        engine: '2.5L Turbo',
        images: ['https://images.unsplash.com/photo-1551830820-330a71b99659?w=800'],
        badges: ['Certified'],
        status: 'available',
        isFeatured: false,
        isCertified: true,
        location: 'Etobicoke, ON'
      },
      {
        id: '7',
        title: '2022 BMW X3 xDrive30i',
        year: 2022,
        make: 'BMW',
        model: 'X3',
        trim: 'xDrive30i',
        price: 48995,
        monthlyPayment: 659,
        mileage: 22000,
        exteriorColor: 'Alpine White',
        interiorColor: 'Black',
        transmission: 'automatic',
        drivetrain: 'AWD',
        fuelType: 'gasoline',
        engine: '2.0L Turbo',
        images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'],
        badges: ['Premium', 'Low KM'],
        status: 'available',
        isFeatured: true,
        isCertified: true,
        location: 'Toronto, ON'
      },
      {
        id: '8',
        title: '2023 Kia Sportage SX',
        year: 2023,
        make: 'Kia',
        model: 'Sportage',
        trim: 'SX',
        price: 38995,
        monthlyPayment: 525,
        mileage: 8500,
        exteriorColor: 'Gravity Gray',
        interiorColor: 'Black',
        transmission: 'automatic',
        drivetrain: 'AWD',
        fuelType: 'gasoline',
        engine: '2.5L Turbo',
        images: ['https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800'],
        badges: ['Nearly New', 'Low KM'],
        status: 'available',
        isFeatured: true,
        isCertified: true,
        location: 'Toronto, ON'
      }
    ];
  }
}
