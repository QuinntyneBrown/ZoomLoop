import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
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
export class VehicleDetail implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vehicleService = inject(VehicleService);
  private favoritesService = inject(FavoritesService);
  private destroy$ = new Subject<void>();

  vehicle: Vehicle | null = null;
  isFavorite = false;

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => this.vehicleService.getVehicleById(params['id'])),
      takeUntil(this.destroy$)
    ).subscribe(vehicle => {
      if (vehicle) {
        this.vehicle = vehicle;
        this.isFavorite = this.favoritesService.isFavoriteSync(vehicle.id);
      } else {
        this.router.navigate(['/cars']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get galleryImages(): GalleryImage[] {
    if (!this.vehicle) return [];
    return this.vehicle.images.map((url, i) => ({
      src: url,
      alt: `${this.vehicle!.title} - Image ${i + 1}`,
      category: 'exterior' as const
    }));
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0
    }).format(price);
  }

  toggleFavorite(): void {
    if (this.vehicle) {
      this.favoritesService.toggle(this.vehicle.id);
      this.isFavorite = !this.isFavorite;
    }
  }

  onPreApproval(): void {
    console.log('Pre-approval clicked');
  }
}
