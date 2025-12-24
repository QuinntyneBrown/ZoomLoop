// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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

  appliedFilters: AppliedFilter[] = [];

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.filters = {
        query: params['q'] || undefined,
        makes: params['make'] ? [params['make']] : undefined
      };
      this.makeFilter.selectedValues = this.filters.makes || [];
      this.updateAppliedFilters();
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

  onFiltersChange(): void {
    this.filters.makes = this.makeFilter.selectedValues.length > 0
      ? [...this.makeFilter.selectedValues]
      : undefined;
    this.updateAppliedFilters();
    this.page = 1;
    this.search();
  }

  onFilterRemove(filter: AppliedFilter): void {
    if (filter.id === 'make') {
      this.makeFilter.selectedValues = this.makeFilter.selectedValues.filter(v => v !== filter.value);
      this.onFiltersChange();
    }
  }

  clearFilters(): void {
    this.filters = {};
    this.makeFilter.selectedValues = [];
    this.appliedFilters = [];
    this.page = 1;
    this.updateUrl();
    this.search();
  }

  private updateAppliedFilters(): void {
    this.appliedFilters = this.makeFilter.selectedValues.map(make => ({
      id: 'make',
      label: make,
      value: make
    }));
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
