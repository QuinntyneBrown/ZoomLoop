import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { vi } from 'vitest';
import { RangeSlider, RangeValue } from './range-slider';

describe('RangeSlider', () => {
  let component: RangeSlider;
  let fixture: ComponentFixture<RangeSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangeSlider, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RangeSlider);
    component = fixture.componentInstance;
    component.min = 2015;
    component.max = 2026;
    component.step = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should have default values', () => {
      expect(component.min).toBe(2015);
      expect(component.max).toBe(2026);
      expect(component.step).toBe(1);
    });

    it('should initialize with correct range', () => {
      expect(component.value()).toEqual({ low: 0, high: 100 });
    });

    it('should not be disabled by default', () => {
      expect(component.disabled()).toBe(false);
    });
  });

  describe('ControlValueAccessor', () => {
    it('should write value', () => {
      const newValue: RangeValue = { low: 2018, high: 2024 };
      component.writeValue(newValue);
      fixture.detectChanges();
      expect(component.value()).toEqual(newValue);
    });

    it('should register onChange callback', () => {
      const fn = vi.fn();
      component.registerOnChange(fn);
      component.setValue({ low: 2016, high: 2023 });
      expect(fn).toHaveBeenCalledWith({ low: 2016, high: 2023 });
    });

    it('should register onTouched callback', () => {
      const fn = vi.fn();
      component.registerOnTouched(fn);
      expect(fn).not.toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      fixture.detectChanges();
      expect(component.disabled()).toBe(true);
      
      component.setDisabledState(false);
      fixture.detectChanges();
      expect(component.disabled()).toBe(false);
    });
  });

  describe('computed signals', () => {
    beforeEach(() => {
      component.writeValue({ low: 2018, high: 2024 });
      fixture.detectChanges();
    });

    it('should calculate lowPercent correctly', () => {
      // (2018 - 2015) / (2026 - 2015) * 100 = 3/11 * 100 ≈ 27.27
      expect(component.lowPercent()).toBeCloseTo(27.27, 1);
    });

    it('should calculate highPercent correctly', () => {
      // (2024 - 2015) / (2026 - 2015) * 100 = 9/11 * 100 ≈ 81.82
      expect(component.highPercent()).toBeCloseTo(81.82, 1);
    });

    it('should calculate rangePercent correctly', () => {
      expect(component.rangePercent()).toBeCloseTo(54.55, 1);
    });

    it('should update computed values when value changes', () => {
      component.writeValue({ low: 2020, high: 2026 });
      fixture.detectChanges();
      
      // (2020 - 2015) / (2026 - 2015) * 100 = 5/11 * 100 ≈ 45.45
      expect(component.lowPercent()).toBeCloseTo(45.45, 1);
      expect(component.highPercent()).toBe(100);
    });
  });

  describe('value clamping', () => {
    it('should clamp low value to min', () => {
      component.writeValue({ low: 2010, high: 2024 });
      fixture.detectChanges();
      expect(component.value().low).toBe(2015);
    });

    it('should clamp high value to max', () => {
      component.writeValue({ low: 2018, high: 2030 });
      fixture.detectChanges();
      expect(component.value().high).toBe(2026);
    });

    it('should clamp both values', () => {
      component.writeValue({ low: 2000, high: 2050 });
      fixture.detectChanges();
      expect(component.value().low).toBe(2015);
      expect(component.value().high).toBe(2026);
    });
  });

  describe('user interactions', () => {
    it('should not respond when disabled', () => {
      component.setDisabledState(true);
      fixture.detectChanges();
      
      const event = new MouseEvent('mousedown');
      component.onThumbMouseDown('low', event);
      // Component should not start dragging when disabled
    });

    it('should handle track click', () => {
      const trackElement = fixture.nativeElement.querySelector('.range-slider__track');
      const clickEvent = new MouseEvent('click', {
        clientX: trackElement.getBoundingClientRect().left + 50
      });
      
      const initialValue = component.value();
      component.onTrackClick(clickEvent);
      fixture.detectChanges();
      
      // Value should be updated based on click position
      const newValue = component.value();
      expect(newValue.low !== initialValue.low || newValue.high !== initialValue.high).toBe(true);
    });

    it('should call onTouched when thumb is pressed', () => {
      const fn = vi.fn();
      component.registerOnTouched(fn);
      
      const event = new MouseEvent('mousedown');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      
      component.onThumbMouseDown('low', event);
      expect(fn).toHaveBeenCalled();
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('reactive forms integration', () => {
    it('should work with FormControl', () => {
      const control = new FormControl<RangeValue>({ low: 2019, high: 2025 }, { nonNullable: true });
      component.writeValue(control.value);
      fixture.detectChanges();
      expect(component.value()).toEqual({ low: 2019, high: 2025 });
    });

    it('should emit changes to FormControl', () => {
      const control = new FormControl<RangeValue>({ low: 2015, high: 2026 }, { nonNullable: true });
      component.registerOnChange((value) => {
        control.setValue(value, { emitEvent: false });
      });

      component.setValue({ low: 2017, high: 2023 });
      fixture.detectChanges();

      expect(control.value).toEqual({ low: 2017, high: 2023 });
    });
  });

  describe('value constraints', () => {
    it('should prevent low from exceeding high', () => {
      component.setValue({ low: 2025, high: 2020 });
      fixture.detectChanges();
      
      // setValue should clamp appropriately
      const value = component.value();
      expect(value.low).toBeLessThanOrEqual(value.high);
    });
  });

  describe('BEM classes', () => {
    it('should apply BEM class names', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.range-slider')).toBeTruthy();
      expect(compiled.querySelector('.range-slider__track')).toBeTruthy();
      expect(compiled.querySelector('.range-slider__thumb')).toBeTruthy();
      expect(compiled.querySelector('.range-slider__thumb--low')).toBeTruthy();
      expect(compiled.querySelector('.range-slider__thumb--high')).toBeTruthy();
    });

    it('should apply disabled modifier class', () => {
      component.setDisabledState(true);
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.range-slider--disabled')).toBeTruthy();
    });
  });

  describe('OnPush change detection', () => {
    it('should trigger change detection when value changes', () => {
      const cdr = (component as any).cdr;
      vi.spyOn(cdr, 'markForCheck');
      
      component.setValue({ low: 2020, high: 2024 });
      expect(cdr.markForCheck).toHaveBeenCalled();
    });

    it('should trigger change detection when disabled state changes', () => {
      const cdr = (component as any).cdr;
      vi.spyOn(cdr, 'markForCheck');
      
      component.setDisabledState(true);
      expect(cdr.markForCheck).toHaveBeenCalled();
    });
  });
});
