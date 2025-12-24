// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoginDialogContent, LoginDialogContentData } from './login-dialog-content';

const mockDialogRef = {
  close: () => {}
};

const meta: Meta<LoginDialogContent> = {
  title: 'Components/Dialogs/LoginDialogContent (MatDialog)',
  component: LoginDialogContent,
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
The LoginDialogContent component is designed to work with Angular Material's MatDialog.
It provides the same functionality as the standard LoginDialog but is meant to be opened
programmatically using the DialogService.

## Usage with DialogService

\`\`\`typescript
import { DialogService, LoginDialogContent, LoginDialogResult } from 'zoom-loop-components';

@Component({...})
export class MyComponent {
  constructor(private dialogService: DialogService) {}

  openLoginDialog() {
    const { afterClosed } = this.dialogService.open<LoginDialogContent, LoginDialogContentData, LoginDialogResult>(
      LoginDialogContent,
      {
        data: { mode: 'login' },
        size: 'sm'
      }
    );

    afterClosed().subscribe(result => {
      if (result?.action === 'login') {
        console.log('Login data:', result.loginData);
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
type Story = StoryObj<LoginDialogContent>;

export const LoginMode: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { mode: 'login', isLoading: false, errorMessage: '' } as LoginDialogContentData
        }
      ]
    })
  ]
};

export const RegisterMode: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { mode: 'register', isLoading: false, errorMessage: '' } as LoginDialogContentData
        }
      ]
    })
  ]
};

export const ForgotPasswordMode: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { mode: 'forgot-password', isLoading: false, errorMessage: '' } as LoginDialogContentData
        }
      ]
    })
  ]
};

export const WithLoading: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { mode: 'login', isLoading: true, errorMessage: '' } as LoginDialogContentData
        }
      ]
    })
  ]
};

export const WithError: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            mode: 'login',
            isLoading: false,
            errorMessage: 'Invalid email or password. Please try again.'
          } as LoginDialogContentData
        }
      ]
    })
  ]
};
