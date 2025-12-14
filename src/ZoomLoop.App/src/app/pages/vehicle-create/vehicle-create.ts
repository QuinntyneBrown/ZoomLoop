// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Vehicle, VehicleImage, VehicleFeature } from '../../models';
import { Button } from '../../components/button';

@Component({
  selector: 'zl-vehicle-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Button],
  templateUrl: './vehicle-create.html',
  styleUrls: ['./vehicle-create.scss']
})
export class VehicleCreate implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _http = inject(HttpClient);
  private readonly _router = inject(Router);

  form!: FormGroup;
  images = signal<VehicleImage[]>([]);
  features = signal<VehicleFeature[]>([]);
  isDragging = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  // Common vehicle options
  transmissions = ['Automatic', 'Manual', 'CVT', 'Semi-Automatic'];
  fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
  driveTypes = ['FWD', 'RWD', 'AWD', '4WD'];
  bodyTypes = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Van', 'Wagon', 'Convertible'];
  
  featureCategories = [
    { name: 'Safety', features: ['Backup Camera', 'Blind Spot Monitor', 'Lane Departure Warning', 'Adaptive Cruise Control', 'Emergency Braking'] },
    { name: 'Technology', features: ['Bluetooth', 'Apple CarPlay', 'Android Auto', 'Navigation System', 'Premium Sound System'] },
    { name: 'Comfort', features: ['Heated Seats', 'Leather Seats', 'Sunroof', 'Dual Climate Control', 'Power Seats'] },
    { name: 'Convenience', features: ['Keyless Entry', 'Push Button Start', 'Remote Start', 'Power Liftgate', 'Auto-Dimming Mirror'] }
  ];

  ngOnInit() {
    this.form = this._fb.group({
      vin: ['', [Validators.required, Validators.pattern(/^[A-HJ-NPR-Z0-9]{17}$/)]],
      stockNumber: ['', Validators.required],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)]],
      makeId: [''],
      vehicleModelId: [''],
      trim: [''],
      mileage: [0, [Validators.required, Validators.min(0)]],
      exteriorColor: ['', Validators.required],
      interiorColor: ['', Validators.required],
      transmission: ['', Validators.required],
      fuelType: ['', Validators.required],
      driveType: ['', Validators.required],
      bodyType: ['', Validators.required],
      doors: [4, [Validators.required, Validators.min(2), Validators.max(6)]],
      seats: [5, [Validators.required, Validators.min(2), Validators.max(9)]],
      engineSize: [null],
      cylinders: [null],
      horsepower: [null],
      cityFuelConsumption: [null],
      highwayFuelConsumption: [null],
      description: ['', Validators.required],
      isNew: [false],
      isCertified: [false]
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }

  async handleFiles(files: FileList) {
    const currentImages = this.images();
    const maxOrder = currentImages.length > 0 
      ? Math.max(...currentImages.map(img => img.displayOrder))
      : 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: VehicleImage = {
            imageUrl: e.target?.result as string,
            thumbnailUrl: e.target?.result as string,
            caption: '',
            displayOrder: maxOrder + i + 1,
            isPrimary: currentImages.length === 0 && i === 0,
            createdDate: new Date()
          };
          this.images.update(imgs => [...imgs, newImage]);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {
    this.images.update(imgs => {
      const newImages = imgs.filter((_, i) => i !== index);
      // If we removed the primary image, set the first one as primary
      if (newImages.length > 0 && !newImages.some(img => img.isPrimary)) {
        newImages[0].isPrimary = true;
      }
      return newImages;
    });
  }

  setPrimaryImage(index: number) {
    this.images.update(imgs => {
      return imgs.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }));
    });
  }

  toggleFeature(featureName: string, category: string) {
    const currentFeatures = this.features();
    const existingIndex = currentFeatures.findIndex(f => f.name === featureName);
    
    if (existingIndex >= 0) {
      this.features.update(features => features.filter((_, i) => i !== existingIndex));
    } else {
      const newFeature: VehicleFeature = {
        name: featureName,
        category: category,
        description: '',
        isStandard: false
      };
      this.features.update(features => [...features, newFeature]);
    }
  }

  isFeatureSelected(featureName: string): boolean {
    return this.features().some(f => f.name === featureName);
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const vehicle: Vehicle = {
      ...this.form.value,
      images: this.images(),
      features: this.features()
    };

    try {
      const response = await firstValueFrom(this._http.post<{ vehicle: Vehicle }>('/api/vehicle', { vehicle }));
      
      if (response?.vehicle?.vehicleId) {
        // Navigate to vehicle detail or list page
        this._router.navigate(['/vehicles']);
      }
    } catch (error: any) {
      console.error('Error creating vehicle:', error);
      const errorMsg = error?.error?.message || error?.message || 'Failed to create vehicle. Please try again.';
      this.errorMessage.set(errorMsg);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  cancel() {
    this._router.navigate(['/']);
  }
}
