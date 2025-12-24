import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { VehicleMasterDetailComponent, VehicleDetailData } from './vehicle-master-detail.component';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';
import { ImageGalleryComponent } from '../image-gallery/image-gallery.component';
import { BadgeComponent } from '../badge/badge.component';
import { ButtonComponent } from '../button/button.component';

// Sample vehicle data
const sampleVehicles: VehicleDetailData[] = [
  {
    id: '1',
    title: '2024 BMW X5 xDrive40i',
    year: 2024,
    make: 'BMW',
    model: 'X5',
    trim: 'xDrive40i',
    price: 79995,
    monthlyPayment: 899,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800'
    ],
    specs: [
      { label: 'Mileage', value: '12,500 km' },
      { label: 'Transmission', value: 'Automatic' },
      { label: 'Fuel', value: 'Gasoline' }
    ],
    mileage: 12500,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    exteriorColor: 'Alpine White',
    interiorColor: 'Black Leather',
    vin: 'WBA51BJ0XPWW12345',
    stockNumber: 'P12345',
    description: 'This stunning 2024 BMW X5 xDrive40i combines luxury with performance. Features include a panoramic sunroof, premium Harman Kardon sound system, and advanced driver assistance features.',
    highlights: [
      'One Owner Vehicle',
      'Clean Carfax History',
      'Factory Warranty Remaining',
      'Premium Package Included'
    ],
    features: ['Leather Seats', 'Navigation', 'Sunroof', 'Bluetooth', 'Backup Camera', 'Heated Seats', 'Apple CarPlay', 'Android Auto'],
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
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800'
    ],
    specs: [
      { label: 'Mileage', value: '18,200 km' },
      { label: 'Transmission', value: 'Automatic' },
      { label: 'Fuel', value: 'Gasoline' }
    ],
    mileage: 18200,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    drivetrain: '4MATIC AWD',
    exteriorColor: 'Obsidian Black',
    interiorColor: 'Macchiato Beige',
    vin: 'W1N4M8DB3PA123456',
    stockNumber: 'P12346',
    description: 'Elegant and sophisticated, this Mercedes-Benz GLE 350 offers the perfect blend of comfort and capability.',
    highlights: [
      'Certified Pre-Owned',
      'Extended Warranty Available',
      'Premium Sound System'
    ],
    features: ['Leather Seats', 'Navigation', 'Panoramic Roof', 'Wireless Charging', 'Ambient Lighting'],
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
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800'
    ],
    specs: [
      { label: 'Mileage', value: '8,400 km' },
      { label: 'Transmission', value: 'Automatic' },
      { label: 'Fuel', value: 'Gasoline' }
    ],
    mileage: 8400,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    drivetrain: 'Quattro AWD',
    exteriorColor: 'Navarra Blue',
    interiorColor: 'Black',
    vin: 'WA1VAAF77PD234567',
    stockNumber: 'P12347',
    description: 'Nearly new Audi Q7 with all the premium features you expect from a luxury SUV.',
    features: ['Third Row Seating', 'Virtual Cockpit', 'Bang & Olufsen Audio', 'Air Suspension'],
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
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800'
    ],
    specs: [
      { label: 'Mileage', value: '25,000 km' },
      { label: 'Transmission', value: 'Automatic' },
      { label: 'Fuel', value: 'Gasoline' }
    ],
    mileage: 25000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    exteriorColor: 'Carrara White',
    interiorColor: 'Black/Bordeaux Red',
    status: 'reserved',
    badges: ['Sport Package']
  },
  {
    id: '5',
    title: '2021 Tesla Model X Long Range',
    year: 2021,
    make: 'Tesla',
    model: 'Model X',
    trim: 'Long Range',
    price: 89995,
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800'
    ],
    specs: [
      { label: 'Mileage', value: '32,000 km' },
      { label: 'Range', value: '580 km' },
      { label: 'Drive', value: 'Dual Motor' }
    ],
    mileage: 32000,
    fuelType: 'Electric',
    transmission: 'Single Speed',
    drivetrain: 'Dual Motor AWD',
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
    images: [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'
    ],
    specs: [
      { label: 'Mileage', value: '5,200 km' },
      { label: 'Transmission', value: 'CVT' },
      { label: 'Fuel', value: 'Hybrid' }
    ],
    mileage: 5200,
    fuelType: 'Hybrid',
    transmission: 'CVT',
    drivetrain: 'AWD',
    exteriorColor: 'Eminent White Pearl',
    interiorColor: 'Palomino',
    description: 'Experience the perfect balance of efficiency and luxury with this Lexus RX 350h hybrid.',
    features: ['Mark Levinson Audio', 'Heads-Up Display', 'Panoramic View Monitor'],
    isFeatured: true,
    status: 'available'
  }
];

