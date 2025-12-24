import type { Meta, StoryObj } from '@storybook/angular';
import { MyProfileComponent, UserProfile } from './my-profile.component';

const meta: Meta<MyProfileComponent> = {
  title: 'Components/User/MyProfile',
  component: MyProfileComponent,
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Shows loading state when saving profile'
    },
    readonly: {
      control: 'boolean',
      description: 'Makes the form read-only'
    },
    showAvatar: {
      control: 'boolean',
      description: 'Shows or hides the avatar section'
    },
    showBio: {
      control: 'boolean',
      description: 'Shows or hides the bio field'
    },
    compact: {
      control: 'boolean',
      description: 'Uses a more compact layout'
    },
    profileUpdate: {
      action: 'profileUpdate',
      description: 'Emitted when the profile is saved'
    },
    cancel: {
      action: 'cancel',
      description: 'Emitted when the cancel button is clicked'
    },
    avatarChange: {
      action: 'avatarChange',
      description: 'Emitted when a new avatar image is selected'
    }
  }
};

export default meta;
type Story = StoryObj<MyProfileComponent>;

const sampleProfile: UserProfile = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  bio: 'Passionate developer with a love for creating amazing user experiences.',
  avatarUrl: 'https://i.pravatar.cc/300?img=12'
};

const emptyProfile: UserProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  bio: '',
  avatarUrl: ''
};

export const Default: Story = {
  args: {
    profile: { ...sampleProfile },
    loading: false,
    readonly: false,
    showAvatar: true,
    showBio: true,
    compact: false
  }
};

export const EmptyProfile: Story = {
  args: {
    profile: { ...emptyProfile },
    loading: false,
    readonly: false,
    showAvatar: true,
    showBio: true,
    compact: false
  }
};

export const WithoutAvatar: Story = {
  args: {
    profile: {
      ...sampleProfile,
      avatarUrl: ''
    },
    loading: false,
    readonly: false,
    showAvatar: true,
    showBio: true,
    compact: false
  }
};

export const Loading: Story = {
  args: {
    profile: { ...sampleProfile },
    loading: true,
    readonly: false,
    showAvatar: true,
    showBio: true,
    compact: false
  }
};

export const Readonly: Story = {
  args: {
    profile: { ...sampleProfile },
    loading: false,
    readonly: true,
    showAvatar: true,
    showBio: true,
    compact: false
  }
};

export const WithoutAvatarSection: Story = {
  args: {
    profile: { ...sampleProfile },
    loading: false,
    readonly: false,
    showAvatar: false,
    showBio: true,
    compact: false
  }
};

export const WithoutBio: Story = {
  args: {
    profile: { ...sampleProfile },
    loading: false,
    readonly: false,
    showAvatar: true,
    showBio: false,
    compact: false
  }
};

export const Compact: Story = {
  args: {
    profile: { ...sampleProfile },
    loading: false,
    readonly: false,
    showAvatar: true,
    showBio: true,
    compact: true
  }
};

export const MinimalForm: Story = {
  args: {
    profile: { ...sampleProfile },
    loading: false,
    readonly: false,
    showAvatar: false,
    showBio: false,
    compact: true
  }
};

export const LongBio: Story = {
  args: {
    profile: {
      ...sampleProfile,
      bio: 'I am a passionate full-stack developer with over 10 years of experience building web applications. I specialize in Angular, React, and Node.js. I love collaborating with teams to create innovative solutions that solve real-world problems. When I\'m not coding, you can find me hiking, reading tech blogs, or contributing to open-source projects. I believe in continuous learning and staying up-to-date with the latest technologies and best practices in software development.'
    },
    loading: false,
    readonly: false,
    showAvatar: true,
    showBio: true,
    compact: false
  }
};

export const Interactive: Story = {
  args: {
    profile: { ...sampleProfile },
    loading: false,
    readonly: false,
    showAvatar: true,
    showBio: true,
    compact: false
  },
  render: (args) => ({
    props: {
      ...args,
      onProfileUpdate: (profile: UserProfile) => {
        console.log('Profile updated:', profile);
        alert('Profile updated successfully!');
      },
      onCancel: () => {
        console.log('Cancel clicked');
        alert('Changes cancelled');
      },
      onAvatarChange: (file: File) => {
        console.log('Avatar changed:', file.name);
        alert(`Avatar changed: ${file.name}`);
      }
    },
    template: `
      <zl-my-profile
        [profile]="profile"
        [loading]="loading"
        [readonly]="readonly"
        [showAvatar]="showAvatar"
        [showBio]="showBio"
        [compact]="compact"
        (profileUpdate)="onProfileUpdate($event)"
        (cancel)="onCancel()"
        (avatarChange)="onAvatarChange($event)"
      ></zl-my-profile>
    `
  })
};
