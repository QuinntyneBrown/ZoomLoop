import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../badge/badge.component';

export interface VehicleSpec {
  label: string;
  value: string;
}

export interface VehicleData {
  id: string;
  title: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  price: number;
  monthlyPayment?: number;
  images: string[];
  specs: VehicleSpec[];
  badges?: string[];
  status?: 'available' | 'reserved' | 'sold';
  isFeatured?: boolean;
  isCertified?: boolean;
}

@Component({
  selector: 'zl-vehicle-card',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.scss'
})
export class VehicleCardComponent {
  @Input() vehicle: VehicleData = {
    id: '',
    title: '',
    year: 0,
    make: '',
    model: '',
    price: 0,
    images: [],
    specs: []
  };
  @Input() href = '#';
  @Input() isFavorite = false;
  @Input() loading = false;

  @Output() favoriteToggle = new EventEmitter<{ id: string; isFavorite: boolean }>();

  currentImageIndex = 0;

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  prevImage(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.currentImageIndex = this.currentImageIndex === 0
      ? this.vehicle.images.length - 1
      : this.currentImageIndex - 1;
  }

  nextImage(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.currentImageIndex = this.currentImageIndex === this.vehicle.images.length - 1
      ? 0
      : this.currentImageIndex + 1;
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isFavorite = !this.isFavorite;
    this.favoriteToggle.emit({ id: this.vehicle.id, isFavorite: this.isFavorite });
  }
}
