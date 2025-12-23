# Identity - Frontend Additional Functionality Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Authenticated User UI & Dashboard
**Platform:** ZoomLoop - Online Used Car Marketplace
**Phase:** A (MVP)

---

## Overview

This specification defines the frontend behavior for authenticated user interactions including the sign-in state display, user menu, and the MyDashboard page with profile management cards.

---

## Requirements

### REQ-ID-F-001: Authenticated User Header Display
**Description:** Display signed-in user's name instead of "Sign In" button upon successful authentication
**Priority:** High
**Phase:** A

**Acceptance Criteria:**
- [ ] Upon successful authentication, the "Sign In" text shall be replaced with the signed-in user's first name
- [ ] The user's name shall be displayed as a clickable element in the header
- [ ] Clicking the user's name shall open an Angular Material 21 menu
- [ ] The display shall update immediately after login without page refresh
- [ ] The display shall revert to "Sign In" upon logout

### REQ-ID-F-002: User Menu
**Description:** Angular Material 21 dropdown menu for authenticated users
**Priority:** High
**Phase:** A

**Acceptance Criteria:**
- [ ] The menu shall be triggered by clicking the signed-in user's name
- [ ] The menu shall use Angular Material 21 menu component (`mat-menu`)
- [ ] The menu shall contain the following options:
  - **My Profile** - Router link to `/my-dashboard`
  - **Sign out** - Triggers sign out action

**Menu Structure:**
```
┌────────────────────────┐
│  My Profile       →    │
├────────────────────────┤
│  Sign out              │
└────────────────────────┘
```

### REQ-ID-F-003: MyDashboard Page
**Description:** User dashboard with card-based layout
**Priority:** High
**Phase:** A

**Acceptance Criteria:**
- [ ] Dashboard shall be accessible via `/my-dashboard` route
- [ ] Dashboard shall display a responsive grid of cards
- [ ] Cards shall stack vertically on mobile devices (< 768px)
- [ ] Cards shall display in a 2-3 column grid on tablet/desktop
- [ ] Dashboard shall require authentication (protected route)

**Dashboard Cards:**

| Card | Description | Visibility |
|------|-------------|------------|
| Personal Info | User profile information and edit options | All users |
| My Cars | List of user's saved/purchased vehicles | Non-admin only |
| My Orders | Order history and status tracking | Non-admin only |
| Notifications | User notification preferences and history | All users |
| Rewards | Loyalty points and rewards program | Non-admin only |
| Saved Searches | Saved vehicle search filters | Non-admin only |

---

## UI Components

### User Header Menu (Authenticated State)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Z] ZoomLoop    Buy    Sell/Trade    How It Works    John ▼   [Buy]│
└─────────────────────────────────────────────────────────────────────┘
                                                         │
                                                    ┌────┴───────────┐
                                                    │  My Profile    │
                                                    ├────────────────┤
                                                    │  Sign out      │
                                                    └────────────────┘
```

### MyDashboard Layout

```
Desktop/Tablet (≥768px):
┌──────────────────────────────────────────────────────────────────────┐
│  My Dashboard                                                         │
│  ─────────────                                                        │
│                                                                       │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐│
│  │   Personal Info   │  │     My Cars       │  │    My Orders      ││
│  │                   │  │                   │  │                   ││
│  │  Name: John Doe   │  │  [Vehicle Card]   │  │  Order #12345     ││
│  │  Email: john@...  │  │  [Vehicle Card]   │  │  Status: Pending  ││
│  │  Phone: 555-1234  │  │                   │  │                   ││
│  │                   │  │  [View All →]     │  │  [View All →]     ││
│  │  [Edit Profile]   │  │                   │  │                   ││
│  └───────────────────┘  └───────────────────┘  └───────────────────┘│
│                                                                       │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐│
│  │  Notifications    │  │     Rewards       │  │  Saved Searches   ││
│  │                   │  │                   │  │                   ││
│  │  • Email: On      │  │  Points: 1,250    │  │  "SUV under 30k"  ││
│  │  • SMS: Off       │  │  Level: Silver    │  │  "2022+ Sedan"    ││
│  │  • Push: On       │  │                   │  │                   ││
│  │                   │  │  [View Rewards]   │  │  [View All →]     ││
│  │  [Manage →]       │  │                   │  │                   ││
│  └───────────────────┘  └───────────────────┘  └───────────────────┘│
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘

