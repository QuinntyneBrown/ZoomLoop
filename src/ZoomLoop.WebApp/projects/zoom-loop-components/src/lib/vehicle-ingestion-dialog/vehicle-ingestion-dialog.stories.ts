import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleIngestionDialog } from './vehicle-ingestion-dialog';
import { ModalComponent } from '../modal/modal.component';
import { ButtonComponent } from '../button/button.component';
import { BadgeComponent } from '../badge/badge.component';

const meta: Meta<VehicleIngestionDialog> = {
  title: 'Components/Dialogs/VehicleIngestionDialog',
  component: VehicleIngestionDialog,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, ModalComponent, ButtonComponent, BadgeComponent],
    }),
  ],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the dialog is open',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the dialog is in a loading state',
    },
    maxImages: {
      control: 'number',
      description: 'Maximum number of images allowed',
    },
    maxFileSizeMB: {
      control: 'number',
      description: 'Maximum file size in MB',
    },
  },
};

export default meta;
type Story = StoryObj<VehicleIngestionDialog>;

export const Default: Story = {
  args: {
    isOpen: true,
    isLoading: false,
    maxImages: 20,
    maxFileSizeMB: 10,
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
  },
};

export const WithImagesUploaded: Story = {
  args: {
    isOpen: true,
    isLoading: false,
  },
  render: (args) => ({
    props: {
      ...args,
      onInit: (component: VehicleIngestionDialog) => {
        component.uploadedImages = [
          {
            id: '1',
            file: new File([''], 'front.jpg', { type: 'image/jpeg' }),
            preview: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop',
            uploadProgress: 100,
            isUploaded: true,
            order: 0,
          },
          {
            id: '2',
            file: new File([''], 'side.jpg', { type: 'image/jpeg' }),
            preview: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
            uploadProgress: 100,
            isUploaded: true,
            order: 1,
          },
          {
            id: '3',
            file: new File([''], 'back.jpg', { type: 'image/jpeg' }),
            preview: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=300&fit=crop',
            uploadProgress: 100,
            isUploaded: true,
            order: 2,
          },
        ];
      },
    },
    template: `
      <zl-vehicle-ingestion-dialog
        [isOpen]="isOpen"
        [isLoading]="isLoading"
        [maxImages]="maxImages"
        [maxFileSizeMB]="maxFileSizeMB"
        #dialog
      ></zl-vehicle-ingestion-dialog>
      <ng-container *ngIf="onInit(dialog)"></ng-container>
    `,
  }),
};

export const Processing: Story = {
  args: {
    isOpen: true,
  },
  render: (args) => ({
    props: {
      ...args,
      onInit: (component: VehicleIngestionDialog) => {
        component.processingStep = 'analyzing_condition';
        component.processingProgress = 65;
        component.estimatedTimeRemaining = 10;
        component.uploadedImages = [
          {
            id: '1',
            file: new File([''], 'car.jpg', { type: 'image/jpeg' }),
            preview: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop',
            uploadProgress: 100,
            isUploaded: true,
            order: 0,
          },
        ];
      },
    },
    template: `
      <zl-vehicle-ingestion-dialog
        [isOpen]="isOpen"
        #dialog
      ></zl-vehicle-ingestion-dialog>
      <ng-container *ngIf="onInit(dialog)"></ng-container>
    `,
  }),
};

export const VINNotFoundError: Story = {
  args: {
    isOpen: true,
  },
  render: (args) => ({
    props: {
      ...args,
      onInit: (component: VehicleIngestionDialog) => {
        component.error = {
          code: 'VIN_NOT_FOUND',
          message: "We couldn't find a VIN in your uploaded images.",
          retryable: true,
        };
        component.processingStep = 'failed';
      },
    },
    template: `
      <zl-vehicle-ingestion-dialog
        [isOpen]="isOpen"
        #dialog
      ></zl-vehicle-ingestion-dialog>
      <ng-container *ngIf="onInit(dialog)"></ng-container>
    `,
  }),
};

