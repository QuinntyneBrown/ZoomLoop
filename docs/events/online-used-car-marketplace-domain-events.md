# Online Used Car Marketplace Platform - Domain Events Catalog

## Overview

This document provides a comprehensive catalog of domain events for an online used car marketplace platform. These events represent the key business moments and state changes throughout the platform's operations, from vehicle acquisition through delivery and post-sale support.

**Platform Type:** Online Used Car Marketplace  
**Domain:** Automotive E-Commerce / Managed Marketplace  
**Business Model:** Vertical Integration (Acquisition → Reconditioning → Sales → Delivery)

---

## 1. Vehicle Acquisition (Buying from Sellers)

### 1.1 Instant Offer Generation

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `OfferRequested` | Customer initiates the process to get an offer for their vehicle | User clicks "Get an Offer" | UserId, Timestamp |
| `VehicleDetailsSubmitted` | Customer completes vehicle information form | Form submission | VIN, Make, Model, Year, Mileage, Condition, Photos |
| `AIOfferGenerated` | AI system generates a firm offer (every 23 seconds) | Vehicle details validated | OfferId, OfferAmount, VehicleId, ExpiryDate |
| `FirmOfferCreated` | Formal offer created and presented to customer | AI valuation complete | OfferId, OfferAmount, ValidUntil |
| `OfferAccepted` | Customer accepts the offer | Customer confirmation | OfferId, AcceptedAt, CustomerId |
| `OfferRejected` | Customer declines the offer | Customer declines | OfferId, RejectedAt, Reason |
| `OfferExpired` | Offer validity period has ended | Time-based trigger | OfferId, ExpiredAt |

**Business Context:**
- High-volume offer generation system (thousands daily)
- AI-powered instant valuation system
- Competitive pricing typically above dealer trade-in offers

### 1.2 Vehicle Appraisal & Inspection

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `AppraisalScheduled` | Physical inspection appointment booked | Offer accepted | AppointmentId, ScheduledDate, Location, InspectorId |
| `VehicleInspectionStarted` | Inspector begins vehicle evaluation | Inspector check-in | InspectionId, VehicleId, InspectorId, StartTime |
| `VehicleInspected` | Physical inspection in progress | During inspection | InspectionId, CheckpointsPassed, Issues[] |
| `InspectionCompleted` | All inspection points verified | Inspector sign-off | InspectionId, CompletedAt, FinalCondition |
| `ConditionAssessed` | Vehicle condition evaluated against submitted details | Post-inspection | InspectionId, ActualCondition, DiscrepanciesFound |
| `OfferAdjusted` | Original offer modified based on actual condition | Discrepancies found | OfferId, OriginalAmount, AdjustedAmount, Reason |
| `FinalOfferConfirmed` | Final purchase price agreed upon | Customer acceptance | OfferId, FinalAmount, ConfirmedAt |

**Business Context:**
- Includes test drive and comprehensive inspection
- Original price honored if no discrepancies found
- Typically 20-minute inspection at customer location

### 1.3 Vehicle Purchase

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `PurchaseAgreementSigned` | Legal agreement executed | Document signing | AgreementId, VehicleId, SellerId, Amount |
| `VehiclePurchased` | Ownership transfer initiated | Agreement complete | PurchaseId, VehicleId, Amount, PurchaseDate |
| `PaymentInitiated` | Payment processing started | Purchase confirmation | PaymentId, Amount, PaymentMethod |
| `InstantPaymentProcessed` | Funds deposited instantly to seller's bank account | New instant payment tech | PaymentId, Amount, BankAccountId, ProcessedAt |
| `FundsTransferred` | Payment completed to seller | Bank confirmation | PaymentId, TransferredAt, ConfirmationNumber |
| `VehiclePickupScheduled` | Collection appointment arranged | Payment confirmed | PickupId, ScheduledDate, Location, DriverId |
| `VehicleCollected` | Vehicle physically picked up from seller | Driver confirmation | PickupId, CollectedAt, VehicleCondition, MileageReading |

