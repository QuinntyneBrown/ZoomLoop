// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnInit, inject, signal, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SearchInput } from '../../components/search-input';
import { SearchResults } from '../../components/search-results';
import { VehicleService, SearchFilters } from '../../core/vehicle.service';

interface LocationInfo {
  city: string;
  province: string;
  latitude?: number;
  longitude?: number;
}

const DEFAULT_LOCATION: LocationInfo = {
  city: 'Toronto',
  province: 'ON'
};

@Component({
  selector: 'zl-cars',
  standalone: true,
  imports: [
    CommonModule,
    SearchInput,
    SearchResults
  ],
  templateUrl: './cars.html',
  styleUrl: './cars.scss'
})
export class Cars implements OnInit, AfterViewInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _vehicleService = inject(VehicleService);

  @ViewChild(SearchResults) searchResults?: SearchResults;

  initialFilters = signal<SearchFilters>({});
  pageTitle = signal<string>('');
  userLocation = signal<LocationInfo | null>(null);

  ngOnInit() {
    // Get user location
    this.detectUserLocation();

    // Subscribe to route params and query params
    this._route.params.subscribe(params => {
      this._route.queryParams.subscribe(queryParams => {
        this.buildFiltersFromRoute(params, queryParams);
      });
    });
  }

  ngAfterViewInit() {
    // Watch for result changes to update the title
    if (this.searchResults) {
      const results = this.searchResults.results;
      // Use effect to watch for changes in results
      const updateInterval = setInterval(() => {
        const count = this.searchResults?.totalResults();
        if (count !== undefined && count >= 0) {
          this.updatePageTitle();
          clearInterval(updateInterval);
        }
      }, 100);

      // Clear interval after 5 seconds to prevent memory leak
      setTimeout(() => clearInterval(updateInterval), 5000);
    }
  }

  private detectUserLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // For now, we'll set a default location
          // In a real app, you'd reverse geocode the coordinates to get city/province
          this.userLocation.set({
            ...DEFAULT_LOCATION,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          this.updatePageTitle();
        },
        (error) => {
          // Default location if geolocation fails
          this.userLocation.set(DEFAULT_LOCATION);
          this.updatePageTitle();
        }
      );
    } else {
      // Default location if geolocation not supported
      this.userLocation.set(DEFAULT_LOCATION);
      this.updatePageTitle();
    }
  }

  private async buildFiltersFromRoute(params: any, queryParams: any) {
    const filters: SearchFilters = {};

    // Handle keyword parameter (make or color)
    if (params['keyword']) {
      const keyword = params['keyword'];
      const isValidMake = await this.isValidMake(keyword);
      
      if (isValidMake) {
        filters.makes = [keyword];
      } else {
        filters.colors = [keyword];
      }
    }

    // Handle searchText query parameter
    if (queryParams['searchText']) {
      const searchText = decodeURIComponent(queryParams['searchText']);
      // Parse search text for keywords like "door 4"
      const doorMatch = searchText.match(/door\s*(\d+)/i);
      if (doorMatch) {
        filters.doors = parseInt(doorMatch[1]);
      }
      
      // You could add more parsing logic here for other search patterns
    }

    // Handle price range query parameters
    if (queryParams['priceLow']) {
      if (!filters.price) filters.price = {};
      filters.price.min = parseInt(queryParams['priceLow']);
    }

    if (queryParams['priceHigh']) {
      if (!filters.price) filters.price = {};
      filters.price.max = parseInt(queryParams['priceHigh']);
    }

    this.initialFilters.set(filters);
    this.updatePageTitle();
  }

  private async isValidMake(keyword: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(this._vehicleService.getVehicleSuggestions(keyword, 'make', 1));
      if (!response || !response.suggestions || response.suggestions.length === 0) {
        return false;
      }
      return response.suggestions[0].toLowerCase() === keyword.toLowerCase();
    } catch {
      return false;
    }
  }

  private updatePageTitle() {
    const filters = this.initialFilters();
    const location = this.userLocation();
    
    let title = 'Used ';
    
    if (filters.makes && filters.makes.length > 0) {
      title += `${filters.makes[0]} `;
    }
    
    title += 'for Sale';
    
    if (location) {
      title += ` in ${location.city}, ${location.province}`;
    }

    // Add result count if available
    if (this.searchResults) {
      const count = this.searchResults.totalResults();
      if (count > 0) {
        title += `: ${count} results`;
      }
    }
    
    this.pageTitle.set(title);
  }

  onSearch(filters: SearchFilters) {
    this.initialFilters.set(filters);
    this.updatePageTitle();
  }
}
