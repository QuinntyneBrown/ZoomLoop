import type { Meta, StoryObj } from '@storybook/angular';
import { ImageGalleryComponent, GalleryImage } from './image-gallery.component';

const sampleImages: GalleryImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200',
    alt: 'Vehicle exterior front view',
    category: 'exterior',
  },
  {
    src: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200',
    alt: 'Vehicle exterior side view',
    category: 'exterior',
  },
  {
    src: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200',
    alt: 'Vehicle exterior rear view',
    category: 'exterior',
  },
  {
    src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200',
    alt: 'Vehicle interior dashboard',
    category: 'interior',
  },
  {
    src: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200',
    alt: 'Vehicle interior seats',
    category: 'interior',
  },
];

const manyImages: GalleryImage[] = [
  ...sampleImages,
  {
    src: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200',
    alt: 'Vehicle detail 1',
    category: 'features',
  },
  {
    src: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200',
    alt: 'Vehicle detail 2',
    category: 'features',
  },
  {
    src: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200',
    alt: 'Vehicle detail 3',
    category: 'features',
  },
  {
    src: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200',
    alt: 'Vehicle detail 4',
    category: 'features',
  },
  {
    src: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200',
    alt: 'Vehicle detail 5',
    category: 'features',
  },
];

const meta: Meta<ImageGalleryComponent> = {
  title: 'Components/Vehicle/ImageGallery',
  component: ImageGalleryComponent,
  tags: ['autodocs'],
  argTypes: {
    showThumbnails: {
      control: 'boolean',
    },
    maxThumbnails: {
      control: { type: 'number', min: 4, max: 12 },
    },
  },
};

export default meta;
type Story = StoryObj<ImageGalleryComponent>;

export const Default: Story = {
  args: {
    images: sampleImages,
    showThumbnails: true,
    maxThumbnails: 8,
    ariaLabel: 'Vehicle image gallery',
  },
};

export const NoThumbnails: Story = {
  args: {
    images: sampleImages,
    showThumbnails: false,
    ariaLabel: 'Vehicle image gallery',
  },
};

export const ManyImages: Story = {
  args: {
    images: manyImages,
    showThumbnails: true,
    maxThumbnails: 6,
    ariaLabel: 'Vehicle image gallery',
  },
};

export const SingleImage: Story = {
  args: {
    images: [sampleImages[0]],
    showThumbnails: true,
    ariaLabel: 'Vehicle image',
  },
};

export const TwoImages: Story = {
  args: {
    images: sampleImages.slice(0, 2),
    showThumbnails: true,
    maxThumbnails: 8,
    ariaLabel: 'Vehicle image gallery',
  },
};

export const LargeThumbnails: Story = {
  args: {
    images: sampleImages,
    showThumbnails: true,
    maxThumbnails: 4,
    ariaLabel: 'Vehicle image gallery',
  },
};

export const CustomAriaLabel: Story = {
  args: {
    images: sampleImages,
    showThumbnails: true,
    maxThumbnails: 8,
    ariaLabel: '2022 Honda Civic photo gallery',
  },
};