Mobile (<768px):
┌──────────────────────┐
│  My Dashboard        │
│  ─────────────       │
│                      │
│  ┌──────────────────┐│
│  │  Personal Info   ││
│  │  ...             ││
│  └──────────────────┘│
│                      │
│  ┌──────────────────┐│
│  │  My Cars         ││
│  │  ...             ││
│  └──────────────────┘│
│                      │
│  ┌──────────────────┐│
│  │  My Orders       ││
│  │  ...             ││
│  └──────────────────┘│
│                      │
│  ┌──────────────────┐│
│  │  Notifications   ││
│  │  ...             ││
│  └──────────────────┘│
│                      │
│  ┌──────────────────┐│
│  │  Rewards         ││
│  │  ...             ││
│  └──────────────────┘│
│                      │
│  ┌──────────────────┐│
│  │  Saved Searches  ││
│  │  ...             ││
│  └──────────────────┘│
│                      │
└──────────────────────┘
```

---

## State Management

```typescript
interface DashboardState {
  user: User | null;
  isAdmin: boolean;

  // Dashboard data
  personalInfo: {
    loading: boolean;
    data: UserProfile | null;
  };

  myCars: {
    loading: boolean;
    vehicles: VehicleSummary[];
    total: number;
  };

  myOrders: {
    loading: boolean;
    orders: OrderSummary[];
    total: number;
  };

  notifications: {
    loading: boolean;
    preferences: NotificationPreferences;
    unreadCount: number;
  };

  rewards: {
    loading: boolean;
    points: number;
    level: string;
    history: RewardActivity[];
  };

  savedSearches: {
    loading: boolean;
    searches: SavedSearch[];
    total: number;
  };
}

interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  addresses: Address[];
}

interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  marketing: boolean;
}

interface SavedSearch {
  id: string;
  name: string;
  filters: VehicleFilters;
  matchCount: number;
  createdAt: string;
  lastNotified?: string;
}
```

---

## Events Emitted

| Event | Trigger | Data |
|-------|---------|------|
| `UserMenuOpened` | User clicks name in header | `{ userId }` |
| `NavigatedToDashboard` | User navigates to dashboard | `{ userId, source }` |
| `ProfileViewed` | Dashboard loads | `{ userId }` |
| `SignOutClicked` | User clicks sign out | `{ userId }` |
| `DashboardCardClicked` | User clicks a dashboard card | `{ userId, cardType }` |

---

## Technical Implementation Notes

### Angular Material 21 Menu Setup

```typescript
// Required imports
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Template usage
<button mat-button [matMenuTriggerFor]="userMenu">
  {{ userName }}
  <mat-icon>arrow_drop_down</mat-icon>
</button>

<mat-menu #userMenu="matMenu">
  <button mat-menu-item routerLink="/my-dashboard">
    <mat-icon>person</mat-icon>
    <span>My Profile</span>
  </button>
  <button mat-menu-item (click)="onSignOut()">
    <mat-icon>logout</mat-icon>
    <span>Sign out</span>
  </button>
</mat-menu>
```

### Dashboard Card Grid (CSS Grid)

```scss
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  padding: 24px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    padding: 16px;
  }
}

.dashboard-card {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 24px;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
}
```

### Route Guard

```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated) {
    return true;
  }

  return router.createUrlTree(['/'], {
    queryParams: { returnUrl: state.url }
  });
};
```

---

## Accessibility Requirements

- Menu must be keyboard navigable (Tab, Enter, Escape)
- Menu items must have proper ARIA labels
- Dashboard cards must be properly labeled for screen readers
- Focus management when opening/closing menu
- Color contrast ratios must meet WCAG 2.1 AA standards
