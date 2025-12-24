// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'neutral';
export type ToastPosition = 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

@Component({
  selector: 'zl-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() type: ToastType = 'info';
  @Input() title = '';
  @Input() message = '';
  @Input() actions: ToastAction[] = [];
  @Input() dismissible = true;
  @Input() duration = 5000;
  @Input() showProgress = false;
  @Input() autoDismiss = true;

  @Output() dismissed = new EventEmitter<void>();

  isExiting = false;
  private dismissTimeout?: ReturnType<typeof setTimeout>;

  get toastClasses(): string {
    const classes = ['toast', `toast--${this.type}`];
    if (this.isExiting) classes.push('toast--exiting');
    return classes.join(' ');
  }

  ngOnInit(): void {
    if (this.autoDismiss && this.duration > 0) {
      this.dismissTimeout = setTimeout(() => {
        this.dismiss();
      }, this.duration);
    }
  }

  ngOnDestroy(): void {
    if (this.dismissTimeout) {
      clearTimeout(this.dismissTimeout);
    }
  }

  dismiss(): void {
    this.isExiting = true;
    setTimeout(() => {
      this.dismissed.emit();
    }, 300);
  }
}
