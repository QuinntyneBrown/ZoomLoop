import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { VehiclesComponent, VehicleData } from './vehicles.component';
import { BadgeComponent } from '../badge/badge.component';
import { ButtonComponent } from '../button/button.component';
import { InputComponent } from '../input/input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Sample vehicle data
const sampleVehicles: VehicleData[] = [
  {
    id: '1',
    title: '2024 BMW X5 xDrive40i',
    year: 2024,
    make: 'BMW',
    model: 'X5',
    trim: 'xDrive40i',
    price: 79995,
    monthlyPayment: 899,
    mileage: 12500,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    exteriorColor: 'Alpine White',
    interiorColor: 'Black Leather',
    vin: 'WBA51BJ0XPWW12345',
    stockNumber: 'P12345',
    isFeatured: true,
    isCertified: true,
    status: 'available'
  },
  {
    id: '2',
    title: '2023 Mercedes-Benz GLE 350',
    year: 2023,
    make: 'Mercedes-Benz',
    model: 'GLE',
    trim: '350 4MATIC',
    price: 72500,
    monthlyPayment: 825,
    mileage: 18200,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    exteriorColor: 'Obsidian Black',
    interiorColor: 'Macchiato Beige',
    vin: 'W1N4M8DB3PA123456',
    stockNumber: 'P12346',
    isCertified: true,
    status: 'available'
  },
  {
    id: '3',
    title: '2024 Audi Q7 Premium Plus',
    year: 2024,
    make: 'Audi',
    model: 'Q7',
    trim: 'Premium Plus',
    price: 68900,
    monthlyPayment: 785,
    mileage: 8400,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    exteriorColor: 'Navarra Blue',
    interiorColor: 'Black',
    vin: 'WA1VAAF77PD234567',
    stockNumber: 'P12347',
    status: 'available'
  },
  {
    id: '4',
    title: '2022 Porsche Cayenne',
    year: 2022,
    make: 'Porsche',
    model: 'Cayenne',
    price: 85000,
    monthlyPayment: 965,
    mileage: 25000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    exteriorColor: 'Carrara White',
    interiorColor: 'Black/Bordeaux Red',
    status: 'reserved'
  },
  {
    id: '5',
    title: '2021 Tesla Model X Long Range',
    year: 2021,
    make: 'Tesla',
    model: 'Model X',
    trim: 'Long Range',
    price: 89995,
    mileage: 32000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    exteriorColor: 'Midnight Silver',
    interiorColor: 'White',
    status: 'sold'
  },
  {
    id: '6',
    title: '2024 Lexus RX 350h',
    year: 2024,
    make: 'Lexus',
    model: 'RX',
    trim: '350h Luxury',
    price: 64500,
    monthlyPayment: 735,
    mileage: 5200,
    fuelType: 'Hybrid',
    transmission: 'CVT',
    drivetrain: 'AWD',
    exteriorColor: 'Eminent White Pearl',
    interiorColor: 'Palomino',
    isFeatured: true,
    status: 'available'
  }
];

const meta: Meta<VehiclesComponent> = {
  title: 'Components/Vehicle/Vehicles',
  component: VehiclesComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [FormsModule, ReactiveFormsModule, BadgeComponent, ButtonComponent, InputComponent]
    })
  ],
  parameters: {
    layout: 'fullscreen'
  },
  argTypes: {
    vehicles: {
      description: 'Array of vehicle data to display in the table',
      control: 'object'
    },
    selectedVehicle: {
      description: 'Currently selected vehicle for editing',
      control: 'object'
    },
    config: {
      description: 'Configuration options for the component',
      control: 'object'
    },
    loading: {
      description: 'Show loading skeleton state',
      control: 'boolean'
    },
    vehicleSelect: {
      description: 'Emitted when a vehicle is selected',
      action: 'vehicleSelect'
    },
    vehicleClose: {
      description: 'Emitted when detail panel is closed',
      action: 'vehicleClose'
    },
    vehicleSave: {
      description: 'Emitted when save button is clicked',
      action: 'vehicleSave'
    },
    vehicleDelete: {
      description: 'Emitted when delete button is clicked',
      action: 'vehicleDelete'
    },
    vehicleCreate: {
      description: 'Emitted when add vehicle button is clicked',
      action: 'vehicleCreate'
    }
  }
};

export default meta;
type Story = StoryObj<VehiclesComponent>;