export const ManualVINEntry: Story = {
  args: {
    isOpen: true,
  },
  render: (args) => ({
    props: {
      ...args,
      onInit: (component: VehicleIngestionDialog) => {
        component.isManualEntry = true;
        component.error = {
          code: 'VIN_NOT_FOUND',
          message: "We couldn't find a VIN in your uploaded images.",
          retryable: true,
        };
      },
    },
    template: `
      <zl-vehicle-ingestion-dialog
        [isOpen]="isOpen"
        #dialog
      ></zl-vehicle-ingestion-dialog>
      <ng-container *ngIf="onInit(dialog)"></ng-container>
    `,
  }),
};

export const SuccessResult: Story = {
  args: {
    isOpen: true,
  },
  render: (args) => ({
    props: {
      ...args,
      onInit: (component: VehicleIngestionDialog) => {
        component.processingStep = 'completed';
        component.processingProgress = 100;
        component.result = {
          vehicleId: 'v-12345',
          vin: '1HGCV1F19MA123456',
          year: 2021,
          make: 'Honda',
          model: 'Civic LX',
          doors: 4,
          interiorCondition: 'Good',
          exteriorCondition: 'Excellent',
          description: 'This stunning 2021 Honda Civic LX presents itself in excellent condition, featuring a sleek exterior design and well-maintained interior. The vehicle offers exceptional fuel efficiency and reliability that Honda is known for. With its modern safety features and comfortable ride, this Civic is perfect for daily commuting or family use.',
          images: [
            { id: 'img1', url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop', isPrimary: true, displayOrder: 0 },
            { id: 'img2', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop', isPrimary: false, displayOrder: 1 },
            { id: 'img3', url: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=300&fit=crop', isPrimary: false, displayOrder: 2 },
            { id: 'img4', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop', isPrimary: false, displayOrder: 3 },
            { id: 'img5', url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop', isPrimary: false, displayOrder: 4 },
          ],
        };
      },
    },
    template: `
      <zl-vehicle-ingestion-dialog
        [isOpen]="isOpen"
        #dialog
      ></zl-vehicle-ingestion-dialog>
      <ng-container *ngIf="onInit(dialog)"></ng-container>
    `,
  }),
};

export const NetworkError: Story = {
  args: {
    isOpen: true,
  },
  render: (args) => ({
    props: {
      ...args,
      onInit: (component: VehicleIngestionDialog) => {
        component.error = {
          code: 'NETWORK_ERROR',
          message: 'Unable to connect to the server. Please check your internet connection and try again.',
          retryable: true,
        };
        component.processingStep = 'failed';
      },
    },
    template: `
      <zl-vehicle-ingestion-dialog
        [isOpen]="isOpen"
        #dialog
      ></zl-vehicle-ingestion-dialog>
      <ng-container *ngIf="onInit(dialog)"></ng-container>
    `,
  }),
};

export const FairConditionResult: Story = {
  args: {
    isOpen: true,
  },
  render: (args) => ({
    props: {
      ...args,
      onInit: (component: VehicleIngestionDialog) => {
        component.processingStep = 'completed';
        component.processingProgress = 100;
        component.result = {
          vehicleId: 'v-67890',
          vin: '2T1BU4EE5DC123456',
          year: 2018,
          make: 'Toyota',
          model: 'Corolla SE',
          doors: 4,
          interiorCondition: 'Fair',
          exteriorCondition: 'Good',
          description: 'This 2018 Toyota Corolla SE is a reliable sedan with minor wear consistent with its age. The vehicle has been well-maintained mechanically and offers great fuel economy. Some cosmetic imperfections are present but do not affect the overall drivability of the car.',
          images: [
            { id: 'img1', url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=300&fit=crop', isPrimary: true, displayOrder: 0 },
            { id: 'img2', url: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=400&h=300&fit=crop', isPrimary: false, displayOrder: 1 },
          ],
        };
      },
    },
    template: `
      <zl-vehicle-ingestion-dialog
        [isOpen]="isOpen"
        #dialog
      ></zl-vehicle-ingestion-dialog>
      <ng-container *ngIf="onInit(dialog)"></ng-container>
    `,
  }),
};
