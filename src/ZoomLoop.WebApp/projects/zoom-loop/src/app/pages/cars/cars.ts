import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  SearchBarComponent,
  VehicleCardComponent,
  ButtonComponent,
  VehicleData
} from 'zoom-loop-components';
import { VehicleService, FavoritesService } from '../../services';
import { Vehicle, SearchFilters, SearchResult } from '../../models';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    SearchBarComponent,
    VehicleCardComponent,
    ButtonComponent
  ],
  templateUrl: './cars.html',
  styleUrl: './cars.scss'
})
export class Cars implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vehicleService = inject(VehicleService);
  private favoritesService = inject(FavoritesService);
  private destroy$ = new Subject<void>();

  vehicles: Vehicle[] = [];
  total = 0;
  page = 1;
  pageSize = 12;
  filters: SearchFilters = {};
  makes = ['Honda', 'Toyota', 'Ford', 'Hyundai', 'BMW', 'Tesla', 'Kia', 'Mazda'];

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.filters = {
        query: params['q'] || undefined,
        makes: params['make'] ? [params['make']] : undefined
      };
      this.search();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  search(): void {
    this.vehicleService.searchVehicles(this.filters, this.page, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.vehicles = result.vehicles;
        this.total = result.total;
      });
  }

  onSearch(query: string): void {
    this.filters.query = query || undefined;
    this.page = 1;
    this.updateUrl();
    this.search();
  }

  onMakeFilter(make: string): void {
    if (this.filters.makes?.includes(make)) {
      this.filters.makes = this.filters.makes.filter(m => m !== make);
      if (this.filters.makes.length === 0) {
        this.filters.makes = undefined;
      }
    } else {
      this.filters.makes = [...(this.filters.makes || []), make];
    }
    this.page = 1;
    this.search();
  }

  isMakeSelected(make: string): boolean {
    return this.filters.makes?.includes(make) || false;
  }

  clearFilters(): void {
    this.filters = {};
    this.page = 1;
    this.updateUrl();
    this.search();
  }

  onFavoriteToggle(event: { id: string }): void {
    this.favoritesService.toggle(event.id);
  }

  isFavorite(id: string): boolean {
    return this.favoritesService.isFavoriteSync(id);
  }

  toVehicleCard(v: Vehicle): VehicleData {
    return {
      id: v.id,
      title: v.title,
      year: v.year,
      make: v.make,
      model: v.model,
      trim: v.trim,
      price: v.price,
      monthlyPayment: v.monthlyPayment,
      images: v.images,
      specs: [
        { label: 'Mileage', value: `${v.mileage.toLocaleString()} km` },
        { label: 'Transmission', value: v.transmission },
        { label: 'Drivetrain', value: v.drivetrain },
        { label: 'Fuel', value: v.fuelType }
      ],
      badges: v.badges,
      status: v.status,
      isFeatured: v.isFeatured,
      isCertified: v.isCertified
    };
  }

  private updateUrl(): void {
    const queryParams: Record<string, string | undefined> = {};
    if (this.filters.query) queryParams['q'] = this.filters.query;
    if (this.filters.makes?.length === 1) queryParams['make'] = this.filters.makes[0];
    this.router.navigate([], { relativeTo: this.route, queryParams });
  }
}
