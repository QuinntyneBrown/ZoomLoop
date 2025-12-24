// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VehicleIngestionDialogContent, VehicleIngestionDialogContentData } from './vehicle-ingestion-dialog-content';

const mockDialogRef = {
  close: () => {}
};

const meta: Meta<VehicleIngestionDialogContent> = {
  title: 'Components/Dialogs/VehicleIngestionDialogContent (MatDialog)',
  component: VehicleIngestionDialogContent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
    })
  ],
  parameters: {
    docs: {
      description: {
        component: `
The VehicleIngestionDialogContent component is designed to work with Angular Material's MatDialog.
It provides the same functionality as the standard VehicleIngestionDialog but is meant to be opened
programmatically using the DialogService.

## Features
- Drag and drop image upload
- Automatic VIN extraction from images
- Multi-step processing with progress indication
- Manual VIN entry fallback
- Image reordering and management

## Usage with DialogService

\`\`\`typescript
import { DialogService, VehicleIngestionDialogContent, VehicleIngestionDialogResult } from 'zoom-loop-components';

@Component({...})
export class MyComponent {
  constructor(private dialogService: DialogService) {}

  openIngestionDialog() {
    const { afterClosed } = this.dialogService.open<VehicleIngestionDialogContent, VehicleIngestionDialogContentData, VehicleIngestionDialogResult>(
      VehicleIngestionDialogContent,
      {
        data: { maxImages: 20, maxFileSizeMB: 10 },
        size: 'lg'
      }
    );

    afterClosed().subscribe(result => {
      if (result?.action === 'save-and-view') {
        this.router.navigate(['/vehicles', result.result.vehicleId]);
      }
    });
  }
}
\`\`\`
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj<VehicleIngestionDialogContent>;

export const Default: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            maxImages: 20,
            maxFileSizeMB: 10,
            acceptedFormats: ['image/jpeg', 'image/png', 'image/webp']
          } as VehicleIngestionDialogContentData
        }
      ]
    })
  ]
};

export const WithCustomLimits: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            maxImages: 5,
            maxFileSizeMB: 5,
            acceptedFormats: ['image/jpeg', 'image/png']
          } as VehicleIngestionDialogContentData
        }
      ]
    })
  ]
};
