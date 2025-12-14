import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Button } from '../button';

export interface VehicleSpec {
  label: string;
  icon?: string;
}

@Component({
  selector: 'zl-vehicle-card',
  standalone: true,
  templateUrl: './vehicle-card.html',
  styleUrl: './vehicle-card.scss',
  imports: [
    CommonModule,
    Button
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleCard {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() imageUrl = '';
  @Input() price = '';
  @Input() priceDetails = '';
  @Input() priceLabel = '';
  @Input() badges: string[] = [];
  @Input() featured = false;
  @Input() certified = false;
  @Input() newArrival = false;
  @Input() favorite = false;
  @Input() specs: VehicleSpec[] = [];
  @Input() features: string[] = [];
}
