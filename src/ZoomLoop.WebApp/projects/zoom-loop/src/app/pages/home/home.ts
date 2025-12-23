import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import {
  HeroComponent,
  HowItWorksComponent,
  TrustBadgesComponent,
  VehicleCardComponent,
  ButtonComponent,
  VehicleData
} from 'zoom-loop-components';
import { VehicleService, FavoritesService } from '../../services';
import { Vehicle } from '../../models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeroComponent,
    HowItWorksComponent,
    TrustBadgesComponent,
    VehicleCardComponent,
    ButtonComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  private router = inject(Router);
  private vehicleService = inject(VehicleService);
  private favoritesService = inject(FavoritesService);

  featuredVehicles$!: Observable<Vehicle[]>;

  popularMakes = ['Honda', 'Toyota', 'Ford', 'Hyundai', 'BMW', 'Tesla', 'Kia', 'Mazda'];

  ngOnInit(): void {
    this.featuredVehicles$ = this.vehicleService.getFeaturedVehicles();
  }

  onSearch(query: string): void {
    this.router.navigate(['/cars'], { queryParams: { q: query } });
  }

  onBrowseMake(make: string): void {
    this.router.navigate(['/cars'], { queryParams: { make } });
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
}
