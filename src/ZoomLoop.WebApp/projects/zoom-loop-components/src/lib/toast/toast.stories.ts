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
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center'],
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
    isVisible: true,
    dismissible: true,
    position: 'top-right',
  },
};

export const Error: Story = {
  args: {
    type: 'error',
    title: 'Error',
    message: 'Something went wrong. Please try again.',
    isVisible: true,
    dismissible: true,
    position: 'top-right',
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    title: 'Warning',
    message: 'Your session is about to expire.',
    isVisible: true,
    dismissible: true,
    position: 'top-right',
  },
};

export const Info: Story = {
  args: {
    type: 'info',
    title: 'Information',
    message: 'A new version is available. Refresh to update.',
    isVisible: true,
    dismissible: true,
    position: 'top-right',
  },
};

export const WithAction: Story = {
  args: {
    type: 'info',
    title: 'New Feature',
    message: 'Check out our new financing calculator!',
    isVisible: true,
    dismissible: true,
    position: 'top-right',
    actionText: 'Try it now',
  },
};

export const NonDismissible: Story = {
  args: {
    type: 'warning',
    title: 'Important',
    message: 'This notification cannot be dismissed.',
    isVisible: true,
    dismissible: false,
    position: 'top-right',
  },
};

export const BottomPosition: Story = {
  args: {
    type: 'success',
    title: 'Saved',
    message: 'Your preferences have been updated.',
    isVisible: true,
    dismissible: true,
    position: 'bottom-center',
  },
};

export const AllTypes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <zl-toast type="success" title="Success" message="Operation completed successfully." [isVisible]="true" [dismissible]="true"></zl-toast>
        <zl-toast type="error" title="Error" message="An error occurred." [isVisible]="true" [dismissible]="true"></zl-toast>
        <zl-toast type="warning" title="Warning" message="Please review before proceeding." [isVisible]="true" [dismissible]="true"></zl-toast>
        <zl-toast type="info" title="Info" message="Here's some helpful information." [isVisible]="true" [dismissible]="true"></zl-toast>
      </div>
    `,
  }),
};
