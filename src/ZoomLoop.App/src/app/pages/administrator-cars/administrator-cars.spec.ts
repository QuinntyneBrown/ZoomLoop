// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AdministratorCars } from './administrator-cars';

describe('AdministratorCars', () => {
  let component: AdministratorCars;
  let fixture: ComponentFixture<AdministratorCars>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministratorCars],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdministratorCars);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct display columns', () => {
    expect(component.displayedColumns).toEqual([
      'image', 'year', 'make', 'model', 'vin', 'stockNumber', 'mileage', 'status', 'actions'
    ]);
  });

  it('should initialize with loading state', () => {
    expect(component.isLoading()).toBe(true);
  });
});
