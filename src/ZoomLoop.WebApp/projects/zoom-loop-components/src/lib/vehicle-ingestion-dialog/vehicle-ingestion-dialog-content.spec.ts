// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  VehicleIngestionDialogContent,
  VehicleIngestionDialogContentData,
  VehicleIngestionDialogResult
} from './vehicle-ingestion-dialog-content';

describe('VehicleIngestionDialogContent', () => {
  let component: VehicleIngestionDialogContent;
  let fixture: ComponentFixture<VehicleIngestionDialogContent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<VehicleIngestionDialogContent, VehicleIngestionDialogResult>>;

  const defaultData: VehicleIngestionDialogContentData = {
    maxImages: 20,
    maxFileSizeMB: 10,
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp']
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [VehicleIngestionDialogContent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: defaultData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleIngestionDialogContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should use maxImages from data', () => {
      expect(component.maxImages).toBe(20);
    });

    it('should use maxFileSizeMB from data', () => {
      expect(component.maxFileSizeMB).toBe(10);
    });

    it('should use acceptedFormats from data', () => {
      expect(component.acceptedFormats).toEqual(['image/jpeg', 'image/png', 'image/webp']);
    });

    it('should initialize with idle processing step', () => {
      expect(component.processingStep).toBe('idle');
    });

    it('should initialize with empty uploaded images', () => {
      expect(component.uploadedImages).toEqual([]);
    });
  });

  describe('modalTitle', () => {
    it('should return "Vehicle Ingestion" for idle state', () => {
      component.processingStep = 'idle';
      component.result = null;
      component.error = null;
      expect(component.modalTitle).toBe('Vehicle Ingestion');
    });

    it('should return "Processing Vehicle..." for processing state', () => {
      component.processingStep = 'uploading';
      expect(component.modalTitle).toBe('Processing Vehicle...');
    });

    it('should return "Vehicle Ingested Successfully" for completed state with result', () => {
      component.processingStep = 'completed';
      component.result = {
        vehicleId: '123',
        vin: '1HGCV1F19MA123456',
        year: 2021,
        make: 'Honda',
        model: 'Accord',
        doors: 4,
        interiorCondition: 'Good',
        exteriorCondition: 'Excellent',
        description: 'A nice car',
        images: []
      };
      expect(component.modalTitle).toBe('Vehicle Ingested Successfully');
    });

    it('should return "Unable to Extract VIN" for failed state', () => {
      component.processingStep = 'failed';
      expect(component.modalTitle).toBe('Unable to Extract VIN');
    });

    it('should return "Unable to Extract VIN" when error is set', () => {
      component.error = { code: 'VIN_NOT_FOUND', message: 'VIN not found', retryable: true };
      expect(component.modalTitle).toBe('Unable to Extract VIN');
    });
  });

  describe('isProcessing', () => {
    it('should return true for uploading step', () => {
      component.processingStep = 'uploading';
      expect(component.isProcessing).toBe(true);
    });

    it('should return true for extracting_vin step', () => {
      component.processingStep = 'extracting_vin';
      expect(component.isProcessing).toBe(true);
    });

    it('should return true for analyzing_condition step', () => {
      component.processingStep = 'analyzing_condition';
      expect(component.isProcessing).toBe(true);
    });

    it('should return true for generating_description step', () => {
      component.processingStep = 'generating_description';
      expect(component.isProcessing).toBe(true);
    });

    it('should return true for saving step', () => {
      component.processingStep = 'saving';
      expect(component.isProcessing).toBe(true);
    });

    it('should return false for idle step', () => {
      component.processingStep = 'idle';
      expect(component.isProcessing).toBe(false);
    });

    it('should return false for completed step', () => {
      component.processingStep = 'completed';
      expect(component.isProcessing).toBe(false);
    });

    it('should return false for failed step', () => {
      component.processingStep = 'failed';
      expect(component.isProcessing).toBe(false);
    });
  });

  describe('canStartIngestion', () => {
    it('should return false when no images are uploaded', () => {
      component.uploadedImages = [];
      expect(component.canStartIngestion).toBe(false);
    });

    it('should return false when processing', () => {
      component.uploadedImages = [createMockImage()];
      component.processingStep = 'uploading';
      expect(component.canStartIngestion).toBe(false);
    });

    it('should return false when loading', () => {
      component.uploadedImages = [createMockImage()];
      component.isLoading = true;
      expect(component.canStartIngestion).toBe(false);
    });

    it('should return true when images are uploaded and not processing', () => {
      component.uploadedImages = [createMockImage()];
      component.processingStep = 'idle';
      component.isLoading = false;
      expect(component.canStartIngestion).toBe(true);
    });
  });

  describe('isValidVIN', () => {
    it('should return false for empty VIN', () => {
      component.manualVIN = '';
      expect(component.isValidVIN).toBe(false);
    });

    it('should return false for VIN with wrong length', () => {
      component.manualVIN = '1HGCV1F19MA1234';
      expect(component.isValidVIN).toBe(false);
    });

    it('should return false for VIN with invalid characters (I, O, Q)', () => {
      component.manualVIN = '1IGCV1F19MA123456';
      expect(component.isValidVIN).toBe(false);
    });

    it('should return true for valid 17-character VIN', () => {
      component.manualVIN = '1HGCV1F19MA123456';
      expect(component.isValidVIN).toBe(true);
    });

    it('should handle lowercase VIN', () => {
      component.manualVIN = '1hgcv1f19ma123456';
      expect(component.isValidVIN).toBe(true);
    });
  });

  describe('acceptedFormatsText', () => {
    it('should format accepted formats correctly', () => {
      expect(component.acceptedFormatsText).toBe('JPEG, PNG, WEBP');
    });
  });

  describe('processingSteps', () => {
    it('should return all steps with correct status', () => {
      component.processingStep = 'analyzing_condition';
      const steps = component.processingSteps;

      expect(steps.length).toBe(5);
      expect(steps[0].status).toBe('completed'); // uploading
      expect(steps[1].status).toBe('completed'); // extracting_vin
      expect(steps[2].status).toBe('active'); // analyzing_condition
      expect(steps[3].status).toBe('pending'); // generating_description
      expect(steps[4].status).toBe('pending'); // saving
    });
  });

  describe('actions', () => {
    it('should close dialog with cancelled action on onClose when not processing', () => {
      component.processingStep = 'idle';
      component.onClose();
      expect(dialogRefSpy.close).toHaveBeenCalledWith({ action: 'cancelled' });
    });

    it('should not close dialog on onClose when processing', () => {
      component.processingStep = 'uploading';
      component.onClose();
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('should close dialog with ingestion-started action on startIngestion', () => {
      const mockImage = createMockImage();
      component.uploadedImages = [mockImage];
      component.processingStep = 'idle';
      component.isLoading = false;

      component.startIngestion();

      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        action: 'ingestion-started',
        ingestionStarted: { imageCount: 1 },
        images: [mockImage.file]
      });
    });

    it('should not start ingestion when canStartIngestion is false', () => {
      component.uploadedImages = [];
      component.startIngestion();
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('should close dialog with cancelled action on cancelIngestion', () => {
      component.processingStep = 'uploading';
      component.cancelIngestion();

      expect(component.processingStep).toBe('idle');
      expect(dialogRefSpy.close).toHaveBeenCalledWith({ action: 'cancelled' });
    });

    it('should close dialog with save-and-view action on onSaveAndView', () => {
      const result = {
        vehicleId: '123',
        vin: '1HGCV1F19MA123456',
        year: 2021,
        make: 'Honda',
        model: 'Accord',
        doors: 4,
        interiorCondition: 'Good' as const,
        exteriorCondition: 'Excellent' as const,
        description: 'A nice car',
        images: []
      };
      component.result = result;

      component.onSaveAndView();

      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        action: 'save-and-view',
        result
      });
    });

    it('should close dialog with manual VIN on submitManualVIN', () => {
      component.manualVIN = '1HGCV1F19MA123456';
      component.uploadedImages = [createMockImage()];

      component.submitManualVIN();

      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        action: 'ingestion-started',
        manualVIN: '1HGCV1F19MA123456',
        images: [component.uploadedImages[0].file]
      });
    });
  });

  describe('image management', () => {
    it('should remove image by id', () => {
      const image1 = createMockImage('1');
      const image2 = createMockImage('2');
      component.uploadedImages = [image1, image2];

      component.removeImage('1');

      expect(component.uploadedImages.length).toBe(1);
      expect(component.uploadedImages[0].id).toBe('2');
    });

    it('should reorder images correctly after removal', () => {
      const image1 = createMockImage('1');
      const image2 = createMockImage('2');
      component.uploadedImages = [image1, image2];

      component.removeImage('1');

      expect(component.uploadedImages[0].order).toBe(0);
    });

    it('should move image to new position', () => {
      const image1 = createMockImage('1');
      const image2 = createMockImage('2');
      const image3 = createMockImage('3');
      component.uploadedImages = [image1, image2, image3];

      component.moveImage(0, 2);

      expect(component.uploadedImages[0].id).toBe('2');
      expect(component.uploadedImages[1].id).toBe('3');
      expect(component.uploadedImages[2].id).toBe('1');
    });

    it('should not move image to invalid position', () => {
      const image1 = createMockImage('1');
      const image2 = createMockImage('2');
      component.uploadedImages = [image1, image2];

      component.moveImage(0, -1);

      expect(component.uploadedImages[0].id).toBe('1');
      expect(component.uploadedImages[1].id).toBe('2');
    });
  });

  describe('manual entry', () => {
    it('should enable manual entry', () => {
      expect(component.isManualEntry).toBe(false);
      component.enableManualEntry();
      expect(component.isManualEntry).toBe(true);
    });

    it('should reset state on retryWithNewImages', () => {
      component.uploadedImages = [createMockImage()];
      component.error = { code: 'VIN_NOT_FOUND', message: 'Error', retryable: true };
      component.isManualEntry = true;
      component.manualVIN = '12345';

      component.retryWithNewImages();

      expect(component.uploadedImages).toEqual([]);
      expect(component.error).toBeNull();
      expect(component.isManualEntry).toBe(false);
      expect(component.manualVIN).toBe('');
      expect(component.processingStep).toBe('idle');
    });
  });

  describe('getConditionBadgeVariant', () => {
    it('should return success for Excellent', () => {
      expect(component.getConditionBadgeVariant('Excellent')).toBe('success');
    });

    it('should return info for Good', () => {
      expect(component.getConditionBadgeVariant('Good')).toBe('info');
    });

    it('should return warning for Fair', () => {
      expect(component.getConditionBadgeVariant('Fair')).toBe('warning');
    });

    it('should return danger for Poor', () => {
      expect(component.getConditionBadgeVariant('Poor')).toBe('danger');
    });
  });

  describe('processing state management', () => {
    it('should set processing step', () => {
      component.setProcessingStep('extracting_vin');
      expect(component.processingStep).toBe('extracting_vin');
    });

    it('should set processing progress within bounds', () => {
      component.setProcessingProgress(50);
      expect(component.processingProgress).toBe(50);

      component.setProcessingProgress(150);
      expect(component.processingProgress).toBe(100);

      component.setProcessingProgress(-10);
      expect(component.processingProgress).toBe(0);
    });

    it('should set result and update state', () => {
      const result = {
        vehicleId: '123',
        vin: '1HGCV1F19MA123456',
        year: 2021,
        make: 'Honda',
        model: 'Accord',
        doors: 4,
        interiorCondition: 'Good' as const,
        exteriorCondition: 'Excellent' as const,
        description: 'A nice car',
        images: []
      };

      component.setResult(result);

      expect(component.result).toEqual(result);
      expect(component.processingStep).toBe('completed');
      expect(component.processingProgress).toBe(100);
    });

    it('should set error and update state', () => {
      const error = { code: 'VIN_NOT_FOUND' as const, message: 'VIN not found', retryable: true };

      component.setError(error);

      expect(component.error).toEqual(error);
      expect(component.processingStep).toBe('failed');
    });
  });

  function createMockImage(id = 'test-id'): any {
    return {
      id,
      file: new File([''], 'test.jpg', { type: 'image/jpeg' }),
      preview: 'data:image/jpeg;base64,',
      uploadProgress: 0,
      isUploaded: false,
      order: 0
    };
  }
});
