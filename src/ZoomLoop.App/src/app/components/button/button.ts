import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger' | 'warning';
export type ButtonSize = 'normal' | 'large' | 'small';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'zl-button',
  standalone: true,
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Button {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'normal';
  @Input() block = false;
  @Input() disabled = false;
  @Input() type: ButtonType = 'button';
  @Input() ariaLabel?: string;

  @Output() buttonClick = new EventEmitter<MouseEvent>();

  protected get classes(): string {
    const classes = ['btn'];

    classes.push(`btn--${this.variant}`);

    if (this.size === 'large') {
      classes.push('btn--large');
    } else if (this.size === 'small') {
      classes.push('btn--small');
    }

    if (this.block) {
      classes.push('btn--block');
    }

    if (this.disabled) {
      classes.push('btn--disabled');
    }

    return classes.join(' ');
  }

  protected handleClick(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    this.buttonClick.emit(event);
  }
}
