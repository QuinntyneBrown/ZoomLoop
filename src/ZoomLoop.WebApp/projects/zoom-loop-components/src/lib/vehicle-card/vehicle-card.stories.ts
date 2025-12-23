import type { Meta, StoryObj } from '@storybook/angular';
import { VehicleCardComponent, VehicleData } from './vehicle-card.component';

const sampleVehicle: VehicleData = {
  id: '1',
  title: '2022 Honda Civic EX',
  year: 2022,
  make: 'Honda',
  model: 'Civic',
  trim: 'EX',
  price: 28500,
  monthlyPayment: 425,
  images: [
    'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
  ],
  specs: [
    { label: 'Mileage', value: '25,000 km' },
    { label: 'Transmission', value: 'Automatic' },
    { label: 'Fuel', value: 'Gasoline' },
  ],
  status: 'available',
  isFeatured: false,
  isCertified: true,
};

const featuredVehicle: VehicleData = {
  ...sampleVehicle,
  id: '2',
  title: '2023 BMW X5 xDrive40i',
  year: 2023,
  make: 'BMW',
  model: 'X5',
  trim: 'xDrive40i',
  price: 72500,
  monthlyPayment: 1050,
  isFeatured: true,
  isCertified: true,
  badges: ['Low Mileage', 'Premium'],
};

const soldVehicle: VehicleData = {
  ...sampleVehicle,
  id: '3',
  status: 'sold',
};

const reservedVehicle: VehicleData = {
  ...sampleVehicle,
  id: '4',
  status: 'reserved',
};

const meta: Meta<VehicleCardComponent> = {
  title: 'Components/Vehicle/VehicleCard',
  component: VehicleCardComponent,
  tags: ['autodocs'],
  argTypes: {
    isFavorite: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<VehicleCardComponent>;

export const Default: Story = {
  args: {
    vehicle: sampleVehicle,
    href: '/vehicles/1',
    isFavorite: false,
    loading: false,
  },
};

export const Featured: Story = {
  args: {
    vehicle: featuredVehicle,
    href: '/vehicles/2',
    isFavorite: false,
    loading: false,
  },
};

export const Favorited: Story = {
  args: {
    vehicle: sampleVehicle,
    href: '/vehicles/1',
    isFavorite: true,
    loading: false,
  },
};

export const Sold: Story = {
  args: {
    vehicle: soldVehicle,
    href: '/vehicles/3',
    isFavorite: false,
    loading: false,
  },
};

export const Reserved: Story = {
  args: {
    vehicle: reservedVehicle,
    href: '/vehicles/4',
    isFavorite: false,
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    vehicle: sampleVehicle,
    href: '/vehicles/1',
    isFavorite: false,
    loading: true,
  },
};

export const WithBadges: Story = {
  args: {
    vehicle: {
      ...sampleVehicle,
      badges: ['Great Deal', 'Low Mileage'],
    },
    href: '/vehicles/1',
    isFavorite: false,
    loading: false,
  },
};

export const Grid: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1200px;">
        <zl-vehicle-card [vehicle]="vehicle1" href="/vehicles/1"></zl-vehicle-card>
        <zl-vehicle-card [vehicle]="vehicle2" href="/vehicles/2"></zl-vehicle-card>
        <zl-vehicle-card [vehicle]="vehicle3" href="/vehicles/3"></zl-vehicle-card>
      </div>
    `,
    props: {
      vehicle1: sampleVehicle,
      vehicle2: featuredVehicle,
      vehicle3: { ...sampleVehicle, id: '5', title: '2021 Toyota RAV4 XLE', price: 34500 },
    },
  }),
};
