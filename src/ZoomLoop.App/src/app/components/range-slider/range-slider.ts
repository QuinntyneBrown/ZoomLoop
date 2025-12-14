import {
  Component,
  Input,
  forwardRef,
  ViewChild,
  ElementRef,
  HostListener,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

export interface RangeValue {
  low: number;
  high: number;
}

@Component({
  selector: 'zl-range-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './range-slider.html',
  styleUrls: ['./range-slider.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeSlider),
      multi: true
    }
  ]
})
export class RangeSlider implements ControlValueAccessor, OnDestroy {
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  @Input() label: string = '';

  @ViewChild('track', { static: true }) trackRef!: ElementRef<HTMLDivElement>;

  private _disabled = signal(false);
  private _value = signal<RangeValue>({ low: 0, high: 100 });
  private isDragging: 'low' | 'high' | null = null;
  private onChange: (value: RangeValue) => void = () => {};
  private onTouched: () => void = () => {};

  readonly disabled = computed(() => this._disabled());
  readonly value = computed(() => this._value());

  readonly lowPercent = computed(() => {
    const val = this._value();
    return ((val.low - this.min) / (this.max - this.min)) * 100;
  });

  readonly highPercent = computed(() => {
    const val = this._value();
    return ((val.high - this.min) / (this.max - this.min)) * 100;
  });

  readonly rangePercent = computed(() => {
    return this.highPercent() - this.lowPercent();
  });

  constructor(private cdr: ChangeDetectorRef) {}

  setValue(val: RangeValue): void {
    const current = this._value();
    if (val && (val.low !== current.low || val.high !== current.high)) {
      this._value.set(this.clampValue(val));
      this.onChange(this._value());
      this.cdr.markForCheck();
    }
  }

  writeValue(value: RangeValue): void {
    if (value) {
      this._value.set(this.clampValue(value));
      this.cdr.markForCheck();
    }
  }

  registerOnChange(fn: (value: RangeValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
    this.cdr.markForCheck();
  }

  onThumbMouseDown(thumb: 'low' | 'high', event: MouseEvent): void {
    if (this._disabled()) return;
    event.preventDefault();
    this.isDragging = thumb;
    this.onTouched();
  }

  onThumbTouchStart(thumb: 'low' | 'high', event: TouchEvent): void {
    if (this._disabled()) return;
    event.preventDefault();
    this.isDragging = thumb;
    this.onTouched();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging && !this._disabled()) {
      this.updateValue(event.clientX);
    }
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (this.isDragging && !this._disabled()) {
      event.preventDefault();
      this.updateValue(event.touches[0].clientX);
    }
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  onDragEnd(): void {
    this.isDragging = null;
  }

  onTrackClick(event: MouseEvent): void {
    if (this._disabled()) return;
    const value = this.getValueFromPosition(event.clientX);
    const current = this._value();
    const midPoint = (current.low + current.high) / 2;

    if (value < midPoint) {
      this.setValue({ ...current, low: value });
    } else {
      this.setValue({ ...current, high: value });
    }
  }

  private updateValue(clientX: number): void {
    const value = this.getValueFromPosition(clientX);
    const current = this._value();

    if (this.isDragging === 'low') {
      this.setValue({
        low: Math.min(value, current.high),
        high: current.high
      });
    } else if (this.isDragging === 'high') {
      this.setValue({
        low: current.low,
        high: Math.max(value, current.low)
      });
    }
  }

  private getValueFromPosition(clientX: number): number {
    const rect = this.trackRef.nativeElement.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = this.min + percent * (this.max - this.min);
    return Math.round(rawValue / this.step) * this.step;
  }

  private clampValue(value: RangeValue): RangeValue {
    return {
      low: Math.max(this.min, Math.min(value.low, this.max)),
      high: Math.max(this.min, Math.min(value.high, this.max))
    };
  }

  ngOnDestroy(): void {
    this.isDragging = null;
  }
}