**Business Context:**
- Instant payment technology for immediate fund transfers
- Free transportation provided to sellers after vehicle pickup
- Streamlined payment process

---

## 2. Vehicle Reconditioning & Production

### 2.1 210-Point Inspection

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `VehicleReceivedAtFacility` | Vehicle arrives at production facility | Physical arrival | VehicleId, FacilityId, ReceivedAt, MileageIn |
| `ProductionStarted` | Reconditioning process begins | Queue assignment | ProductionJobId, VehicleId, StartedAt, EstimatedCompletion |
| `InspectionPointCompleted` | Individual checkpoint passed (×210) | Inspector verification | InspectionPointId, PointNumber, Status, Notes |
| `SafetyInspectionPassed` | All safety-critical items verified | Safety checklist complete | VehicleId, InspectorId, PassedAt |
| `QualityCheckCompleted` | Final quality verification | Production complete | VehicleId, QualityScore, InspectorId |

**Business Context:**
- State-of-the-art production facilities
- High-volume production line with consistent output
- Comprehensive multi-point inspection process

### 2.2 Reconditioning

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `ReconditioningStarted` | Repair and refurbishment begins | Inspection findings | VehicleId, WorkOrderId, StartedAt |
| `RepairItemIdentified` | Specific issue requiring attention | Inspector finding | RepairItemId, Category, Severity, EstimatedCost |
| `RepairCompleted` | Individual repair work finished | Technician sign-off | RepairItemId, CompletedAt, ActualCost, TechnicianId |
| `DetailingCompleted` | Cleaning and cosmetic work finished | Detail team sign-off | VehicleId, DetailedAt, DetailLevel |
| `VehiclePhotographed` | Professional photos taken for listing | Detailing complete | VehicleId, PhotoSessionId, PhotoCount, PhotoUrls[] |

### 2.3 Certification

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `VehicleCertificationStarted` | Certification process initiated | Quality check passed | CertificationId, VehicleId, StartedAt |
| `VehicleHistoryReportGenerated` | Vehicle history report created | VIN lookup | VehicleId, ReportId, ReportUrl |
| `VehicleHistoryVerified` | Clean history confirmed | Report review | VehicleId, HistoryStatus, AccidentHistory, OwnerCount |
| `VehicleCertified` | Platform certified status granted | All checks passed | VehicleId, CertifiedAt, CertificationNumber |
| `CertificationFailed` | Vehicle did not meet certification standards | Quality issues found | VehicleId, FailureReasons[], FailedAt |

**Business Context:**
- Free vehicle history report included with every vehicle
- Comprehensive verification of accident/damage records, registrations, and stolen status

### 2.4 Inventory Decision

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `VehicleApprovedForRetail` | Vehicle meets retail standards | Certification passed | VehicleId, ApprovedAt, TargetPrice |
| `VehicleRejectedForRetail` | Vehicle doesn't meet retail criteria | Quality/market analysis | VehicleId, RejectionReasons[], RejectedAt |
| `VehicleSentToWholesale` | Vehicle directed to dealer/auction partners | Retail rejection | VehicleId, WholesaleChannel, SentAt |
| `VehicleListedForSale` | Vehicle published to marketplace | Retail approval | ListingId, VehicleId, ListedAt, Price |

**Business Context:**
- Vehicles not meeting retail standards sold to wholesale channels
- Multi-channel distribution strategy (retail and wholesale)

---

## 3. Inventory Management

### 3.1 Listing Management

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `VehicleListingCreated` | New listing entry created | Vehicle certified | ListingId, VehicleId, CreatedAt |
| `VehicleDetailsUpdated` | Listing information modified | Admin/system update | ListingId, UpdatedFields[], UpdatedAt |
| `PriceSet` | Firm price established (no negotiation) | Pricing algorithm | ListingId, Price, PricingStrategy |
| `PhotosUploaded` | Images added to listing | Photo session complete | ListingId, PhotoUrls[], UploadedAt |
| `ListingPublished` | Listing made visible to customers | Final approval | ListingId, PublishedAt, Visibility |
| `ListingFeatured` | Listing promoted in search results | Marketing decision | ListingId, FeaturedFrom, FeaturedTo |
| `ListingDeactivated` | Listing removed from public view | Sale/removal | ListingId, DeactivatedAt, Reason |
| `VehicleSold` | Vehicle successfully sold | Purchase complete | ListingId, SoldAt, FinalPrice, BuyerId |

