// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Inject, Optional, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';
import { ButtonComponent } from '../button/button.component';
import { BadgeComponent } from '../badge/badge.component';
import {
  ProcessingStep,
  ConditionRating,
  UploadedImage,
  IngestionResult,
  IngestionError,
  IngestionStartedEvent,
  IngestionCompletedEvent,
  IngestionFailedEvent
} from './vehicle-ingestion-dialog.types';

/**
 * Configuration data for the VehicleIngestionDialogContent component.
 */
export interface VehicleIngestionDialogContentData {
  /** Maximum number of images allowed */
  maxImages?: number;
  /** Maximum file size in MB */
  maxFileSizeMB?: number;
  /** Accepted file formats */
  acceptedFormats?: string[];
}

/**
 * Result returned when the dialog is closed.
 */
export interface VehicleIngestionDialogResult {
  /** The action that was taken */
  action: 'ingestion-started' | 'ingestion-completed' | 'save-and-view' | 'ingest-another' | 'cancelled';
  /** Ingestion started event data */
  ingestionStarted?: IngestionStartedEvent;
  /** Ingestion completed event data */
  ingestionCompleted?: IngestionCompletedEvent;
  /** Ingestion failed event data */
  ingestionFailed?: IngestionFailedEvent;
  /** The ingestion result */
  result?: IngestionResult;
  /** Selected images */
  images?: File[];
  /** Manual VIN if entered */
  manualVIN?: string;
}

/**
 * VehicleIngestionDialogContent is the content component for the vehicle ingestion dialog
 * that works with Angular Material's MatDialog.
 *
 * @example
 * ```typescript
 * const dialogRef = this.dialogService.open(VehicleIngestionDialogContent, {
 *   data: { maxImages: 20, maxFileSizeMB: 10 },
 *   size: 'lg'
 * });
 *
 * dialogRef.afterClosed().subscribe(result => {
 *   if (result?.action === 'save-and-view') {
 *     this.router.navigate(['/vehicles', result.result.vehicleId]);
 *   }
 * });
 * ```
 */
