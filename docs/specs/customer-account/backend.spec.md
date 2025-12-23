# Customer Account - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Customer Account & Profile Management

---

## Overview

The Customer Account backend handles user authentication, profile management, and preference storage.

---

## Domain Events

### Account Management

| Event | Description | Payload |
|-------|-------------|---------|
| `AccountCreated` | New account | `{ userId, email, createdAt }` |
| `ProfileUpdated` | Info changed | `{ userId, updatedFields[], updatedAt }` |
| `EmailVerified` | Email confirmed | `{ userId, email, verifiedAt }` |
| `PhoneVerified` | Phone confirmed | `{ userId, phone, verifiedAt }` |
| `LoginAttempted` | Login try | `{ userId, attemptedAt, ipAddress }` |
| `LoginSuccessful` | Authenticated | `{ userId, loggedInAt, sessionId }` |
| `PasswordReset` | Password changed | `{ userId, resetAt }` |

### Preferences

| Event | Description | Payload |
|-------|-------------|---------|
| `SearchPreferencesSaved` | Filters stored | `{ userId, preferences, savedAt }` |
| `NotificationPreferencesUpdated` | Settings changed | `{ userId, emailEnabled, smsEnabled }` |
| `CommunicationPreferencesSet` | Marketing prefs | `{ userId, marketingOptIn, updatedAt }` |

---

## API Endpoints

### Authentication

```
POST /api/v1/auth/register
  Description: Create new account
  Auth: None
  Request Body:
    {
      "email": "string",
      "password": "string",
      "firstName": "string",
      "lastName": "string",
      "phone": "string (optional)",
      "marketingOptIn": boolean
    }
  Response: 201 Created
    {
      "userId": "uuid",
      "email": "string",
      "verificationEmailSent": true
    }

POST /api/v1/auth/login
  Description: Authenticate user
  Auth: None
  Request Body:
    {
      "email": "string",
      "password": "string",
      "rememberMe": boolean
    }
  Response: 200 OK
    {
      "accessToken": "string",
      "refreshToken": "string",
      "expiresIn": number,
      "user": { ... }
    }

POST /api/v1/auth/logout
  Description: End session
  Auth: Required
  Response: 204 No Content

POST /api/v1/auth/refresh
  Description: Refresh access token
  Auth: Refresh token
  Response: 200 OK
    {
      "accessToken": "string",
      "expiresIn": number
    }

POST /api/v1/auth/forgot-password
  Description: Request password reset
  Auth: None
  Request Body:
    {
      "email": "string"
    }
  Response: 200 OK

POST /api/v1/auth/reset-password
  Description: Set new password
  Auth: Reset token
  Request Body:
    {
      "token": "string",
      "newPassword": "string"
    }
  Response: 200 OK

POST /api/v1/auth/verify-email
  Description: Verify email address
  Auth: Verification token
  Request Body:
    {
      "token": "string"
    }
  Response: 200 OK

POST /api/v1/auth/verify-phone
  Description: Verify phone number
  Auth: Required
  Request Body:
    {
      "code": "string"
    }
  Response: 200 OK

POST /api/v1/auth/send-verification
  Description: Resend verification
  Auth: Required
  Request Body:
    {
      "type": "email|phone"
    }
  Response: 200 OK
```

### Profile

```
GET /api/v1/users/me
  Description: Get current user profile
  Auth: Required
  Response: 200 OK
    {
      "id": "uuid",
      "email": "string",
      "phone": "string",
      "firstName": "string",
      "lastName": "string",
      "dateOfBirth": "YYYY-MM-DD",
      "emailVerified": boolean,
      "phoneVerified": boolean,
      "createdAt": "ISO-8601",
      "lastLoginAt": "ISO-8601"
    }

PUT /api/v1/users/me
  Description: Update profile
  Auth: Required
  Request Body:
    {
      "firstName": "string",
      "lastName": "string",
      "phone": "string",
      "dateOfBirth": "YYYY-MM-DD"
    }
  Response: 200 OK

PUT /api/v1/users/me/email
  Description: Change email
  Auth: Required
  Request Body:
    {
      "newEmail": "string",
      "password": "string"
    }
  Response: 200 OK

PUT /api/v1/users/me/password
  Description: Change password
  Auth: Required
  Request Body:
    {
      "currentPassword": "string",
      "newPassword": "string"
    }
  Response: 200 OK
```

### Preferences

```
GET /api/v1/users/me/preferences
  Description: Get user preferences
  Auth: Required
  Response: 200 OK
    {
      "notifications": {
        "email": {
          "purchaseUpdates": boolean,
          "deliveryNotifications": boolean,
          "priceAlerts": boolean,
          "newInventory": boolean,
          "newsletter": boolean
        },
        "sms": {
          "deliveryDay": boolean,
          "appointments": boolean,
          "promotions": boolean
        },
        "push": {
          "deliveryTracking": boolean,
          "favoriteUpdates": boolean
        }
      },
      "search": {
        "defaultLocation": "string",
        "defaultRadius": number,
        "preferredMakes": ["string"]
      }
    }

PUT /api/v1/users/me/preferences
  Description: Update preferences
  Auth: Required
  Request Body: { ... }
  Response: 200 OK

GET /api/v1/users/me/addresses
  Description: Get saved addresses
  Auth: Required
  Response: 200 OK

POST /api/v1/users/me/addresses
  Description: Add address
  Auth: Required

DELETE /api/v1/users/me/addresses/:addressId
  Description: Remove address
  Auth: Required
```

### Security

```
GET /api/v1/users/me/sessions
  Description: Get active sessions
  Auth: Required
  Response: 200 OK
    {
      "sessions": [
        {
          "id": "uuid",
          "device": "string",
          "location": "string",
          "lastActive": "ISO-8601",
          "current": boolean
        }
      ]
    }

DELETE /api/v1/users/me/sessions/:sessionId
  Description: Revoke session
  Auth: Required
  Response: 204 No Content

POST /api/v1/users/me/2fa/enable
  Description: Enable 2FA
  Auth: Required
  Response: 200 OK
    {
      "secret": "string",
      "qrCodeUrl": "string"
    }

POST /api/v1/users/me/2fa/verify
  Description: Verify 2FA setup
  Auth: Required
  Request Body:
    {
      "code": "string"
    }
  Response: 200 OK

DELETE /api/v1/users/me/2fa
  Description: Disable 2FA
  Auth: Required
  Request Body:
    {
      "code": "string"
    }
  Response: 204 No Content
```

---

## Data Models

```typescript
interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  phone?: string;
  phoneVerified: boolean;
  phoneVerifiedAt?: Date;
  passwordHash: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  status: 'active' | 'suspended' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

interface Session {
  id: string;
  userId: string;
  refreshToken: string;
  device: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  createdAt: Date;
  expiresAt: Date;
  lastActiveAt: Date;
}

interface UserPreferences {
  userId: string;
  notifications: NotificationPreferences;
  search: SearchPreferences;
  updatedAt: Date;
}
```

---

## Security

### Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- Bcrypt hashing (cost factor 12)

### Session Management

- JWT access tokens (15 min expiry)
- Refresh tokens (30 days)
- Token rotation on refresh
- Concurrent session limit: 5

### Rate Limiting

- Login: 5 attempts per 15 minutes
- Password reset: 3 per hour
- Verification: 3 per hour

---

## OAuth Integration

### Providers

- Google OAuth 2.0
- Apple Sign-in
- Facebook Login

### Flow

1. Redirect to provider
2. Receive authorization code
3. Exchange for tokens
4. Create/link user account
5. Issue session tokens