**Business Context:**
- Large inventory across multiple vehicle types (sedans, SUVs, trucks, vans)
- Firm pricing model (no negotiation)
- Wide variety of makes and models from major manufacturers

### 3.2 Availability

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `VehicleReserved` | Vehicle temporarily held for customer | Deposit paid | ReservationId, VehicleId, CustomerId, ReservedUntil |
| `ReservationExpired` | Hold period ended without purchase | Time-based | ReservationId, ExpiredAt |
| `VehicleAvailable` | Vehicle ready for purchase | Listing active | VehicleId, AvailableAt |
| `VehicleUnavailable` | Vehicle not available for purchase | Reserved/sold/removed | VehicleId, UnavailableReason, UnavailableAt |

---

## 4. Vehicle Browsing & Search

### 4.1 Search & Discovery

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `UserSearched` | Customer performs search | Search submission | UserId, SearchQuery, Timestamp |
| `FilterApplied` | Search refined with filters | Filter selection | UserId, FilterType, FilterValues[], Timestamp |
| `SearchResultsDisplayed` | Results shown to customer | Search execution | SearchId, ResultCount, Results[] |
| `VehicleViewed` | Customer views vehicle details | Listing clicked | VehicleId, UserId, ViewedAt, Duration |
| `VehicleCompared` | Multiple vehicles compared | Comparison tool used | UserId, VehicleIds[], ComparedAt |
| `FavoriteAdded` | Vehicle saved to favorites | Save button clicked | UserId, VehicleId, FavoritedAt |
| `FavoriteRemoved` | Vehicle removed from favorites | Remove action | UserId, VehicleId, RemovedAt |

**Business Context:**
- Search filters: price, mileage, make, model, body type, location
- Nationwide inventory visibility
- Best/worst deals, distance-based sorting

### 4.2 Vehicle Details

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `VehicleHistoryReportViewed` | Customer accesses vehicle history | Report link clicked | VehicleId, UserId, ViewedAt |
| `PhotoGalleryViewed` | Customer browses vehicle images | Gallery opened | VehicleId, UserId, PhotosViewed[] |
| `SpecificationsViewed` | Technical details accessed | Specs tab clicked | VehicleId, UserId, ViewedAt |
| `PricingDetailsViewed` | Price breakdown examined | Pricing section expanded | VehicleId, UserId, ViewedAt |

---

## 5. Purchase Process (Buying from Clutch)

### 5.1 Reservation

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `GetStartedClicked` | Customer initiates purchase | CTA button clicked | VehicleId, UserId, Timestamp |
| `VehicleReservationInitiated` | Reservation process started | Get Started flow | ReservationId, VehicleId, UserId, InitiatedAt |
| `ContactInformationSubmitted` | Customer provides contact details | Form submission | UserId, Name, Email, Phone, Address |
| `DepositPaid` | $100 refundable deposit processed | Payment confirmed | DepositId, Amount, PaymentMethod, PaidAt |
| `ReservationConfirmed` | Vehicle held for customer | Deposit cleared | ReservationId, VehicleId, ConfirmedAt, ExpiresAt |

**Business Context:**
- $100 refundable deposit required
- Limited-time reservation period

### 5.2 Pre-Purchase

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `AdvisorAssigned` | Customer service rep assigned | Reservation confirmed | AdvisorId, CustomerId, AssignedAt |
| `CustomerContacted` | Advisor reaches out to customer | Assignment | ContactId, AdvisorId, CustomerId, ContactMethod, ContactedAt |
| `PurchaseDiscussionStarted` | Detailed purchase conversation begins | Initial contact | DiscussionId, AdvisorId, CustomerId, StartedAt |
| `FinancingOptionsPresented` | Loan options shown to customer | Credit discussion | CustomerId, FinancingOptions[], PresentedAt |
| `FinancingSelected` | Customer chooses financing option | Customer decision | FinancingApplicationId, SelectedOption, SelectedAt |
| `FinancingApproved` | Loan application approved | Lender decision | FinancingApplicationId, ApprovedAmount, Terms, ApprovedAt |
| `FinancingDeclined` | Loan application denied | Lender decision | FinancingApplicationId, DeclinedAt, Reason |

