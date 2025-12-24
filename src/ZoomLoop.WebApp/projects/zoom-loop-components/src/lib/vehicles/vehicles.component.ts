import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BadgeComponent } from '../badge/badge.component';
import { ButtonComponent } from '../button/button.component';
import { InputComponent } from '../input/input.component';

export interface VehicleData {
  id: string;
  title: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  price: number;
  monthlyPayment?: number;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  drivetrain?: string;
  exteriorColor?: string;
  interiorColor?: string;
  vin?: string;
  stockNumber?: string;
  status?: 'available' | 'reserved' | 'sold';
  isFeatured?: boolean;
  isCertified?: boolean;
}

export interface VehiclesConfig {
  showSearch?: boolean;
  pageSize?: number;
}

@Component({
  selector: 'zl-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BadgeComponent, ButtonComponent, InputComponent],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss'
})
export class VehiclesComponent implements OnChanges {
  @Input() vehicles: VehicleData[] = [];
  @Input() selectedVehicle: VehicleData | null = null;
  @Input() config: VehiclesConfig = {
    showSearch: true,
    pageSize: 10
  };
  @Input() loading = false;
  @Input() ariaLabel = 'Vehicle management';

  @Output() vehicleSelect = new EventEmitter<VehicleData>();
  @Output() vehicleClose = new EventEmitter<void>();
  @Output() vehicleSave = new EventEmitter<VehicleData>();
  @Output() vehicleDelete = new EventEmitter<VehicleData>();
  @Output() vehicleCreate = new EventEmitter<void>();

  vehicleForm: FormGroup;
  searchTerm = '';
  sortColumn: keyof VehicleData = 'title';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private fb: FormBuilder) {
    this.vehicleForm = this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedVehicle'] && this.selectedVehicle) {
      this.populateForm(this.selectedVehicle);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      id: [''],
      title: ['', Validators.required],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(1900), Validators.max(2100)]],
      make: ['', Validators.required],
      model: ['', Validators.required],
      trim: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      monthlyPayment: [null],
      mileage: [0, Validators.min(0)],
      fuelType: [''],
      transmission: [''],
      drivetrain: [''],
      exteriorColor: [''],
      interiorColor: [''],
      vin: [''],
      stockNumber: [''],
      status: ['available'],
      isFeatured: [false],
      isCertified: [false]
    });
  }

  private populateForm(vehicle: VehicleData): void {
    this.vehicleForm.patchValue({
      id: vehicle.id,
      title: vehicle.title,
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      trim: vehicle.trim || '',
      price: vehicle.price,
      monthlyPayment: vehicle.monthlyPayment || null,
      mileage: vehicle.mileage || 0,
      fuelType: vehicle.fuelType || '',
      transmission: vehicle.transmission || '',
      drivetrain: vehicle.drivetrain || '',
      exteriorColor: vehicle.exteriorColor || '',
      interiorColor: vehicle.interiorColor || '',
      vin: vehicle.vin || '',
      stockNumber: vehicle.stockNumber || '',
      status: vehicle.status || 'available',
      isFeatured: vehicle.isFeatured || false,
      isCertified: vehicle.isCertified || false
    });
  }

  get filteredVehicles(): VehicleData[] {
    let result = [...this.vehicles];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(v =>
        v.title.toLowerCase().includes(term) ||
        v.make.toLowerCase().includes(term) ||
        v.model.toLowerCase().includes(term) ||
        (v.vin && v.vin.toLowerCase().includes(term)) ||
        (v.stockNumber && v.stockNumber.toLowerCase().includes(term))
      );
    }

    result.sort((a, b) => {
      const aVal = a[this.sortColumn];
      const bVal = b[this.sortColumn];

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }

  get hasDetail(): boolean {
    return this.selectedVehicle !== null;
  }

  selectVehicle(vehicle: VehicleData): void {
    this.selectedVehicle = vehicle;
    this.vehicleSelect.emit(vehicle);
  }

  closeDetail(): void {
    this.selectedVehicle = null;
    this.vehicleForm.reset();
    this.vehicleClose.emit();
  }

  onSave(): void {
    if (this.vehicleForm.valid) {
      const formValue = this.vehicleForm.value;
      const vehicle: VehicleData = {
        ...formValue,
        title: formValue.title || `${formValue.year} ${formValue.make} ${formValue.model}`.trim()
      };
      this.vehicleSave.emit(vehicle);
    }
  }

  onDelete(): void {
    if (this.selectedVehicle) {
      this.vehicleDelete.emit(this.selectedVehicle);
    }
  }

  onCreate(): void {
    this.vehicleForm.reset({
      year: new Date().getFullYear(),
      status: 'available',
      isFeatured: false,
      isCertified: false
    });
    this.vehicleCreate.emit();
  }

  sort(column: keyof VehicleData): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  getSortIcon(column: keyof VehicleData): string {
    if (this.sortColumn !== column) return '';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  formatMileage(mileage: number | undefined): string {
    if (!mileage) return '-';
    return new Intl.NumberFormat('en-CA').format(mileage) + ' km';
  }

  getStatusVariant(status: string | undefined): 'success' | 'warning' | 'secondary' {
    switch (status) {
      case 'available': return 'success';
      case 'reserved': return 'warning';
      case 'sold': return 'secondary';
      default: return 'secondary';
    }
  }

  trackByVehicleId(_index: number, vehicle: VehicleData): string {
    return vehicle.id;
  }
}
