// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import {
  ImageGalleryComponent,
  FinanceCalculatorComponent,
  TrustBadgesComponent,
  ButtonComponent,
  BadgeComponent,
  GalleryImage
} from 'zoom-loop-components';
import { VehicleService, FavoritesService } from '../../services';
import { Vehicle } from '../../models';

interface VehicleDetailViewModel {
  vehicle: Vehicle;
  isFavorite: boolean;
  galleryImages: GalleryImage[];
  formattedPrice: string;
  formattedMonthlyPayment: string | null;
}

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ImageGalleryComponent,
    FinanceCalculatorComponent,
    TrustBadgesComponent,
    ButtonComponent,
    BadgeComponent
  ],
  templateUrl: './vehicle-detail.html',
  styleUrl: './vehicle-detail.scss'
})
export class VehicleDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vehicleService = inject(VehicleService);
  private favoritesService = inject(FavoritesService);

  vm$ = this.route.params.pipe(
    switchMap(params => this.vehicleService.getVehicleById(params['id'])),
    tap(vehicle => {
      if (!vehicle) {
        this.router.navigate(['/cars']);
      }
    }),
    map(vehicle => vehicle ? this.createViewModel(vehicle) : null),
    shareReplay(1)
  );

  private createViewModel(vehicle: Vehicle): VehicleDetailViewModel {
    return {
      vehicle,
      isFavorite: this.favoritesService.isFavoriteSync(vehicle.id),
      galleryImages: vehicle.images.map((url, i) => ({
        src: url,
        alt: `${vehicle.title} - Image ${i + 1}`,
        category: 'exterior' as const
      })),
      formattedPrice: this.formatPrice(vehicle.price),
      formattedMonthlyPayment: vehicle.monthlyPayment
        ? this.formatPrice(vehicle.monthlyPayment)
        : null
    };
  }

  private formatPrice(price: number): string {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0
    }).format(price);
  }

  toggleFavorite(vehicleId: string): void {
    this.favoritesService.toggle(vehicleId);
  }

  isFavorite(vehicleId: string): boolean {
    return this.favoritesService.isFavoriteSync(vehicleId);
  }

  onPreApproval(): void {
    console.log('Pre-approval clicked');
  }
}