const meta: Meta<VehicleMasterDetailComponent> = {
  title: 'Components/Vehicle/VehicleMasterDetail',
  component: VehicleMasterDetailComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [VehicleCardComponent, ImageGalleryComponent, BadgeComponent, ButtonComponent]
    })
  ],
  parameters: {
    layout: 'fullscreen'
  },
  argTypes: {
    vehicles: {
      description: 'Array of vehicle data to display in the master list',
      control: 'object'
    },
    selectedVehicle: {
      description: 'Currently selected vehicle for detail view',
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
    favorites: {
      description: 'Set of vehicle IDs that are favorited',
      control: 'object'
    },
    vehicleSelect: {
      description: 'Emitted when a vehicle is selected',
      action: 'vehicleSelect'
    },
    vehicleClose: {
      description: 'Emitted when detail panel is closed',
      action: 'vehicleClose'
    },
    favoriteToggle: {
      description: 'Emitted when favorite status is toggled',
      action: 'favoriteToggle'
    },
    contactDealer: {
      description: 'Emitted when contact dealer button is clicked',
      action: 'contactDealer'
    },
    scheduleTestDrive: {
      description: 'Emitted when schedule test drive button is clicked',
      action: 'scheduleTestDrive'
    }
  }
};

export default meta;
type Story = StoryObj<VehicleMasterDetailComponent>;

// Default view - side layout
export const Default: Story = {
  args: {
    vehicles: sampleVehicles,
    selectedVehicle: null,
    config: {
      columns: 3,
      detailLayout: 'side'
    },
    loading: false,
    favorites: new Set(['2'])
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 24px; background: #f9fafb; min-height: 100vh;">
        <zl-vehicle-master-detail
          [vehicles]="vehicles"
          [selectedVehicle]="selectedVehicle"
          [config]="config"
          [loading]="loading"
          [favorites]="favorites"
          (vehicleSelect)="selectedVehicle = $event"
          (vehicleClose)="selectedVehicle = null"
        ></zl-vehicle-master-detail>
      </div>
    `
  })
};

// With vehicle selected - side layout
export const WithDetailSideLayout: Story = {
  args: {
    vehicles: sampleVehicles,
    selectedVehicle: sampleVehicles[0],
    config: {
      columns: 2,
      detailLayout: 'side'
    },
    loading: false,
    favorites: new Set(['1', '2'])
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 24px; background: #f9fafb; min-height: 100vh;">
        <zl-vehicle-master-detail
          [vehicles]="vehicles"
          [selectedVehicle]="selectedVehicle"
          [config]="config"
          [loading]="loading"
          [favorites]="favorites"
          (vehicleSelect)="selectedVehicle = $event"
          (vehicleClose)="selectedVehicle = null"
        ></zl-vehicle-master-detail>
      </div>
    `
  })
};