@Component({
  selector: 'zl-vehicle-ingestion-dialog-content',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, ButtonComponent, BadgeComponent],
  templateUrl: './vehicle-ingestion-dialog-content.html',
  styleUrl: './vehicle-ingestion-dialog-content.scss'
})
export class VehicleIngestionDialogContent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  maxImages: number;
  maxFileSizeMB: number;
  acceptedFormats: string[];
  isLoading = false;

  uploadedImages: UploadedImage[] = [];
  processingStep: ProcessingStep = 'idle';
  processingProgress = 0;
  estimatedTimeRemaining: number | null = null;
  result: IngestionResult | null = null;
  error: IngestionError | null = null;
  manualVIN = '';
  isManualEntry = false;
  isDragOver = false;
  uploadError = '';
  private startTime: number | null = null;
  private dragCounter = 0;

  constructor(
    @Optional() private dialogRef: MatDialogRef<VehicleIngestionDialogContent, VehicleIngestionDialogResult>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: VehicleIngestionDialogContentData
  ) {
    this.maxImages = data?.maxImages ?? 20;
    this.maxFileSizeMB = data?.maxFileSizeMB ?? 10;
    this.acceptedFormats = data?.acceptedFormats ?? ['image/jpeg', 'image/png', 'image/webp'];
  }

  get modalTitle(): string {
    if (this.processingStep === 'completed' && this.result) {
      return 'Vehicle Ingested Successfully';
    }
    if (this.processingStep === 'failed' || this.error) {
      return 'Unable to Extract VIN';
    }
    if (this.isProcessing) {
      return 'Processing Vehicle...';
    }
    return 'Vehicle Ingestion';
  }

  get isProcessing(): boolean {
    return ['uploading', 'extracting_vin', 'analyzing_condition', 'generating_description', 'saving'].includes(this.processingStep);
  }

  get canStartIngestion(): boolean {
    return this.uploadedImages.length >= 1 && !this.isProcessing && !this.isLoading;
  }

  get isValidVIN(): boolean {
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i;
    return vinRegex.test(this.manualVIN.trim());
  }

  get acceptedFormatsText(): string {
    return this.acceptedFormats
      .map(f => f.replace('image/', '').toUpperCase())
      .join(', ');
  }

  get processingSteps(): { step: ProcessingStep; label: string; status: 'completed' | 'active' | 'pending' }[] {
    const steps: { step: ProcessingStep; label: string }[] = [
      { step: 'uploading', label: 'Uploading images' },
      { step: 'extracting_vin', label: 'Extracting VIN from images' },
      { step: 'analyzing_condition', label: 'Analyzing vehicle condition' },
      { step: 'generating_description', label: 'Generating description' },
      { step: 'saving', label: 'Saving vehicle' }
    ];

    const currentIndex = steps.findIndex(s => s.step === this.processingStep);

    return steps.map((s, index) => ({
      ...s,
      status: index < currentIndex ? 'completed' : index === currentIndex ? 'active' : 'pending'
    }));
  }

  onClose(): void {
    if (this.isProcessing) {
      return;
    }
    this.dialogRef?.close({ action: 'cancelled' });
  }

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragCounter++;
    if (event.dataTransfer?.types.includes('Files')) {
      this.isDragOver = true;
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter === 0) {
      this.isDragOver = false;
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    this.dragCounter = 0;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
      input.value = '';
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  handleFiles(files: File[]): void {
    this.uploadError = '';

    const imageFiles = files.filter(f => this.acceptedFormats.includes(f.type));

    if (imageFiles.length !== files.length) {
      this.uploadError = `Some files were skipped. Supported formats: ${this.acceptedFormatsText}`;
    }

    const maxSizeBytes = this.maxFileSizeMB * 1024 * 1024;
    const validSizeFiles = imageFiles.filter(f => f.size <= maxSizeBytes);

    if (validSizeFiles.length !== imageFiles.length) {
      this.uploadError = `Some files exceeded ${this.maxFileSizeMB}MB limit and were skipped.`;
    }

    const availableSlots = this.maxImages - this.uploadedImages.length;
    const filesToAdd = validSizeFiles.slice(0, availableSlots);

    if (validSizeFiles.length > availableSlots) {
      this.uploadError = `Only ${availableSlots} more image(s) can be added. Maximum is ${this.maxImages}.`;
    }

    filesToAdd.forEach((file) => {
      const id = this.generateId();
      const reader = new FileReader();

      reader.onload = (e) => {
        const preview = e.target?.result as string;
        this.uploadedImages.push({
          id,
          file,
          preview,
          uploadProgress: 0,
          isUploaded: false,
          order: this.uploadedImages.length
        });
      };

      reader.readAsDataURL(file);
    });
  }

  removeImage(imageId: string): void {
    const index = this.uploadedImages.findIndex(img => img.id === imageId);
    if (index > -1) {
      this.uploadedImages.splice(index, 1);
      this.uploadedImages.forEach((img, i) => {
        img.order = i;
      });
    }
  }

  moveImage(fromIndex: number, toIndex: number): void {
    if (toIndex < 0 || toIndex >= this.uploadedImages.length) return;

    const [movedImage] = this.uploadedImages.splice(fromIndex, 1);
    this.uploadedImages.splice(toIndex, 0, movedImage);

    this.uploadedImages.forEach((img, i) => {
      img.order = i;
    });
  }

  startIngestion(): void {
    if (!this.canStartIngestion) return;

    this.startTime = Date.now();
    this.processingStep = 'uploading';
    this.processingProgress = 0;
    this.error = null;
    this.result = null;

    // Emit the ingestion started event via dialog result
    // The parent component should handle the actual ingestion logic
    this.dialogRef?.close({
      action: 'ingestion-started',
      ingestionStarted: { imageCount: this.uploadedImages.length },
      images: this.uploadedImages.map(img => img.file)
    });
  }

  cancelIngestion(): void {
    this.processingStep = 'idle';
    this.processingProgress = 0;
    this.dialogRef?.close({ action: 'cancelled' });
  }

  setProcessingStep(step: ProcessingStep): void {
    this.processingStep = step;
  }

  setProcessingProgress(progress: number): void {
    this.processingProgress = Math.min(100, Math.max(0, progress));

    if (this.startTime && progress > 0 && progress < 100) {
      const elapsed = Date.now() - this.startTime;
      const estimated = (elapsed / progress) * (100 - progress);
      this.estimatedTimeRemaining = Math.round(estimated / 1000);
    }
  }

  setResult(result: IngestionResult): void {
    this.result = result;
    this.processingStep = 'completed';
    this.processingProgress = 100;
  }

  setError(error: IngestionError): void {
    this.error = error;
    this.processingStep = 'failed';
  }

  retryWithNewImages(): void {
    this.uploadedImages = [];
    this.error = null;
    this.isManualEntry = false;
    this.manualVIN = '';
    this.processingStep = 'idle';
  }

  enableManualEntry(): void {
    this.isManualEntry = true;
  }

  submitManualVIN(): void {
    if (this.isValidVIN) {
      this.dialogRef?.close({
        action: 'ingestion-started',
        manualVIN: this.manualVIN.trim().toUpperCase(),
        images: this.uploadedImages.map(img => img.file)
      });
    }
  }

  onSaveAndView(): void {
    if (this.result) {
      this.dialogRef?.close({
        action: 'save-and-view',
        result: this.result
      });
    }
  }

  onIngestAnother(): void {
    this.resetState();
    // Keep dialog open but reset state
  }

  getConditionBadgeVariant(condition: ConditionRating): 'success' | 'info' | 'warning' | 'danger' {
    switch (condition) {
      case 'Excellent':
        return 'success';
      case 'Good':
        return 'info';
      case 'Fair':
        return 'warning';
      case 'Poor':
        return 'danger';
      default:
        return 'info';
    }
  }

  private resetState(): void {
    this.uploadedImages = [];
    this.processingStep = 'idle';
    this.processingProgress = 0;
    this.estimatedTimeRemaining = null;
    this.result = null;
    this.error = null;
    this.manualVIN = '';
    this.isManualEntry = false;
    this.isDragOver = false;
    this.uploadError = '';
    this.startTime = null;
    this.dragCounter = 0;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }
}
