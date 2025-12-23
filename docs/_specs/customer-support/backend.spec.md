# Customer Support - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Customer Service & Support

---

## Overview

The Customer Support backend handles support tickets, customer inquiries, feedback collection, and help content management.

---

## Domain Events

### Support Interactions

| Event | Description | Payload |
|-------|-------------|---------|
| `SupportTicketCreated` | Ticket opened | `{ ticketId, customerId, issue, priority, createdAt }` |
| `CustomerInquiryReceived` | Question logged | `{ inquiryId, customerId, channel, message }` |
| `AdvisorResponseSent` | Reply sent | `{ responseId, ticketId, message, advisorId }` |
| `IssueResolved` | Ticket closed | `{ ticketId, resolvedAt, resolution, advisorId }` |
| `IssueEscalated` | Ticket elevated | `{ ticketId, escalatedAt, reason, assignedTo }` |
| `CallbackScheduled` | Call arranged | `{ callbackId, scheduledTime, customerId }` |

### Feedback

| Event | Description | Payload |
|-------|-------------|---------|
| `ReviewRequested` | Review asked | `{ requestId, customerId, vehicleId }` |
| `ReviewSubmitted` | Review given | `{ reviewId, rating, comments }` |
| `RatingProvided` | Score given | `{ ratingId, score, category }` |
| `FeedbackReceived` | Feedback sent | `{ feedbackId, type, message }` |
| `SurveyCompleted` | Survey done | `{ surveyId, responses[] }` |

---

## API Endpoints

### Help Articles

```
GET /api/v1/help/articles
  Description: Search help articles
  Auth: Optional
  Query Parameters:
    - q: string (search query)
    - category: string
    - page: number
    - limit: number
  Response: 200 OK
    {
      "articles": [
        {
          "id": "uuid",
          "title": "string",
          "slug": "string",
          "excerpt": "string",
          "category": "string",
          "helpful": number,
          "updatedAt": "ISO-8601"
        }
      ],
      "categories": [
        { "name": "string", "count": number }
      ],
      "pagination": { ... }
    }

GET /api/v1/help/articles/:slug
  Description: Get single article
  Auth: Optional
  Response: 200 OK
    {
      "id": "uuid",
      "title": "string",
      "slug": "string",
      "content": "string (markdown)",
      "category": "string",
      "relatedArticles": [],
      "helpful": number,
      "notHelpful": number,
      "createdAt": "ISO-8601",
      "updatedAt": "ISO-8601"
    }

POST /api/v1/help/articles/:id/feedback
  Description: Rate article helpfulness
  Auth: Optional
  Request Body:
    {
      "helpful": boolean
    }
  Response: 200 OK
```

### Support Tickets

```
POST /api/v1/support/tickets
  Description: Create support ticket
  Auth: Required
  Request Body:
    {
      "topic": "delivery|payment|financing|warranty|return|documents|account|other",
      "vehicleId": "uuid (optional)",
      "purchaseId": "uuid (optional)",
      "subject": "string",
      "message": "string",
      "attachments": ["string"],
      "preferredContact": "email|phone|either"
    }
  Response: 201 Created
    {
      "ticketId": "uuid",
      "ticketNumber": "string",
      "status": "open",
      "createdAt": "ISO-8601",
      "estimatedResponse": "24 hours"
    }

GET /api/v1/support/tickets
  Description: List user's tickets
  Auth: Required
  Query Parameters:
    - status: open|awaiting_response|resolved|all
    - page: number
    - limit: number
  Response: 200 OK
    {
      "tickets": [
        {
          "ticketId": "uuid",
          "ticketNumber": "string",
          "subject": "string",
          "status": "string",
          "createdAt": "ISO-8601",
          "updatedAt": "ISO-8601",
          "lastMessage": "string"
        }
      ],
      "pagination": { ... }
    }

GET /api/v1/support/tickets/:ticketId
  Description: Get ticket details
  Auth: Required
  Response: 200 OK
    {
      "ticketId": "uuid",
      "ticketNumber": "string",
      "topic": "string",
      "subject": "string",
      "status": "open|awaiting_response|in_progress|resolved|closed",
      "priority": "low|normal|high|urgent",
      "createdAt": "ISO-8601",
      "vehicle": { ... },
      "assignedTo": {
        "id": "uuid",
        "name": "string"
      },
      "messages": [
        {
          "id": "uuid",
          "from": "customer|advisor|system",
          "senderName": "string",
          "message": "string",
          "attachments": ["string"],
          "sentAt": "ISO-8601"
        }
      ]
    }

POST /api/v1/support/tickets/:ticketId/reply
  Description: Reply to ticket
  Auth: Required
  Request Body:
    {
      "message": "string",
      "attachments": ["string"]
    }
  Response: 200 OK
    {
      "messageId": "uuid",
      "sentAt": "ISO-8601"
    }

POST /api/v1/support/tickets/:ticketId/close
  Description: Close ticket (customer)
  Auth: Required
  Request Body:
    {
      "satisfied": boolean,
      "feedback": "string (optional)"
    }
  Response: 200 OK
```

