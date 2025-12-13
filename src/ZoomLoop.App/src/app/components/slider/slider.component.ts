// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Input, forwardRef, HostListener, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'zl-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true
    }
  ]
})
export class SliderComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() required = false;
  @Input() disabled = false;
  @Input() id?: string;
  @Input() showValue = true;

  @ViewChild('track', { static: false }) trackRef?: ElementRef<HTMLDivElement>;

  value = 0;
  isDragging = false;
  onChange: (value: number) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: number): void {
    this.value = value ?? this.min;
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get percentage(): number {
    const range = this.max - this.min;
    if (range === 0) return 0;
    return ((this.value - this.min) / range) * 100;
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = parseFloat(target.value);
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  onMouseDown(event: MouseEvent): void {
    if (this.disabled) return;
    this.isDragging = true;
    this.updateValueFromEvent(event);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      this.updateValueFromEvent(event);
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (this.isDragging) {
      this.isDragging = false;
      this.onTouched();
    }
  }

  onTouchStart(event: TouchEvent): void {
    if (this.disabled) return;
    this.isDragging = true;
    this.updateValueFromTouchEvent(event);
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (this.isDragging) {
      event.preventDefault();
      this.updateValueFromTouchEvent(event);
    }
  }

  @HostListener('document:touchend')
  onTouchEnd(): void {
    if (this.isDragging) {
      this.isDragging = false;
      this.onTouched();
    }
  }

  private updateValueFromEvent(event: MouseEvent): void {
    if (!this.trackRef) return;
    
    const track = this.trackRef.nativeElement;
    const rect = track.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    this.updateValueFromPercentage(percentage);
  }

  private updateValueFromTouchEvent(event: TouchEvent): void {
    if (!this.trackRef || event.touches.length === 0) return;
    
    const track = this.trackRef.nativeElement;
    const rect = track.getBoundingClientRect();
    const x = event.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    this.updateValueFromPercentage(percentage);
  }

  private updateValueFromPercentage(percentage: number): void {
    const rawValue = this.min + (percentage / 100) * (this.max - this.min);
    const steppedValue = Math.round(rawValue / this.step) * this.step;
    // Handle floating-point precision by rounding to a reasonable number of decimal places
    const decimalPlaces = this.step.toString().includes('.') 
      ? this.step.toString().split('.')[1].length 
      : 0;
    const clampedValue = Math.max(this.min, Math.min(this.max, 
      parseFloat(steppedValue.toFixed(decimalPlaces))
    ));
    
    if (this.value !== clampedValue) {
      this.value = clampedValue;
      this.onChange(this.value);
    }
  }
}
