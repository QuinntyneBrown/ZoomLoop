// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { VehicleValuationService } from '../../core/vehicle-valuation.service';

@Component({
  selector: 'zl-selling-or-trading',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './selling-or-trading.html',
  styleUrls: ['./selling-or-trading.scss']
})
export class SellingOrTrading implements OnInit {
  stage: 'vin-input' | 'details-input' | 'result' = 'vin-input';
  loading = false;
  error: string | null = null;

  vehicleInfo: { year: number; make: string; model: string } | null = null;
  valuationResult: { fairValue: number; explanation: string } | null = null;

  readonly vinForm = new FormGroup({
    vin: new FormControl('', [Validators.required, Validators.minLength(17), Validators.maxLength(17)])
  });

  readonly detailsForm = new FormGroup({
    postalCode: new FormControl('', [Validators.required]),
    kilometers: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    accidents: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    interiorCondition: new FormControl('', [Validators.required]),
    exteriorCondition: new FormControl('', [Validators.required])
  });

  readonly conditionOptions = ['Excellent', 'Fair', 'Bad'];

  constructor(private valuationService: VehicleValuationService) {}

  ngOnInit(): void {
    // Lifecycle hook required by OnInit interface
    // Future initialization logic can be added here
    return;
  }

  handleGetInstantOffer(): void {
    if (this.vinForm.invalid) {
      this.vinForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    const vin = this.vinForm.value.vin!;

    this.valuationService.getVehicleByVin(vin).subscribe({
      next: (response) => {
        this.vehicleInfo = response;
        this.stage = 'details-input';
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to retrieve vehicle information. Please check the VIN and try again.';
        this.loading = false;
        console.error('Error getting vehicle by VIN:', err);
      }
    });
  }

  handleGetInstantQuote(): void {
    if (this.detailsForm.invalid || !this.vehicleInfo) {
      this.detailsForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const request = {
      vin: this.vinForm.value.vin!,
      year: this.vehicleInfo.year,
      make: this.vehicleInfo.make,
      model: this.vehicleInfo.model,
      postalCode: this.detailsForm.value.postalCode!,
      kilometers: this.detailsForm.value.kilometers!,
      accidents: this.detailsForm.value.accidents!,
      interiorCondition: this.detailsForm.value.interiorCondition!,
      exteriorCondition: this.detailsForm.value.exteriorCondition!
    };

    this.valuationService.getVehicleValuation(request).subscribe({
      next: (response) => {
        this.valuationResult = response;
        this.stage = 'result';
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to calculate vehicle valuation. Please try again.';
        this.loading = false;
        console.error('Error getting vehicle valuation:', err);
      }
    });
  }

  reset(): void {
    this.stage = 'vin-input';
    this.loading = false;
    this.error = null;
    this.vehicleInfo = null;
    this.valuationResult = null;
    this.vinForm.reset();
    this.detailsForm.reset();
  }
}