### 5.3 Documentation

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `PaperworkInitiated` | Documentation process started | Purchase decision | TransactionId, VehicleId, CustomerId, InitiatedAt |
| `PurchaseAgreementGenerated` | Contract created | Financing confirmed | AgreementId, Terms, GeneratedAt |
| `DocumentsSigned` | Customer signs purchase documents | E-signature | AgreementId, SignedAt, SignatureHash |
| `InsuranceUploaded` | Customer provides insurance proof | Document upload | CustomerId, VehicleId, PolicyNumber, InsuranceProvider, UploadedAt |
| `InsuranceVerified` | Insurance coverage confirmed | Verification check | CustomerId, VehicleId, VerifiedAt, VerifierId |
| `RegistrationProcessed` | Vehicle registration handled | Documentation complete | VehicleId, CustomerId, RegistrationNumber, ProcessedAt |

**Business Context:**
- Fully online paperwork process
- Customer responsible for arranging insurance
- Insurance must be uploaded to Clutch profile

### 5.4 Payment

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `PaymentMethodSelected` | Customer chooses payment type | Selection made | CustomerId, PaymentType, SelectedAt |
| `DownPaymentReceived` | Initial payment processed | Payment confirmed | PaymentId, Amount, ReceivedAt |
| `FullPaymentReceived` | Complete purchase amount paid | Final payment | TransactionId, TotalAmount, ReceivedAt |
| `FinancingCompleted` | Loan disbursement finalized | Lender funding | FinancingId, DisbursedAmount, CompletedAt |

---

## 6. Delivery & Logistics

### 6.1 Delivery Scheduling

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `DeliveryMethodSelected` | Customer chooses delivery or pickup | Method selection | TransactionId, DeliveryMethod, SelectedAt |
| `DeliveryScheduled` | Delivery date/time arranged | Scheduling complete | DeliveryId, ScheduledDate, TimeWindow, Address |
| `DeliveryDateConfirmed` | Delivery appointment finalized | Customer confirmation | DeliveryId, ConfirmedDate, ConfirmedAt |
| `DeliveryAddressVerified` | Delivery location validated | Address check | DeliveryId, Address, VerifiedAt |

**Business Context:**
- Home delivery or pickup at platform locations
- Multiple service locations in major metropolitan areas
- In-house logistics network for delivery management

### 6.2 Fulfillment

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `VehiclePreparedForDelivery` | Final prep before transport | Pre-delivery checklist | VehicleId, PreparedAt, PreparedBy |
| `DeliveryAssigned` | Driver assigned to delivery | Logistics scheduling | DeliveryId, DriverId, AssignedAt |
| `VehicleInTransit` | Vehicle en route to customer | Departure logged | DeliveryId, VehicleId, DepartedAt, EstimatedArrival |
| `DeliveryCompleted` | Vehicle successfully delivered | Customer sign-off | DeliveryId, DeliveredAt, DeliveryConfirmationSignature |
| `VehicleHandedOver` | Keys and documents transferred | Physical handoff | DeliveryId, VehicleId, HandoverAt, Mileage |
| `CustomerPickupCompleted` | Customer collected vehicle at location | Pickup sign-off | PickupId, PickedUpAt, LocationId |

### 6.3 Post-Delivery

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `TransportationArranged` | Transportation arranged for customer (sellers) | Vehicle pickup complete | TransportId, CustomerId, PickupAddress, ArrangedAt |
| `DeliveryFeedbackRequested` | Customer asked to rate delivery | Post-delivery | DeliveryId, RequestedAt |
| `DeliveryConfirmed` | Delivery completion verified | Customer acknowledgment | DeliveryId, ConfirmedAt |

