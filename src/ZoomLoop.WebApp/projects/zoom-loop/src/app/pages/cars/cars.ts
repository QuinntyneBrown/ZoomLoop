// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay, switchMap, startWith } from 'rxjs/operators';
import {
  SearchBarComponent,
  VehicleCardComponent,
  ButtonComponent,
  VehicleData,
  FilterSidebarComponent,
  CheckboxFilter,
  AppliedFilter
} from 'zoom-loop-components';
import { VehicleService, FavoritesService } from '../../services';
import { Vehicle, SearchFilters, SearchResult } from '../../models';

interface CarsViewModel {
  vehicles: Vehicle[];
  total: number;
  appliedFilters: AppliedFilter[];
}

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchBarComponent,
    VehicleCardComponent,
    ButtonComponent,
    FilterSidebarComponent
  ],
  templateUrl: './cars.html',
  styleUrl: './cars.scss'
})
export class Cars {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vehicleService = inject(VehicleService);
  private favoritesService = inject(FavoritesService);

  private pageSize = 12;
  private searchTrigger$ = new BehaviorSubject<{ filters: SearchFilters; page: number }>({
    filters: {},
    page: 1
  });

  makeFilter: CheckboxFilter = {
    id: 'make',
    label: 'Make',
    options: [
      { value: 'Honda', label: 'Honda' },
      { value: 'Toyota', label: 'Toyota' },
      { value: 'Ford', label: 'Ford' },
      { value: 'Hyundai', label: 'Hyundai' },
      { value: 'BMW', label: 'BMW' },
      { value: 'Tesla', label: 'Tesla' },
      { value: 'Kia', label: 'Kia' },
      { value: 'Mazda', label: 'Mazda' }
    ],
    selectedValues: [],
    maxVisible: 5
  };

  private routeParams$ = this.route.queryParams.pipe(
    map(params => {
      const filters: SearchFilters = {
        query: params['q'] || undefined,
        makes: params['make'] ? [params['make']] : undefined
      };
      this.makeFilter.selectedValues = filters.makes || [];
      return { filters, page: 1 };
    })
  );

  private searchParams$ = combineLatest([
    this.routeParams$,
    this.searchTrigger$.pipe(startWith(null))
  ]).pipe(
    map(([routeParams, triggerParams]) => triggerParams || routeParams)
  );

  vm$: Observable<CarsViewModel> = this.searchParams$.pipe(
    switchMap(({ filters, page }) =>
      this.vehicleService.searchVehicles(filters, page, this.pageSize).pipe(
        map(result => this.createViewModel(result, filters))
      )
    ),
    shareReplay(1)
  );

  private createViewModel(result: SearchResult, filters: SearchFilters): CarsViewModel {
    return {
      vehicles: result.vehicles,
      total: result.total,
      appliedFilters: this.getAppliedFilters(filters)
    };
  }

  private getAppliedFilters(filters: SearchFilters): AppliedFilter[] {
    const applied: AppliedFilter[] = [];
    if (filters.makes) {
      filters.makes.forEach(make => {
        applied.push({ id: 'make', label: make, value: make });
      });
    }
    return applied;
  }

  onSearch(query: string): void {
    const currentSearch = this.searchTrigger$.getValue();
    const newFilters = { ...currentSearch.filters, query: query || undefined };
    this.updateUrl(newFilters);
    this.searchTrigger$.next({ filters: newFilters, page: 1 });
  }

  onFiltersChange(): void {
    const currentSearch = this.searchTrigger$.getValue();
    const newFilters = {
      ...currentSearch.filters,
      makes: this.makeFilter.selectedValues.length > 0
        ? [...this.makeFilter.selectedValues]
        : undefined
    };
    this.searchTrigger$.next({ filters: newFilters, page: 1 });
  }

  onFilterRemove(filter: AppliedFilter): void {
    if (filter.id === 'make') {
      this.makeFilter.selectedValues = this.makeFilter.selectedValues.filter(v => v !== filter.value);
      this.onFiltersChange();
    }
  }

  clearFilters(): void {
    this.makeFilter.selectedValues = [];
    this.updateUrl({});
    this.searchTrigger$.next({ filters: {}, page: 1 });
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

  private updateUrl(filters: SearchFilters): void {
    const queryParams: Record<string, string | undefined> = {};
    if (filters.query) queryParams['q'] = filters.query;
    if (filters.makes?.length === 1) queryParams['make'] = filters.makes[0];
    this.router.navigate([], { relativeTo: this.route, queryParams });
  }
}