### Callbacks

```
POST /api/v1/support/callbacks
  Description: Request callback
  Auth: Required
  Request Body:
    {
      "phone": "string",
      "preferredTime": "morning|afternoon|evening",
      "preferredDate": "ISO-8601",
      "topic": "string",
      "notes": "string"
    }
  Response: 201 Created
    {
      "callbackId": "uuid",
      "scheduledFor": "ISO-8601",
      "confirmationSent": true
    }

GET /api/v1/support/callbacks
  Description: Get scheduled callbacks
  Auth: Required
  Response: 200 OK
    {
      "callbacks": [
        {
          "callbackId": "uuid",
          "scheduledFor": "ISO-8601",
          "status": "scheduled|completed|missed|cancelled",
          "topic": "string"
        }
      ]
    }

DELETE /api/v1/support/callbacks/:callbackId
  Description: Cancel callback
  Auth: Required
  Response: 204 No Content
```

### Feedback & Reviews

```
POST /api/v1/feedback
  Description: Submit feedback survey
  Auth: Required
  Request Body:
    {
      "purchaseId": "uuid",
      "ratings": {
        "overall": number,
        "vehicleQuality": number,
        "deliveryExperience": number,
        "customerService": number,
        "value": number
      },
      "nps": number,
      "comments": "string",
      "allowPublish": boolean
    }
  Response: 200 OK
    {
      "feedbackId": "uuid",
      "thankYouMessage": "string"
    }

POST /api/v1/reviews
  Description: Submit public review
  Auth: Required
  Request Body:
    {
      "purchaseId": "uuid",
      "rating": number,
      "title": "string",
      "review": "string",
      "photos": ["string"],
      "displayName": "string"
    }
  Response: 201 Created
    {
      "reviewId": "uuid",
      "status": "pending_review"
    }

GET /api/v1/reviews
  Description: Get published reviews
  Auth: Optional
  Query: vehicleType, rating, page, limit
  Response: 200 OK
    {
      "reviews": [
        {
          "id": "uuid",
          "rating": number,
          "title": "string",
          "review": "string",
          "displayName": "string",
          "vehicleInfo": "string",
          "createdAt": "ISO-8601",
          "helpful": number
        }
      ],
      "averageRating": number,
      "ratingBreakdown": {
        "5": number,
        "4": number,
        "3": number,
        "2": number,
        "1": number
      }
    }
```

---

## Data Models

```typescript
interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  vehicleId?: string;
  purchaseId?: string;
  topic: string;
  subject: string;
  status: TicketStatus;
  priority: Priority;
  assignedTo?: string;
  preferredContact: 'email' | 'phone' | 'either';
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  firstResponseAt?: Date;
  satisfaction?: boolean;
}

interface TicketMessage {
  id: string;
  ticketId: string;
  from: 'customer' | 'advisor' | 'system';
  senderId: string;
  senderName: string;
  message: string;
  attachments: string[];
  sentAt: Date;
  readAt?: Date;
}

interface CustomerFeedback {
  id: string;
  customerId: string;
  purchaseId: string;
  ratings: {
    overall: number;
    vehicleQuality: number;
    deliveryExperience: number;
    customerService: number;
    value: number;
  };
  nps: number;
  comments?: string;
  allowPublish: boolean;
  submittedAt: Date;
}

enum TicketStatus {
  OPEN = 'open',
  AWAITING_RESPONSE = 'awaiting_response',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

enum Priority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}
```

---

## Business Rules

1. First response SLA: 24 hours
2. Urgent tickets: 4 hours
3. Auto-close after 7 days inactive
4. Escalation after 48 hours unresolved
5. Customer satisfaction survey after resolution
6. Reviews require verified purchase
7. Reviews moderated before publishing

---

## Service Dependencies

### External Services

- **Zendesk/Intercom**: Ticketing system (optional)
- **Twilio**: Phone callbacks
- **Email Service**: Notifications

### Internal Services

- **User Service**: Customer info
- **Purchase Service**: Order details
- **Notification Service**: Alerts
