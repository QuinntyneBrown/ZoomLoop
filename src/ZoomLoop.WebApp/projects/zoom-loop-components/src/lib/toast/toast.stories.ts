// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import type { Meta, StoryObj } from '@storybook/angular';
import { ToastComponent } from './toast.component';

const meta: Meta<ToastComponent> = {
  title: 'Components/Feedback/Toast',
  component: ToastComponent,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
    },
    dismissible: {
      control: 'boolean',
    },
    duration: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<ToastComponent>;

export const Success: Story = {
  args: {
    type: 'success',
    title: 'Success!',
    message: 'Your changes have been saved successfully.',
    dismissible: true,
  },
};

export const Error: Story = {
  args: {
    type: 'error',
    title: 'Error',
    message: 'Something went wrong. Please try again.',
    dismissible: true,
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    title: 'Warning',
    message: 'Your session is about to expire.',
    dismissible: true,
  },
};

export const Info: Story = {
  args: {
    type: 'info',
    title: 'Information',
    message: 'A new version is available. Refresh to update.',
    dismissible: true,
  },
};

export const WithAction: Story = {
  args: {
    type: 'info',
    title: 'New Feature',
    message: 'Check out our new financing calculator!',
    dismissible: true,
  },
};

export const NonDismissible: Story = {
  args: {
    type: 'warning',
    title: 'Important',
    message: 'This notification cannot be dismissed.',
    dismissible: false,
  },
};

export const BottomPosition: Story = {
  args: {
    type: 'success',
    title: 'Saved',
    message: 'Your preferences have been updated.',
    dismissible: true,
  },
};

export const AllTypes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <zl-toast type="success" title="Success" message="Operation completed successfully." [dismissible]="true"></zl-toast>
        <zl-toast type="error" title="Error" message="An error occurred." [dismissible]="true"></zl-toast>
        <zl-toast type="warning" title="Warning" message="Please review before proceeding." [dismissible]="true"></zl-toast>
        <zl-toast type="info" title="Info" message="Here's some helpful information." [dismissible]="true"></zl-toast>
      </div>
    `,
  }),
};
