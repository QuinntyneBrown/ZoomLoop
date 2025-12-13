import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface VehicleSpec {
  label: string;
  icon?: string;
}

@Component({
  selector: 'zl-vehicle-card',
  standalone: true,
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.scss',
  imports: [
    CommonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleCardComponent {
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
