# Customer Account - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Customer Account Management
**Platform:** Clutch Clone - Online Used Car Marketplace

---

## Overview

Backend services for customer accounts handle authentication, authorization, profile management, and user data storage with security best practices.

---

## API Endpoints

### POST /api/v1/auth/register

Register new user.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "acceptedTerms": true,
  "marketingOptIn": false
}
```

**Response (201 Created):**
```json
{
  "userId": "usr_abc123",
  "email": "john@example.com",
  "emailVerificationSent": true,
  "createdAt": "2025-12-23T10:00:00Z"
}
```

---

### POST /api/v1/auth/login

Authenticate user.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "rememberMe": true
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600,
  "user": {
    "id": "usr_abc123",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "emailVerified": true
  }
}
```

---

### GET /api/v1/users/me

Get current user profile.

**Response:**
```json
{
  "id": "usr_abc123",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "416-555-1234",
  "avatar": "https://cdn.example.com/avatars/abc123.jpg",
  "emailVerified": true,
  "phoneVerified": false,
  "addresses": [
    {
      "id": "addr_001",
      "type": "home",
      "street": "123 Main St",
      "city": "Toronto",
      "province": "ON",
      "postalCode": "M5V 2T6",
      "isDefault": true
    }
  ],
  "preferences": {
    "emailNotifications": true,
    "smsNotifications": false,
    "marketingEmails": false
  },
  "createdAt": "2025-12-23T10:00:00Z"
}
```

---

### GET /api/v1/users/me/dashboard

Get dashboard data.

**Response:**
```json
{
  "summary": {
    "activeOrders": 1,
    "savedVehicles": 5,
    "pendingTradeIns": 1,
    "unreadNotifications": 3
  },
  "activeOrder": {
    "orderId": "ord_abc123",
    "orderNumber": "CLT-2025-12345",
    "status": "pending_delivery",
    "vehicleTitle": "2021 Honda Civic LX",
    "deliveryDate": "2025-12-28"
  },
  "pendingTradeIn": {
    "offerId": "offer_xyz789",
    "vehicleTitle": "2018 Toyota Camry",
    "offerAmount": 1250000,
    "validUntil": "2025-12-30"
  },
  "recentActivity": [
    {
      "type": "order_update",
      "message": "Delivery scheduled for Dec 28",
      "timestamp": "2025-12-23T14:00:00Z"
    }
  ]
}
```

---

### GET /api/v1/users/me/favorites

Get saved vehicles.

**Response:**
```json
{
  "favorites": [
    {
      "id": "veh_abc123",
      "make": "Honda",
      "model": "Civic",
      "year": 2021,
      "price": 2499900,
      "mileage": 35420,
      "primaryImage": "https://cdn.example.com/vehicles/abc123/1.webp",
      "addedAt": "2025-12-20T10:00:00Z"
    }
  ],
  "totalCount": 5
}
```

---

## Domain Events

| Event | Description | Payload |
|-------|-------------|---------|
| `AccountCreated` | New user registered | `{ userId, email }` |
| `EmailVerified` | Email confirmed | `{ userId }` |
| `PhoneVerified` | Phone confirmed | `{ userId }` |
| `LoginSuccessful` | User authenticated | `{ userId, sessionId }` |
| `LoginAttempted` | Login attempt | `{ email, success, ipAddress }` |
| `PasswordReset` | Password changed | `{ userId }` |
| `ProfileUpdated` | Profile modified | `{ userId, updatedFields }` |
| `SearchPreferencesSaved` | Preferences saved | `{ userId, preferences }` |
| `NotificationPreferencesUpdated` | Settings changed | `{ userId }` |
| `FavoriteAdded` | Vehicle favorited | `{ userId, vehicleId }` |
| `FavoriteRemoved` | Vehicle unfavorited | `{ userId, vehicleId }` |

---

## Security Requirements

- Password hashing: bcrypt with cost factor 12
- JWT tokens with 1-hour expiry
- Refresh tokens with 30-day expiry
- Rate limiting on auth endpoints
- Account lockout after 5 failed attempts
- CSRF protection on all forms
- Secure, HttpOnly cookies for tokens

---

## Class Diagram

See [class-diagram.puml](./class-diagram.puml)
