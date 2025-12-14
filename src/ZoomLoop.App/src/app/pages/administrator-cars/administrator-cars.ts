// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnInit, ViewChild, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { VehicleService } from '../../core';
import { Vehicle } from '../../models';
import { VehicleImageDropDialog } from '../../dialogs';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'zl-administrator-cars',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule
  ],
  templateUrl: './administrator-cars.html',
  styleUrls: ['./administrator-cars.scss']
})
export class AdministratorCars implements OnInit {
  private readonly _vehicleService = inject(VehicleService);
  private readonly _dialog = inject(Dialog);
  private readonly _router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['image', 'year', 'make', 'model', 'vin', 'stockNumber', 'mileage', 'status', 'actions'];
  dataSource = new MatTableDataSource<Vehicle>([]);
  
  isLoading = signal(true);
  totalVehicles = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);
  selectedVehicle = signal<Vehicle | null>(null);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.loadVehicles();
  }

  async loadVehicles() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const response = await firstValueFrom(
        this._vehicleService.getVehiclesPage(this.pageSize(), this.pageIndex())
      );
      
      this.dataSource.data = response.entities;
      this.totalVehicles.set(response.length);
    } catch (error: any) {
      console.error('Error loading vehicles:', error);
      const errorMsg = error?.error?.message || error?.message || 'Failed to load vehicles. Please try again.';
      this.errorMessage.set(errorMsg);
    } finally {
      this.isLoading.set(false);
    }
  }

  async onPageChange(event: PageEvent) {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
    await this.loadVehicles();
  }

  selectVehicle(vehicle: Vehicle) {
    this.selectedVehicle.set(vehicle);
  }

  clearSelection() {
    this.selectedVehicle.set(null);
  }

  async openCreateDialog() {
    const dialogRef = this._dialog.open(VehicleImageDropDialog, {
      width: '90vw',
      maxWidth: '700px',
      disableClose: false
    });

    const result = await firstValueFrom(dialogRef.closed);
    
    if (result) {
      // Vehicle was created successfully
      // Navigate to the page where the new vehicle is
      const newVehicle = result as Vehicle;
      
      // Reload vehicles to get the updated list
      await this.loadVehicles();
      
      // Find the page where the new vehicle would be
      const vehicleIndex = this.dataSource.data.findIndex(v => v.vehicleId === newVehicle.vehicleId);
      if (vehicleIndex >= 0) {
        this.selectedVehicle.set(newVehicle);
      } else {
        // Vehicle might be on a different page due to sorting
        // Go to the first page and reload
        this.pageIndex.set(0);
        await this.loadVehicles();
        
        // Try to find it again
        const vehicle = this.dataSource.data.find(v => v.vehicleId === newVehicle.vehicleId);
        if (vehicle) {
          this.selectedVehicle.set(vehicle);
        }
      }
    }
  }

  async editVehicle(vehicle: Vehicle) {
    // For now, just navigate to the vehicle create page with the vehicle data
    // In a full implementation, you'd open an edit dialog or navigate to an edit page
    this._router.navigate(['/vehicles/create'], { state: { vehicle } });
  }

  async deleteVehicle(vehicle: Vehicle) {
    if (!vehicle.vehicleId) return;
    
    if (!confirm(`Are you sure you want to delete this vehicle (${vehicle.year} ${vehicle.vin})?`)) {
      return;
    }

    try {
      await firstValueFrom(this._vehicleService.deleteVehicle(vehicle.vehicleId));
      
      // If we're deleting the selected vehicle, clear the selection
      if (this.selectedVehicle()?.vehicleId === vehicle.vehicleId) {
        this.selectedVehicle.set(null);
      }
      
      // Reload the current page
      await this.loadVehicles();
    } catch (error: any) {
      console.error('Error deleting vehicle:', error);
      const errorMsg = error?.error?.message || error?.message || 'Failed to delete vehicle. Please try again.';
      this.errorMessage.set(errorMsg);
    }
  }

  getPrimaryImage(vehicle: Vehicle): string {
    const primaryImage = vehicle.images.find(img => img.isPrimary);
    return primaryImage?.thumbnailUrl || vehicle.images[0]?.thumbnailUrl || '/assets/placeholder-vehicle.png';
  }

  getVehicleStatus(vehicle: Vehicle): { label: string, class: string } {
    if (vehicle.isNew) {
      return { label: 'New', class: 'status-new' };
    } else if (vehicle.isCertified) {
      return { label: 'Certified', class: 'status-certified' };
    } else {
      return { label: 'Used', class: 'status-used' };
    }
  }
}