// Default view - no selection
export const Default: Story = {
  args: {
    vehicles: sampleVehicles,
    selectedVehicle: null,
    config: {
      showSearch: true,
      pageSize: 10
    },
    loading: false
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 24px; background: #f9fafb; min-height: 100vh;">
        <zl-vehicles
          [vehicles]="vehicles"
          [selectedVehicle]="selectedVehicle"
          [config]="config"
          [loading]="loading"
          (vehicleSelect)="selectedVehicle = $event"
          (vehicleClose)="selectedVehicle = null"
          (vehicleSave)="vehicleSave($event)"
          (vehicleDelete)="vehicleDelete($event)"
          (vehicleCreate)="vehicleCreate()"
        ></zl-vehicles>
      </div>
    `
  })
};

// With vehicle selected for editing
export const WithSelection: Story = {
  args: {
    vehicles: sampleVehicles,
    selectedVehicle: sampleVehicles[0],
    config: {
      showSearch: true,
      pageSize: 10
    },
    loading: false
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 24px; background: #f9fafb; min-height: 100vh;">
        <zl-vehicles
          [vehicles]="vehicles"
          [selectedVehicle]="selectedVehicle"
          [config]="config"
          [loading]="loading"
          (vehicleSelect)="selectedVehicle = $event"
          (vehicleClose)="selectedVehicle = null"
          (vehicleSave)="vehicleSave($event)"
          (vehicleDelete)="vehicleDelete($event)"
          (vehicleCreate)="vehicleCreate()"
        ></zl-vehicles>
      </div>
    `
  })
};

// Loading state
export const Loading: Story = {
  args: {
    vehicles: [],
    selectedVehicle: null,
    config: {
      showSearch: true,
      pageSize: 10
    },
    loading: true
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 24px; background: #f9fafb; min-height: 100vh;">
        <zl-vehicles
          [vehicles]="vehicles"
          [selectedVehicle]="selectedVehicle"
          [config]="config"
          [loading]="loading"
        ></zl-vehicles>
      </div>
    `
  })
};

// Empty state
export const Empty: Story = {
  args: {
    vehicles: [],
    selectedVehicle: null,
    config: {
      showSearch: true,
      pageSize: 10
    },
    loading: false
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 24px; background: #f9fafb; min-height: 100vh;">
        <zl-vehicles
          [vehicles]="vehicles"
          [selectedVehicle]="selectedVehicle"
          [config]="config"
          [loading]="loading"
        ></zl-vehicles>
      </div>
    `
  })
};

// Without search bar
export const WithoutSearch: Story = {
  args: {
    vehicles: sampleVehicles,
    selectedVehicle: null,
    config: {
      showSearch: false,
      pageSize: 10
    },
    loading: false
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 24px; background: #f9fafb; min-height: 100vh;">
        <zl-vehicles
          [vehicles]="vehicles"
          [selectedVehicle]="selectedVehicle"
          [config]="config"
          [loading]="loading"
          (vehicleSelect)="selectedVehicle = $event"
          (vehicleClose)="selectedVehicle = null"
        ></zl-vehicles>
      </div>
    `
  })
};

// Editing a reserved vehicle
export const EditingReserved: Story = {
  args: {
    vehicles: sampleVehicles,
    selectedVehicle: sampleVehicles[3], // Porsche Cayenne - reserved
    config: {
      showSearch: true,
      pageSize: 10
    },
    loading: false
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 24px; background: #f9fafb; min-height: 100vh;">
        <zl-vehicles
          [vehicles]="vehicles"
          [selectedVehicle]="selectedVehicle"
          [config]="config"
          [loading]="loading"
          (vehicleSelect)="selectedVehicle = $event"
          (vehicleClose)="selectedVehicle = null"
          (vehicleSave)="vehicleSave($event)"
          (vehicleDelete)="vehicleDelete($event)"
        ></zl-vehicles>
      </div>
    `
  })
};

// Editing a sold vehicle
export const EditingSold: Story = {
  args: {
    vehicles: sampleVehicles,
    selectedVehicle: sampleVehicles[4], // Tesla Model X - sold
    config: {
      showSearch: true,
      pageSize: 10
    },
    loading: false
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 24px; background: #f9fafb; min-height: 100vh;">
        <zl-vehicles
          [vehicles]="vehicles"
          [selectedVehicle]="selectedVehicle"
          [config]="config"
          [loading]="loading"
          (vehicleSelect)="selectedVehicle = $event"
          (vehicleClose)="selectedVehicle = null"
          (vehicleSave)="vehicleSave($event)"
          (vehicleDelete)="vehicleDelete($event)"
        ></zl-vehicles>
      </div>
    `
  })
};