---

## 7. Test Ownership (10-Day Money-Back Guarantee)

### 7.1 Trial Period

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `TestOwnershipStarted` | 10-day/750km trial begins | Vehicle delivered | TrialId, VehicleId, CustomerId, StartDate, EndDate |
| `TestDriveCompleted` | Customer test drives vehicle | During trial | TrialId, MileageDriven, DriveDate |
| `TestPeriodDayElapsed` | Daily tracking of trial | Daily trigger | TrialId, DayNumber, CurrentMileage |
| `MileageTracked` | Odometer reading recorded | Periodic check | TrialId, Mileage, TrackedAt |
| `TestPeriodExpired` | 10 days or 750km reached | Time/mileage limit | TrialId, ExpiredAt, FinalMileage |
| `VehicleKept` | Customer retains vehicle | Trial completion | TrialId, KeptAt, FinalDecision |

**Business Context:**
- Full money-back guarantee within specified trial period
- "Test own" the vehicle on customer's own schedule
- Flexible return policy to reduce purchase risk

### 7.2 Returns & Exchanges

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `ReturnRequested` | Customer initiates return | Return form submitted | ReturnId, VehicleId, CustomerId, RequestedAt, Reason |
| `ExchangeRequested` | Customer wants different vehicle | Exchange request | ExchangeId, VehicleId, CustomerId, DesiredVehicleId, RequestedAt |
| `ReturnConditionVerified` | Vehicle inspected for damage/modifications | Return inspection | ReturnId, InspectionResult, NoAccidents, NoModifications, VerifiedAt |
| `RefundApproved` | Return accepted | Condition verified | ReturnId, ApprovedAt, RefundAmount |
| `RefundProcessed` | Money returned to customer (minus govt/3rd party fees) | Refund execution | RefundId, Amount, FeesDeducted, ProcessedAt |
| `ExchangeApproved` | Vehicle swap authorized | Exchange verification | ExchangeId, ApprovedAt, NewVehicleId |
| `VehicleReturned` | Vehicle physically returned to Clutch | Return completed | ReturnId, ReturnedAt, ReturnMileage |
| `VehicleExchanged` | New vehicle provided to customer | Exchange delivery | ExchangeId, ExchangedAt, NewVehicleId |

**Business Context:**
- Vehicle must remain unmodified, accident-free, and undamaged during trial
- Refund may exclude certain non-refundable fees
- Full refund or exchange options available

---

## 8. Trade-In

### 8.1 Trade-In Evaluation

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `TradeInRequested` | Customer wants to trade vehicle | Trade-in form started | TradeInId, CustomerId, RequestedAt |
| `TradeInDetailsSubmitted` | Trade vehicle information provided | Form submission | TradeInId, VehicleDetails, SubmittedAt |
| `TradeInOfferGenerated` | AI valuation for trade vehicle | Details validated | TradeInId, OfferAmount, GeneratedAt |
| `TradeInOfferAccepted` | Customer accepts trade offer | Offer confirmation | TradeInId, AcceptedAt |
| `TradeInOfferDeclined` | Customer rejects trade offer | Decline action | TradeInId, DeclinedAt |

### 8.2 Trade-In Processing

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `TradeInAppraisalScheduled` | Physical inspection arranged | Offer accepted | AppraisalId, ScheduledDate, Location |
| `TradeInInspected` | Trade vehicle evaluated | Appraisal appointment | AppraisalId, InspectedAt, Condition |
| `TradeInValueAdjusted` | Offer modified based on condition | Inspection complete | TradeInId, AdjustedValue, AdjustmentReason |
| `TradeInCompleted` | Trade vehicle accepted | Final agreement | TradeInId, FinalValue, CompletedAt |
| `TradeInCreditApplied` | Trade value applied to purchase | Purchase processing | PurchaseId, TradeInCredit, AppliedAt |

---

## 9. Financing

