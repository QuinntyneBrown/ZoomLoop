# Customer Account - Frontend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Customer Account & Profile Management

---

## Overview

The Customer Account feature enables users to create accounts, manage their profile, track purchases, and set preferences.

---

## User Stories

### US-1: Create Account
**As a** new user
**I want to** create an account
**So that** I can save my progress and purchases

### US-2: Manage Profile
**As a** customer
**I want to** update my profile information
**So that** my details are current

### US-3: View My Purchases
**As a** customer
**I want to** view my purchase history
**So that** I can track my vehicles

### US-4: Set Preferences
**As a** customer
**I want to** configure my notification preferences
**So that** I control how I'm contacted

---

## UI Components

### Registration Form

```
┌─────────────────────────────────────┐
│  Create Your Account                │
│                                       │
│  Email                               │
│  [_______________________]           │
│                                       │
│  Password                            │
│  [_______________________] 👁️        │
│  ● Min 8 characters                  │
│  ○ One uppercase letter              │
│  ○ One number                        │
│                                       │
│  Phone (optional)                    │
│  [_______________________]           │
│                                       │
│  ☐ I agree to Terms of Service      │
│  ☐ Send me updates and offers       │
│                                       │
│  [Create Account]                    │
│                                       │
│  Already have an account? Log in    │
│                                       │
│  ─── or continue with ───           │
│  [Google] [Apple] [Facebook]        │
└─────────────────────────────────────┘
```

### Login Form

```
┌─────────────────────────────────────┐
│  Welcome Back                        │
│                                       │
│  Email                               │
│  [_______________________]           │
│                                       │
│  Password                            │
│  [_______________________] 👁️        │
│                                       │
│  ☐ Remember me    Forgot password?  │
│                                       │
│  [Log In]                            │
│                                       │
│  New here? Create an account        │
│                                       │
│  ─── or continue with ───           │
│  [Google] [Apple] [Facebook]        │
└─────────────────────────────────────┘
```

### Account Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  My Account                                                   │
│                                                                │
│  ┌──────────────────┐ ┌──────────────────┐ ┌───────────────┐│
│  │  My Vehicles     │ │  Favorites       │ │  Documents    ││
│  │  2               │ │  5               │ │  8            ││
│  └──────────────────┘ └──────────────────┘ └───────────────┘│
│                                                                │
│  Quick Links                                                  │
│  ────────────                                                 │
│  📝 Profile Settings                                         │
│  🔔 Notification Preferences                                 │
│  💳 Payment Methods                                          │
│  📍 Saved Addresses                                          │
│  🔒 Security Settings                                        │
│  📞 Support                                                  │
│                                                                │
│  Recent Activity                                              │
│  ────────────────                                             │
│  • Viewed 2021 Honda Civic - 2 hours ago                     │
│  • Added Toyota RAV4 to favorites - Yesterday                │
│  • Updated payment method - 3 days ago                       │
│                                                                │
└─────────────────────────────────────────────────────────────┘
```

### Profile Settings Page

```
┌─────────────────────────────────────────────────────────────┐
│  Profile Settings                                            │
│                                                                │
│  Personal Information                                        │
│  ─────────────────────                                        │
│  First Name          Last Name                               │
│  [John             ] [Smith            ]                     │
│                                                                │
│  Email                                                        │
│  [john@example.com           ] ✓ Verified                    │
│                                                                │
│  Phone                                                        │
│  [(416) 555-0123             ] [Verify]                      │
│                                                                │
│  Date of Birth                                               │
│  [January ▼] [15 ▼] [1985 ▼]                                │
│                                                                │
│  [Save Changes]                                               │
│                                                                │
└─────────────────────────────────────────────────────────────┘
```

### Notification Preferences

```
┌─────────────────────────────────────────────────────────────┐
│  Notification Preferences                                    │
│                                                                │
│  Email Notifications                                         │
│  ─────────────────────                                        │
│  [●] Purchase updates                                        │
│  [●] Delivery notifications                                  │
│  [○] Price drop alerts                                       │
│  [○] New inventory matching preferences                      │
│  [○] Newsletter and promotions                               │
│                                                                │
│  SMS Notifications                                           │
│  ─────────────────                                            │
│  [●] Delivery day updates                                    │
│  [●] Appointment reminders                                   │
│  [○] Promotional offers                                      │
│                                                                │
│  Push Notifications                                          │
│  ──────────────────                                           │
│  [●] Real-time delivery tracking                             │
│  [○] Favorited vehicle updates                               │
│                                                                │
│  [Save Preferences]                                           │
│                                                                │
└─────────────────────────────────────────────────────────────┘
```

### My Vehicles Page

```
┌─────────────────────────────────────────────────────────────┐
│  My Vehicles                                                  │
│                                                                │
│  Current Vehicles                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  🚗 2021 Honda Civic LX                                  ││
│  │  Purchased: Dec 21, 2025                                 ││
│  │  Trial Period: 7 days remaining                          ││
│  │  VIN: 1HGBH41JXMN109186                                 ││
│  │                                                           ││
│  │  [View Details]  [Documents]  [Request Service]          ││
│  └─────────────────────────────────────────────────────────┘│
│                                                                │
│  Past Vehicles                                                │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  2018 Toyota Camry (Trade-in) - Dec 21, 2025            ││
│  └─────────────────────────────────────────────────────────┘│
│                                                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Page Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/register` | RegistrationPage | Create account |
| `/login` | LoginPage | Sign in |
| `/forgot-password` | ForgotPasswordPage | Password reset |
| `/my/dashboard` | AccountDashboard | Account home |
| `/my/profile` | ProfilePage | Profile settings |
| `/my/preferences` | PreferencesPage | Notifications |
| `/my/vehicles` | MyVehiclesPage | Owned vehicles |
| `/my/favorites` | FavoritesPage | Saved vehicles |
| `/my/documents` | DocumentsPage | All documents |
| `/my/payments` | PaymentMethodsPage | Payment methods |
| `/my/security` | SecurityPage | Password, 2FA |

---

## State Management

```typescript
interface UserState {
  user: {
    id: string;
    email: string;
    phone?: string;
    firstName: string;
    lastName: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    createdAt: Date;
  } | null;
  isAuthenticated: boolean;
  preferences: {
    emailNotifications: NotificationSettings;
    smsNotifications: NotificationSettings;
    pushNotifications: NotificationSettings;
  };
  vehicles: Vehicle[];
  favorites: Vehicle[];
}
```

---

## API Integration

```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
POST /api/v1/auth/verify-email
POST /api/v1/auth/verify-phone

GET /api/v1/users/me
PUT /api/v1/users/me
PUT /api/v1/users/me/preferences
PUT /api/v1/users/me/password

GET /api/v1/users/me/vehicles
GET /api/v1/users/me/favorites
GET /api/v1/users/me/documents
```

---

## Security Features

- Password strength meter
- Email verification required
- Phone verification optional
- 2FA support (TOTP)
- Session management
- Login history

---

## Analytics Events

- `account_created`
- `login_successful`
- `profile_updated`
- `preferences_updated`
- `password_changed`
- `2fa_enabled`
