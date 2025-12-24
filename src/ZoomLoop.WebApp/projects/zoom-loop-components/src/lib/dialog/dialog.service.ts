// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

/**
 * Configuration options for opening a dialog.
 */
export interface ZlDialogConfig<D = unknown> extends Omit<MatDialogConfig<D>, 'panelClass'> {
  /** Size of the dialog: 'sm', 'md', 'lg', 'xl', or 'full' */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Additional CSS classes to add to the dialog panel */
  panelClass?: string | string[];
}

/**
 * Result from opening a dialog.
 */
export interface ZlDialogRef<T, R = unknown> {
  /** Reference to the Angular Material dialog */
  dialogRef: MatDialogRef<T, R>;
  /** Observable that emits when the dialog is closed, with the result if any */
  afterClosed: () => Observable<R | undefined>;
  /** Method to close the dialog programmatically */
  close: (result?: R) => void;
}

/**
 * DialogService provides a simplified API for opening Material dialogs
 * with consistent styling and behavior across the ZoomLoop application.
 *
 * @example
 * ```typescript
 * // Open a login dialog
 * const { afterClosed } = this.dialogService.openLoginDialog();
 * afterClosed().subscribe(result => {
 *   if (result) {
 *     console.log('Login successful:', result);
 *   }
 * });
 *
 * // Open a custom component dialog
 * const { afterClosed } = this.dialogService.open(MyComponent, {
 *   data: { myData: 'value' },
 *   size: 'lg'
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  /**
   * Opens a dialog with the specified component.
   *
   * @param component The component to render inside the dialog
   * @param config Optional configuration for the dialog
   * @returns A reference object with methods to interact with the dialog
   */
  open<T, D = unknown, R = unknown>(
    component: Type<T>,
    config?: ZlDialogConfig<D>
  ): ZlDialogRef<T, R> {
    const panelClasses = this.buildPanelClasses(config?.size, config?.panelClass);

    const matConfig: MatDialogConfig<D> = {
      ...config,
      panelClass: panelClasses,
      autoFocus: config?.autoFocus ?? 'first-tabbable',
      restoreFocus: config?.restoreFocus ?? true
    };

    const dialogRef = this.dialog.open<T, D, R>(component, matConfig);

    return {
      dialogRef,
      afterClosed: () => dialogRef.afterClosed(),
      close: (result?: R) => dialogRef.close(result)
    };
  }

  /**
   * Closes all open dialogs.
   */
  closeAll(): void {
    this.dialog.closeAll();
  }

  /**
   * Gets the number of currently open dialogs.
   */
  get openDialogs(): number {
    return this.dialog.openDialogs.length;
  }

  /**
   * Builds the panel class array for the dialog based on size and custom classes.
   */
  private buildPanelClasses(size?: string, customClasses?: string | string[]): string[] {
    const classes = ['zl-dialog'];

    if (size) {
      classes.push(`zl-dialog--${size}`);
    } else {
      classes.push('zl-dialog--md');
    }

    if (customClasses) {
      if (Array.isArray(customClasses)) {
        classes.push(...customClasses);
      } else {
        classes.push(customClasses);
      }
    }

    return classes;
  }
}