### 9.1 Financing Application

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `FinancingApplicationStarted` | Customer begins loan application | Application opened | ApplicationId, CustomerId, StartedAt |
| `CreditCheckAuthorized` | Customer permits credit inquiry | Authorization granted | ApplicationId, AuthorizedAt |
| `CreditScoreRetrieved` | Credit report obtained | Credit bureau query | ApplicationId, CreditScore, RetrievedAt |
| `FinancingOptionsCalculated` | Loan scenarios generated | Credit score received | ApplicationId, Options[], CalculatedAt |
| `FinancingTermsPresented` | Loan details shown to customer | Options ready | ApplicationId, Terms[], PresentedAt |

### 9.2 Financing Approval

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `FinancingApplicationSubmitted` | Complete application sent to lender | Submission | ApplicationId, LenderId, SubmittedAt |
| `FinancingUnderReview` | Lender evaluating application | Submission received | ApplicationId, ReviewStartedAt |
| `FinancingApproved` | Loan approved by lender | Lender decision | ApplicationId, ApprovedAmount, InterestRate, Term, ApprovedAt |
| `FinancingDenied` | Loan rejected by lender | Lender decision | ApplicationId, DeniedAt, DenialReason |
| `FinancingTermsAccepted` | Customer agrees to loan terms | Customer acceptance | ApplicationId, AcceptedAt |
| `LoanAgreementSigned` | Loan contract executed | E-signature | LoanId, SignedAt, AgreementHash |

**Business Context:**
- Third-party financing partners available
- Online application and approval process

---

## 10. Customer Account & Profile

### 10.1 Account Management

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `AccountCreated` | New customer account established | Registration complete | UserId, Email, CreatedAt |
| `ProfileUpdated` | Customer information modified | Profile edit | UserId, UpdatedFields[], UpdatedAt |
| `EmailVerified` | Email address confirmed | Verification link clicked | UserId, Email, VerifiedAt |
| `PhoneVerified` | Phone number confirmed | SMS code entered | UserId, Phone, VerifiedAt |
| `LoginAttempted` | User tries to access account | Login submission | UserId, AttemptedAt, IPAddress |
| `LoginSuccessful` | User authenticated | Credentials validated | UserId, LoggedInAt, SessionId |
| `PasswordReset` | Password changed | Reset completion | UserId, ResetAt |

### 10.2 Preferences

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `SearchPreferencesSaved` | Default search filters stored | Preferences saved | UserId, Preferences, SavedAt |
| `NotificationPreferencesUpdated` | Communication settings changed | Settings updated | UserId, EmailEnabled, SMSEnabled, PushEnabled |
| `CommunicationPreferencesSet` | Marketing preferences configured | Preference selection | UserId, MarketingOptIn, UpdatedAt |

---

## 11. Warranty & Protection

### 11.1 Warranty

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `WarrantyIncluded` | Standard warranty activated | Vehicle purchase | WarrantyId, VehicleId, Coverage, StartDate, EndDate |
| `ExtendedWarrantyOffered` | Additional coverage presented | Purchase process | OfferId, CoverageLevels[], OfferedAt |
| `ExtendedWarrantyPurchased` | Customer buys extended coverage | Purchase confirmation | WarrantyId, CoverageLevel, Cost, PurchasedAt |
| `WarrantyClaimSubmitted` | Customer files warranty claim | Claim form | ClaimId, WarrantyId, Issue, SubmittedAt |
| `WarrantyClaimApproved` | Claim accepted for coverage | Claim review | ClaimId, ApprovedAt, CoverageAmount |
| `WarrantyServiceScheduled` | Repair appointment arranged | Claim approval | ServiceId, ScheduledDate, ServiceCenter |

**Business Context:**
- All vehicles include warranty coverage
- Optional extended warranty available

---

## 12. Customer Service & Support

