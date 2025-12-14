// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogRef } from '@angular/cdk/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VehicleService } from '../../core';
import { Vehicle } from '../../models';

@Component({
  selector: 'zl-vehicle-image-drop-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './vehicle-image-drop-dialog.html',
  styleUrls: ['./vehicle-image-drop-dialog.scss']
})
export class VehicleImageDropDialog {
  private readonly _dialogRef = inject(DialogRef);
  private readonly _vehicleService = inject(VehicleService);

  isDragging = signal(false);
  isUploading = signal(false);
  uploadedFiles = signal<File[]>([]);
  errorMessage = signal<string | null>(null);
  previewUrls = signal<string[]>([]);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }

  handleFiles(fileList: FileList) {
    const files = Array.from(fileList).filter(file => file.type.startsWith('image/'));
    
    if (files.length === 0) {
      this.errorMessage.set('Please select valid image files');
      return;
    }

    this.uploadedFiles.set(files);
    this.errorMessage.set(null);

    // Create preview URLs
    const urls: string[] = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        urls.push(e.target?.result as string);
        this.previewUrls.set([...urls]);
      };
      reader.readAsDataURL(file);
    });
  }

  removeFile(index: number) {
    this.uploadedFiles.update(files => files.filter((_, i) => i !== index));
    this.previewUrls.update(urls => urls.filter((_, i) => i !== index));
  }

  async submit() {
    const files = this.uploadedFiles();
    if (files.length === 0) {
      this.errorMessage.set('Please select at least one image');
      return;
    }

    this.isUploading.set(true);
    this.errorMessage.set(null);

    try {
      const response = await this._vehicleService.ingestVehicle(files).toPromise();
      this._dialogRef.close(response?.vehicle);
    } catch (error: any) {
      console.error('Error uploading vehicle images:', error);
      const errorMsg = error?.error?.message || error?.message || 'Failed to upload images. Please try again.';
      this.errorMessage.set(errorMsg);
      this.isUploading.set(false);
    }
  }

  close() {
    this._dialogRef.close();
  }
}