// Overlay layout
export const OverlayLayout: Story = {
  args: {
    vehicles: sampleVehicles,
    selectedVehicle: sampleVehicles[0],
    config: {
      columns: 3,
      detailLayout: 'overlay'
    },
    loading: false,
    favorites: new Set()
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 24px; background: #f9fafb; min-height: 100vh;">
        <zl-vehicle-master-detail
          [vehicles]="vehicles"
          [selectedVehicle]="selectedVehicle"
          [config]="config"
          [loading]="loading"
          [favorites]="favorites"
          (vehicleSelect)="selectedVehicle = $event"
          (vehicleClose)="selectedVehicle = null"
        ></zl-vehicle-master-detail>
      </div>
    `
  })
};

// Full screen layout
export const FullScreenLayout: Story = {
  args: {
    vehicles: sampleVehicles,
    selectedVehicle: sampleVehicles[1],
    config: {
      columns: 4,
      detailLayout: 'full'
    },
    loading: false,
    favorites: new Set(['1'])
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 24px; background: #f9fafb; min-height: 100vh;">
        <zl-vehicle-master-detail
          [vehicles]="vehicles"
          [selectedVehicle]="selectedVehicle"
          [config]="config"
          [loading]="loading"
          [favorites]="favorites"
          (vehicleSelect)="selectedVehicle = $event"
          (vehicleClose)="selectedVehicle = null"
        ></zl-vehicle-master-detail>
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
      columns: 3,
      detailLayout: 'side'
    },
    loading: true,
    favorites: new Set()
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 24px; background: #f9fafb; min-height: 100vh;">
        <zl-vehicle-master-detail
          [vehicles]="vehicles"
          [selectedVehicle]="selectedVehicle"
          [config]="config"
          [loading]="loading"
          [favorites]="favorites"
        ></zl-vehicle-master-detail>
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
      columns: 3,
      detailLayout: 'side'
    },
    loading: false,
    favorites: new Set()
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 24px; background: #f9fafb; min-height: 100vh;">
        <zl-vehicle-master-detail
          [vehicles]="vehicles"
          [selectedVehicle]="selectedVehicle"
          [config]="config"
          [loading]="loading"
          [favorites]="favorites"
        ></zl-vehicle-master-detail>
      </div>
    `
  })
};

// Two column layout
export const TwoColumns: Story = {
  args: {
    vehicles: sampleVehicles.slice(0, 4),
    selectedVehicle: null,
    config: {
      columns: 2,
      detailLayout: 'side'
    },
    loading: false,
    favorites: new Set()
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 24px; background: #f9fafb; min-height: 100vh;">
        <zl-vehicle-master-detail
          [vehicles]="vehicles"
          [selectedVehicle]="selectedVehicle"
          [config]="config"
          [loading]="loading"
          [favorites]="favorites"
          (vehicleSelect)="selectedVehicle = $event"
          (vehicleClose)="selectedVehicle = null"
        ></zl-vehicle-master-detail>
      </div>
    `
  })
};

// Four column layout
export const FourColumns: Story = {
  args: {
    vehicles: sampleVehicles,
    selectedVehicle: null,
    config: {
      columns: 4,
      detailLayout: 'side'
    },
    loading: false,
    favorites: new Set(['1', '3', '6'])
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 24px; background: #f9fafb; min-height: 100vh;">
        <zl-vehicle-master-detail
          [vehicles]="vehicles"
          [selectedVehicle]="selectedVehicle"
          [config]="config"
          [loading]="loading"
          [favorites]="favorites"
          (vehicleSelect)="selectedVehicle = $event"
          (vehicleClose)="selectedVehicle = null"
        ></zl-vehicle-master-detail>
      </div>
    `
  })
};

// With sold vehicle selected
export const SoldVehicle: Story = {
  args: {
    vehicles: sampleVehicles,
    selectedVehicle: sampleVehicles[4], // Tesla Model X - sold
    config: {
      columns: 3,
      detailLayout: 'side'
    },
    loading: false,
    favorites: new Set()
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 24px; background: #f9fafb; min-height: 100vh;">
        <zl-vehicle-master-detail
          [vehicles]="vehicles"
          [selectedVehicle]="selectedVehicle"
          [config]="config"
          [loading]="loading"
          [favorites]="favorites"
          (vehicleSelect)="selectedVehicle = $event"
          (vehicleClose)="selectedVehicle = null"
        ></zl-vehicle-master-detail>
      </div>
    `
  })
};

// Reserved vehicle
export const ReservedVehicle: Story = {
  args: {
    vehicles: sampleVehicles,
    selectedVehicle: sampleVehicles[3], // Porsche Cayenne - reserved
    config: {
      columns: 3,
      detailLayout: 'side'
    },
    loading: false,
    favorites: new Set()
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 24px; background: #f9fafb; min-height: 100vh;">
        <zl-vehicle-master-detail
          [vehicles]="vehicles"
          [selectedVehicle]="selectedVehicle"
          [config]="config"
          [loading]="loading"
          [favorites]="favorites"
          (vehicleSelect)="selectedVehicle = $event"
          (vehicleClose)="selectedVehicle = null"
        ></zl-vehicle-master-detail>
      </div>
    `
  })
};