### 12.1 Support Interactions

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `SupportTicketCreated` | Customer support request opened | Contact form submission | TicketId, CustomerId, Issue, Priority, CreatedAt |
| `CustomerInquiryReceived` | Question or concern logged | Email/phone/chat | InquiryId, CustomerId, Channel, Message, ReceivedAt |
| `AdvisorResponseSent` | Support team replies to customer | Response sent | ResponseId, TicketId, Message, SentAt, AdvisorId |
| `IssueResolved` | Support ticket closed | Resolution confirmed | TicketId, ResolvedAt, Resolution, AdvisorId |
| `IssueEscalated` | Ticket elevated to senior support | Escalation required | TicketId, EscalatedAt, EscalationReason, AssignedTo |
| `CallbackScheduled` | Phone appointment arranged | Callback requested | CallbackId, ScheduledTime, CustomerId |

### 12.2 Feedback

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `ReviewRequested` | Customer asked for review | Post-purchase trigger | RequestId, CustomerId, VehicleId, RequestedAt |
| `ReviewSubmitted` | Customer provides review | Review form submitted | ReviewId, Rating, Comments, SubmittedAt |
| `RatingProvided` | Numerical score given | Rating submitted | RatingId, Score, Category, ProvidedAt |
| `FeedbackReceived` | General feedback provided | Feedback form | FeedbackId, Type, Message, ReceivedAt |
| `SurveyCompleted` | Customer survey finished | Survey submission | SurveyId, Responses[], CompletedAt |

**Business Context:**
- Active presence on multiple review platforms
- Focus on customer satisfaction and quality service
- Post-transaction surveys for continuous improvement

---

## 13. Marketing & Communications

### 13.1 Campaign Events

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `MarketingCampaignLaunched` | New campaign initiated (e.g., NBA partnership) | Campaign start | CampaignId, CampaignName, LaunchedAt, Channels[] |
| `EmailSent` | Marketing/transactional email delivered | Email trigger | EmailId, RecipientId, Template, SentAt |
| `SMSSent` | Text message delivered | SMS trigger | SMSId, RecipientId, Message, SentAt |
| `PushNotificationSent` | App notification delivered | Push trigger | NotificationId, RecipientId, Message, SentAt |
| `AdClicked` | Customer clicks advertisement | Ad interaction | AdId, CustomerId, ClickedAt, Source |
| `LandingPageVisited` | Campaign page accessed | Page load | PageId, VisitorId, VisitedAt, ReferralSource |

**Business Context:**
- National/regional brand campaigns and partnerships
- Targeted messaging focused on convenience and value
- Multi-channel marketing approach (digital, traditional, partnerships)

### 13.2 Engagement

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `NewsletterSubscribed` | Customer opts into email list | Subscription | SubscriptionId, Email, SubscribedAt |
| `NewsletterUnsubscribed` | Customer opts out of emails | Unsubscribe link | SubscriptionId, UnsubscribedAt |
| `PromotionalOfferViewed` | Customer views special offer | Offer displayed | OfferId, CustomerId, ViewedAt |
| `ReferralGenerated` | Customer refers friend | Referral link shared | ReferralId, ReferrerId, ReferredEmail, GeneratedAt |

---

## 14. Analytics & Reporting

### 14.1 Business Metrics

| Event Name | Description | Trigger | Key Data |
|------------|-------------|---------|----------|
| `InventoryCountUpdated` | Current stock level recorded | Periodic calculation | InventoryCount, AvailableCount, ReservedCount, Timestamp |
| `SalesVolumeRecorded` | Sales metrics captured | Daily/weekly/monthly | Period, UnitsSold, Revenue, RecordedAt |
| `OfferVolumeRecorded` | Offer generation metrics tracked | Periodic aggregation | Period, OffersGenerated, OffersAccepted, RecordedAt |
| `ProductionRateCalculated` | Reconditioning throughput measured | Production metrics | Period, VehiclesCompleted, AverageTimePerVehicle, CalculatedAt |
| `MarketShareCalculated` | Market position analyzed | Market analysis | Period, MarketShare, CompetitorComparison, CalculatedAt |
| `CustomerSatisfactionScored` | Satisfaction metrics aggregated | Survey results | Period, NPS, CSAT, ReviewScore, ScoredAt |

**Business Context:**
- Real-time business intelligence and reporting
- KPI tracking across all platform operations
- Data-driven decision making

---

## Event Categories Summary

