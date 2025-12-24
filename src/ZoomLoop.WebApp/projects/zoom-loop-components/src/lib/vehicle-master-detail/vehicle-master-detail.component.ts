import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleCardComponent, VehicleData } from '../vehicle-card/vehicle-card.component';
import { ImageGalleryComponent, GalleryImage } from '../image-gallery/image-gallery.component';
import { BadgeComponent } from '../badge/badge.component';
import { ButtonComponent } from '../button/button.component';

export interface VehicleMasterDetailConfig {
  showFilters?: boolean;
  showSearch?: boolean;
  columns?: 1 | 2 | 3 | 4;
  detailLayout?: 'side' | 'overlay' | 'full';
}

export interface VehicleDetailData extends VehicleData {
  description?: string;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  drivetrain?: string;
  exteriorColor?: string;
  interiorColor?: string;
  vin?: string;
  stockNumber?: string;
  features?: string[];
  highlights?: string[];
}

@Component({
  selector: 'zl-vehicle-master-detail',
  standalone: true,
  imports: [CommonModule, VehicleCardComponent, ImageGalleryComponent, BadgeComponent, ButtonComponent],
  templateUrl: './vehicle-master-detail.component.html',
  styleUrl: './vehicle-master-detail.component.scss'
})
export class VehicleMasterDetailComponent {
  @Input() vehicles: VehicleDetailData[] = [];
  @Input() selectedVehicle: VehicleDetailData | null = null;
  @Input() config: VehicleMasterDetailConfig = {
    showFilters: false,
    showSearch: false,
    columns: 3,
    detailLayout: 'side'
  };
  @Input() loading = false;
  @Input() favorites: Set<string> = new Set();
  @Input() ariaLabel = 'Vehicle listing';

  @Output() vehicleSelect = new EventEmitter<VehicleDetailData>();
  @Output() vehicleClose = new EventEmitter<void>();
  @Output() favoriteToggle = new EventEmitter<{ id: string; isFavorite: boolean }>();
  @Output() contactDealer = new EventEmitter<VehicleDetailData>();
  @Output() scheduleTestDrive = new EventEmitter<VehicleDetailData>();

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.selectedVehicle && this.config.detailLayout !== 'side') {
      this.closeDetail();
    }
  }

  get galleryImages(): GalleryImage[] {
    if (!this.selectedVehicle) return [];
    return this.selectedVehicle.images.map((src, index) => ({
      src,
      alt: `${this.selectedVehicle!.title} - Image ${index + 1}`,
      category: index === 0 ? 'exterior' : index < 3 ? 'exterior' : 'interior'
    }));
  }

  get gridClass(): string {
    const columns = this.config.columns || 3;
    return `vehicle-master-detail__grid--${columns}-col`;
  }

  get hasDetail(): boolean {
    return this.selectedVehicle !== null;
  }

  selectVehicle(vehicle: VehicleDetailData): void {
    this.selectedVehicle = vehicle;
    this.vehicleSelect.emit(vehicle);
    if (this.config.detailLayout === 'overlay' || this.config.detailLayout === 'full') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeDetail(): void {
    this.selectedVehicle = null;
    this.vehicleClose.emit();
    document.body.style.overflow = '';
  }

  onFavoriteToggle(event: { id: string; isFavorite: boolean }): void {
    this.favoriteToggle.emit(event);
  }

  isFavorite(vehicleId: string): boolean {
    return this.favorites.has(vehicleId);
  }

  onContactDealer(): void {
    if (this.selectedVehicle) {
      this.contactDealer.emit(this.selectedVehicle);
    }
  }

  onScheduleTestDrive(): void {
    if (this.selectedVehicle) {
      this.scheduleTestDrive.emit(this.selectedVehicle);
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  formatMileage(mileage: number): string {
    return new Intl.NumberFormat('en-CA').format(mileage) + ' km';
  }

  trackByVehicleId(_index: number, vehicle: VehicleDetailData): string {
    return vehicle.id;
  }
}
