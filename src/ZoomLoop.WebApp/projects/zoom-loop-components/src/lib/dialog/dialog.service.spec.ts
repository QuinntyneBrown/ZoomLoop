// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DialogService, ZlDialogConfig } from './dialog.service';

@Component({
  selector: 'test-dialog-content',
  standalone: true,
  template: '<div>Test Dialog Content</div>'
})
class TestDialogContentComponent {}

describe('DialogService', () => {
  let service: DialogService;
  let matDialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, NoopAnimationsModule, TestDialogContentComponent],
      providers: [DialogService]
    }).compileComponents();

    service = TestBed.inject(DialogService);
    matDialog = TestBed.inject(MatDialog);
  });

  afterEach(() => {
    service.closeAll();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('open', () => {
    it('should open a dialog with the specified component', () => {
      const result = service.open(TestDialogContentComponent);

      expect(result.dialogRef).toBeTruthy();
      expect(result.dialogRef).toBeInstanceOf(MatDialogRef);
    });

    it('should apply default panel classes', () => {
      const result = service.open(TestDialogContentComponent);
      const panelClass = (result.dialogRef as any)._containerInstance._config.panelClass;

      expect(panelClass).toContain('zl-dialog');
      expect(panelClass).toContain('zl-dialog--md');
    });

    it('should apply size-based panel class when size is specified', () => {
      const config: ZlDialogConfig = { size: 'lg' };
      const result = service.open(TestDialogContentComponent, config);
      const panelClass = (result.dialogRef as any)._containerInstance._config.panelClass;

      expect(panelClass).toContain('zl-dialog');
      expect(panelClass).toContain('zl-dialog--lg');
    });

    it('should apply custom panel classes', () => {
      const config: ZlDialogConfig = { panelClass: 'custom-class' };
      const result = service.open(TestDialogContentComponent, config);
      const panelClass = (result.dialogRef as any)._containerInstance._config.panelClass;

      expect(panelClass).toContain('custom-class');
    });

    it('should apply multiple custom panel classes when array is provided', () => {
      const config: ZlDialogConfig = { panelClass: ['class1', 'class2'] };
      const result = service.open(TestDialogContentComponent, config);
      const panelClass = (result.dialogRef as any)._containerInstance._config.panelClass;

      expect(panelClass).toContain('class1');
      expect(panelClass).toContain('class2');
    });

    it('should pass data to the dialog', () => {
      const testData = { message: 'Hello' };
      const config: ZlDialogConfig<typeof testData> = { data: testData };
      const result = service.open(TestDialogContentComponent, config);
      const dialogData = (result.dialogRef as any)._containerInstance._config.data;

      expect(dialogData).toEqual(testData);
    });

    it('should return close method that closes the dialog', (done) => {
      const result = service.open(TestDialogContentComponent);
      const closedResult = 'test-result';

      result.afterClosed().subscribe((res) => {
        expect(res).toBe(closedResult);
        done();
      });

      result.close(closedResult);
    });

    it('should return afterClosed observable', (done) => {
      const result = service.open(TestDialogContentComponent);

      result.afterClosed().subscribe(() => {
        done();
      });

      result.close();
    });
  });

  describe('closeAll', () => {
    it('should close all open dialogs', () => {
      service.open(TestDialogContentComponent);
      service.open(TestDialogContentComponent);

      expect(service.openDialogs).toBe(2);

      service.closeAll();

      expect(service.openDialogs).toBe(0);
    });
  });

  describe('openDialogs', () => {
    it('should return the number of open dialogs', () => {
      expect(service.openDialogs).toBe(0);

      service.open(TestDialogContentComponent);
      expect(service.openDialogs).toBe(1);

      service.open(TestDialogContentComponent);
      expect(service.openDialogs).toBe(2);
    });
  });

  describe('size configurations', () => {
    const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const;

    sizes.forEach((size) => {
      it(`should apply correct panel class for size: ${size}`, () => {
        const result = service.open(TestDialogContentComponent, { size });
        const panelClass = (result.dialogRef as any)._containerInstance._config.panelClass;

        expect(panelClass).toContain(`zl-dialog--${size}`);
      });
    });
  });
});
