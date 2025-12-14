// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, EventEmitter, Output, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { VehicleService, SearchFilters } from '../../core/vehicle.service';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

@Component({
  selector: 'zl-search-input',
  standalone: true,
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatIconModule
  ]
})
export class SearchInput implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _vehicleService = inject(VehicleService);

  @Output() search = new EventEmitter<SearchFilters>();

  searchForm!: FormGroup;
  makeSuggestions = signal<string[]>([]);
  modelSuggestions = signal<string[]>([]);
  colorSuggestions = signal<string[]>([]);

  transmissionOptions = ['Automatic', 'Manual', 'CVT'];
  doorOptions = [2, 4, 5];

  ngOnInit() {
    this.searchForm = this._fb.group({
      make: [''],
      model: [''],
      yearMin: [null],
      yearMax: [null],
      priceMin: [null],
      priceMax: [null],
      mileageMin: [null],
      mileageMax: [null],
      color: [''],
      transmission: [''],
      doors: [null],
      accidentFree: [false],
      isNewest: [false]
    });

    // Setup type-ahead for make
    this.searchForm.get('make')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (value && value.length >= 2) {
          return this._vehicleService.getVehicleSuggestions(value, 'make');
        }
        return of({ suggestions: [] });
      })
    ).subscribe(response => {
      this.makeSuggestions.set(response.suggestions);
    });

    // Setup type-ahead for model
    this.searchForm.get('model')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (value && value.length >= 2) {
          return this._vehicleService.getVehicleSuggestions(value, 'model');
        }
        return of({ suggestions: [] });
      })
    ).subscribe(response => {
      this.modelSuggestions.set(response.suggestions);
    });

    // Setup type-ahead for color
    this.searchForm.get('color')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (value && value.length >= 2) {
          return this._vehicleService.getVehicleSuggestions(value, 'color');
        }
        return of({ suggestions: [] });
      })
    ).subscribe(response => {
      this.colorSuggestions.set(response.suggestions);
    });
  }

  onSearch() {
    const formValue = this.searchForm.value;
    const filters: SearchFilters = {};

    if (formValue.make) filters.makes = [formValue.make];
    if (formValue.model) filters.models = [formValue.model];
    if (formValue.color) filters.colors = [formValue.color];
    if (formValue.transmission) filters.transmissions = [formValue.transmission];
    if (formValue.doors) filters.doors = formValue.doors;
    if (formValue.accidentFree) filters.accidentFree = formValue.accidentFree;
    if (formValue.isNewest) filters.isNewest = formValue.isNewest;

    if (formValue.yearMin || formValue.yearMax) {
      filters.year = {};
      if (formValue.yearMin) filters.year.min = formValue.yearMin;
      if (formValue.yearMax) filters.year.max = formValue.yearMax;
    }

    if (formValue.priceMin || formValue.priceMax) {
      filters.price = {};
      if (formValue.priceMin) filters.price.min = formValue.priceMin;
      if (formValue.priceMax) filters.price.max = formValue.priceMax;
    }

    if (formValue.mileageMin || formValue.mileageMax) {
      filters.kilometers = {};
      if (formValue.mileageMin) filters.kilometers.min = formValue.mileageMin;
      if (formValue.mileageMax) filters.kilometers.max = formValue.mileageMax;
    }

    this.search.emit(filters);
  }

  onReset() {
    this.searchForm.reset({
      accidentFree: false,
      isNewest: false
    });
    this.search.emit({});
  }
}
