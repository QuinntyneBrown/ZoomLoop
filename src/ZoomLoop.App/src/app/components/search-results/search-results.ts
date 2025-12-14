// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Input, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VehicleCard } from '../vehicle-card';
import { VehicleService, SearchFilters, SearchVehiclesRequest, VehicleSearchResult } from '../../core/vehicle.service';

@Component({
  selector: 'zl-search-results',
  standalone: true,
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    VehicleCard
  ]
})
export class SearchResults implements OnInit {
  private readonly _vehicleService = inject(VehicleService);

  @Input() initialFilters: SearchFilters = {};
  @Input() autoSearch = true;

  results = signal<VehicleSearchResult[]>([]);
  filteredResults = computed(() => {
    const items = this.results();
    const localSort = this.localSortBy();
    const localFilter = this.localFilterBy();

    let filtered = [...items];

    // Apply local filtering
    if (localFilter === 'certified') {
      filtered = filtered.filter(v => v.isCertified);
    } else if (localFilter === 'accidentFree') {
      filtered = filtered.filter(v => v.accidentFree === true);
    } else if (localFilter === 'new') {
      filtered = filtered.filter(v => v.isNew);
    }

    // Apply local sorting
    if (localSort === 'price-asc') {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (localSort === 'price-desc') {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (localSort === 'year-desc') {
      filtered.sort((a, b) => b.year - a.year);
    } else if (localSort === 'mileage-asc') {
      filtered.sort((a, b) => a.mileage - b.mileage);
    }

    return filtered;
  });

  paginatedResults = computed(() => {
    const filtered = this.filteredResults();
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return filtered.slice(start, end);
  });

  totalResults = signal(0);
  loading = signal(false);
  pageIndex = signal(0);
  pageSize = signal(12);
  localSortBy = signal<string>('default');
  localFilterBy = signal<string>('all');

  sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'year-desc', label: 'Year: Newest First' },
    { value: 'mileage-asc', label: 'Mileage: Lowest First' }
  ];

  filterOptions = [
    { value: 'all', label: 'All Vehicles' },
    { value: 'certified', label: 'Certified Only' },
    { value: 'accidentFree', label: 'Accident Free' },
    { value: 'new', label: 'New Vehicles' }
  ];

  ngOnInit() {
    if (this.autoSearch && Object.keys(this.initialFilters).length > 0) {
      this.performSearch(this.initialFilters);
    }
  }

  performSearch(filters: SearchFilters) {
    this.loading.set(true);
    
    const request: SearchVehiclesRequest = {
      filters,
      page: 1,
      pageSize: 100 // Fetch more for client-side filtering
    };

    this._vehicleService.searchVehicles(request).subscribe({
      next: (response) => {
        this.results.set(response.items);
        this.totalResults.set(response.total);
        this.pageIndex.set(0);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onSortChange(value: string) {
    this.localSortBy.set(value);
    this.pageIndex.set(0);
  }

  onFilterChange(value: string) {
    this.localFilterBy.set(value);
    this.pageIndex.set(0);
  }

  getVehicleSpecs(vehicle: VehicleSearchResult) {
    return [
      { label: `${vehicle.mileage.toLocaleString()} km`, icon: 'speed' },
      { label: vehicle.transmission, icon: 'settings' },
      { label: `${vehicle.doors} doors`, icon: 'sensor_door' },
      { label: vehicle.exteriorColor, icon: 'palette' }
    ];
  }

  getVehicleBadges(vehicle: VehicleSearchResult): string[] {
    const badges: string[] = [];
    if (vehicle.isNew) badges.push('New');
    if (vehicle.isCertified) badges.push('Certified');
    if (vehicle.accidentFree) badges.push('Accident Free');
    return badges;
  }
}