### Core Transaction Flow
1. **Acquisition Events** - Customer sells vehicle to platform
2. **Production Events** - Vehicle inspection, reconditioning, certification
3. **Listing Events** - Inventory management and publication
4. **Purchase Events** - Customer buys vehicle from platform
5. **Delivery Events** - Logistics and handover
6. **Post-Sale Events** - Trial period, returns, support

### Supporting Functions
7. **Trade-In Events** - Vehicle exchange processing
8. **Financing Events** - Loan application and approval
9. **Account Events** - User management and preferences
10. **Warranty Events** - Coverage and claims
11. **Support Events** - Customer service interactions
12. **Marketing Events** - Campaigns and engagement
13. **Analytics Events** - Metrics and reporting

---

## Event Sourcing Considerations

### Aggregate Roots
- **Vehicle** - Central entity tracking vehicle lifecycle
- **Customer** - User account and preferences
- **Transaction** - Purchase or sale agreement
- **Delivery** - Logistics and fulfillment
- **TrialPeriod** - Test ownership window

### Event Ordering
Events should be processed in strict temporal order within each aggregate to maintain consistency.

### Idempotency
All event handlers should be idempotent to handle potential duplicate events during system failures or retries.

### Event Versioning
Events should include version information to support schema evolution:
```json
{
  "eventType": "VehiclePurchased",
  "eventVersion": "2.0",
  "eventId": "uuid",
  "timestamp": "ISO-8601",
  "aggregateId": "vehicle-123",
  "data": { ... }
}
```

---

## Integration Points

### External Systems
- **Payment Processors** - For instant payments and refunds
- **Credit Bureaus** - For financing credit checks
- **Vehicle History Providers** - For comprehensive reports
- **Insurance Verification** - For coverage validation
- **Transportation Services** - For seller ride arrangements
- **Marketing Platforms** - For campaign management
- **Analytics Tools** - For business intelligence

### Real-Time Events
Events requiring immediate processing:
- Payment confirmations
- Reservation expirations
- Test period milestones
- Delivery status updates
- Critical support tickets

### Batch Processing Events
Events suitable for batch processing:
- Analytics aggregation
- Marketing campaign metrics
- Inventory reports
- Performance metrics

---

## Event Retention Policy

### Short-Term Retention (30 days)
- User interaction events
- Marketing engagement events
- Search and browsing events

### Medium-Term Retention (1-2 years)
- Transaction events
- Support tickets
- Delivery confirmations

### Long-Term Retention (7+ years)
- Purchase agreements
- Financial transactions
- Regulatory compliance events
- Warranty records

---

## Compliance and Privacy

### PII (Personally Identifiable Information)
Events containing PII should be:
- Encrypted at rest and in transit
- Access-controlled with audit logging
- Subject to data retention policies
- Deletable per user request (GDPR, CCPA)

### Audit Trail
Critical business events should maintain immutable audit logs:
- Financial transactions
- Vehicle ownership transfers
- Contract signings
- User account changes

---

## Performance Considerations

### High-Volume Events
- `UserSearched` - Thousands per hour
- `VehicleViewed` - High traffic during peak hours
- `OfferGenerated` - Continuous generation
- `InspectionPointCompleted` - 210 per vehicle

### Event Batching
Consider batching for:
- Analytics aggregation
- Marketing metrics
- Search result tracking
- Photo upload events

### Event Streaming
Real-time streaming recommended for:
- Payment processing
- Inventory updates
- Delivery tracking
- Customer notifications

---

## Conclusion

This comprehensive domain events catalog provides a blueprint for implementing an event-driven architecture for an online used car marketplace platform. The events capture the complete customer journey from initial vehicle valuation through purchase, delivery, and post-sale support, enabling:

- **Scalability** - Event-driven architecture supports horizontal scaling
- **Reliability** - Event sourcing provides complete audit trail and recovery
- **Flexibility** - Easy to add new features by subscribing to existing events
- **Analytics** - Rich data for business intelligence and optimization
- **Integration** - Clear integration points for external systems

Organizations implementing this model should adapt events to their specific business requirements, regional regulations, and operational workflows.