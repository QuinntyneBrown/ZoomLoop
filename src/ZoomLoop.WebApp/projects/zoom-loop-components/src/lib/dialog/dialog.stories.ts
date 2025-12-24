// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import type { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { moduleMetadata } from '@storybook/angular';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogService } from './dialog.service';
import { ButtonComponent } from '../button/button.component';
import { LoginDialogContent } from '../login-dialog/login-dialog-content';
import { VehicleIngestionDialogContent } from '../vehicle-ingestion-dialog/vehicle-ingestion-dialog-content';

@Component({
  selector: 'dialog-service-demo',
  standalone: true,
  imports: [ButtonComponent, MatDialogModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px; padding: 20px;">
      <h2 style="margin: 0;">DialogService Demo</h2>
      <p style="color: #666; margin: 0;">
        The DialogService provides a simplified API for opening Material dialogs
        with consistent styling and behavior.
      </p>

      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <zl-button variant="primary" (click)="openLoginDialog()">
          Open Login Dialog
        </zl-button>
        <zl-button variant="outline" (click)="openRegisterDialog()">
          Open Register Dialog
        </zl-button>
        <zl-button variant="secondary" (click)="openIngestionDialog()">
          Open Vehicle Ingestion Dialog
        </zl-button>
      </div>

      <div *ngIf="lastResult" style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
        <strong>Last Result:</strong>
        <pre style="margin: 8px 0 0; overflow: auto;">{{ lastResult | json }}</pre>
      </div>
    </div>
  `,
  providers: [DialogService]
})
class DialogServiceDemoComponent {
  lastResult: unknown = null;

  constructor(private dialogService: DialogService) {}

  openLoginDialog(): void {
    const { afterClosed } = this.dialogService.open(LoginDialogContent, {
      data: { mode: 'login' },
      size: 'sm'
    });

    afterClosed().subscribe(result => {
      this.lastResult = result;
    });
  }

  openRegisterDialog(): void {
    const { afterClosed } = this.dialogService.open(LoginDialogContent, {
      data: { mode: 'register' },
      size: 'sm'
    });

    afterClosed().subscribe(result => {
      this.lastResult = result;
    });
  }

  openIngestionDialog(): void {
    const { afterClosed } = this.dialogService.open(VehicleIngestionDialogContent, {
      data: { maxImages: 20, maxFileSizeMB: 10 },
      size: 'lg'
    });

    afterClosed().subscribe(result => {
      this.lastResult = result;
    });
  }
}

const meta: Meta<DialogServiceDemoComponent> = {
  title: 'Components/Dialogs/DialogService',
  component: DialogServiceDemoComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [MatDialogModule, LoginDialogContent, VehicleIngestionDialogContent]
    })
  ],
  parameters: {
    docs: {
      description: {
        component: `
## DialogService

The DialogService provides a simplified API for opening Material dialogs with consistent styling and behavior across the ZoomLoop application.

### Basic Usage

\`\`\`typescript
import { DialogService, LoginDialogContent } from 'zoom-loop-components';

@Component({...})
export class MyComponent {
  constructor(private dialogService: DialogService) {}

  openDialog() {
    const { afterClosed } = this.dialogService.open(LoginDialogContent, {
      data: { mode: 'login' },
      size: 'sm'
    });

    afterClosed().subscribe(result => {
      console.log('Dialog result:', result);
    });
  }
}
\`\`\`

### Size Options

| Size | Max Width | Use Case |
|------|-----------|----------|
| \`sm\` | 400px | Simple forms, confirmations |
| \`md\` | 560px | Standard dialogs (default) |
| \`lg\` | 800px | Complex forms, multi-step wizards |
| \`xl\` | 1140px | Large content, tables |
| \`full\` | 100vw | Immersive experiences |

### Available Dialog Components

- **LoginDialogContent**: Authentication (login, register, forgot password)
- **VehicleIngestionDialogContent**: Vehicle image upload and processing
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj<DialogServiceDemoComponent>;

export const Interactive: Story = {};
