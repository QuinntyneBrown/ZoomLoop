# Online Used Car Marketplace UI Design Specification

**Version:** 1.0
**Date:** December 23, 2025
**Project:** Online Used Car Marketplace Platform
**Platform:** Web (Desktop & Mobile Responsive)

---

## Table of Contents

1. [Overview](#overview)
2. [Design System](#design-system)
3. [Component Specifications](#component-specifications)
4. [Page Layouts](#page-layouts)
5. [User Stories & Acceptance Criteria](#user-stories--acceptance-criteria)
6. [Mockups](#mockups)

---

## Overview

### Project Description
This specification defines the UI/UX design for an online used car marketplace platform that provides a seamless, hassle-free car buying and selling experience. The platform allows users to browse thousands of vehicles, get instant offers, and complete transactions entirely online with delivery to their door.

### Design Goals
- **Trust & Transparency**: Build confidence through clear information and professional design
- **Ease of Use**: Simplify the car buying/selling process with intuitive navigation
- **Visual Appeal**: Modern, clean aesthetic that appeals to car buyers
- **Performance**: Fast loading, optimized for both desktop and mobile
- **Accessibility**: WCAG 2.1 AA compliant

### Target Devices
- **Desktop**: 1920px × 1080px (primary), 1440px × 900px, 1366px × 768px
- **Tablet**: 768px × 1024px (iPad)
- **Mobile**: 375px × 812px (iPhone), 360px × 800px (Android)

---

## Design System

### Color Palette

#### Primary Colors
```
Brand Blue:      #0066FF (Primary CTA, Links, Headers)
Dark Navy:       #1A1F36 (Text, Navigation)
Success Green:   #00C853 (Success states, badges)
Warning Orange:  #FF6B00 (Alerts, notifications)
Error Red:       #E53935 (Error states)
```

#### Secondary Colors
```
Light Gray:      #F5F7FA (Backgrounds, sections)
Medium Gray:     #8B95A5 (Secondary text)
Border Gray:     #E1E4E8 (Borders, dividers)
White:           #FFFFFF (Cards, content areas)
Black:           #000000 (Overlays, emphasis)
```

### Typography

#### Font Family
- **Primary**: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- **Secondary**: "Roboto", sans-serif (for numbers/data)
- **Monospace**: "SF Mono", "Consolas", monospace (for VIN numbers)

#### Type Scale
```
H1: 48px / 56px line-height, Weight: 700 (Bold)
H2: 40px / 48px line-height, Weight: 700 (Bold)
H3: 32px / 40px line-height, Weight: 600 (Semi-Bold)
H4: 24px / 32px line-height, Weight: 600 (Semi-Bold)
H5: 20px / 28px line-height, Weight: 600 (Semi-Bold)
H6: 16px / 24px line-height, Weight: 600 (Semi-Bold)

Body Large:    18px / 28px line-height, Weight: 400 (Regular)
Body Regular:  16px / 24px line-height, Weight: 400 (Regular)
Body Small:    14px / 20px line-height, Weight: 400 (Regular)
Caption:       12px / 16px line-height, Weight: 400 (Regular)

Button Text:   16px / 24px line-height, Weight: 600 (Semi-Bold)
Label:         14px / 20px line-height, Weight: 500 (Medium)
```

#### Mobile Type Scale Adjustments
```
H1: 36px / 44px
H2: 32px / 40px
H3: 28px / 36px
H4: 20px / 28px
```

### Spacing System

#### Base Unit: 4px

```
Space-xs:   4px
Space-sm:   8px
Space-md:   16px
Space-lg:   24px
Space-xl:   32px
Space-2xl:  48px
Space-3xl:  64px
Space-4xl:  96px
Space-5xl:  128px
```

#### Container Widths
```
Max Content Width:    1440px
Content Padding:      120px (desktop), 24px (mobile)
Grid Gutter:          24px
Card Padding:         24px (desktop), 16px (mobile)
```

### Elevation (Shadows)

```
Level 1 (Cards):
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

Level 2 (Hover Cards):
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

Level 3 (Modals):
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

Level 4 (Sticky Headers):
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

### Border Radius

```
Small:    4px   (Badges, tags)
Medium:   8px   (Cards, inputs)
Large:    12px  (Buttons, images)
XL:       16px  (Featured cards)
Round:    9999px (Pills, avatars)
```

### Grid System

#### Desktop Grid (1440px container)
- **Columns**: 12
- **Gutter**: 24px
- **Margin**: 120px left/right

#### Tablet Grid (768px)
- **Columns**: 8
- **Gutter**: 16px
- **Margin**: 32px left/right

#### Mobile Grid (375px)
- **Columns**: 4
- **Gutter**: 16px
- **Margin**: 24px left/right

---

## Component Specifications

### 1. Header/Navigation Bar

#### Desktop Header
**Dimensions**: Full width × 80px height  
**Background**: #FFFFFF  
**Border Bottom**: 1px solid #E1E4E8

#### Layout (1440px container)
```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo - 120×40]  [Nav Items]        [Search]  [Sell]  [Account]│
│  ← 120px padding                                  120px padding →│
└─────────────────────────────────────────────────────────────────┘
```

**Component Breakdown**:

1. **Logo**
   - Size: 120px × 40px
   - Position: Left-aligned, 20px vertical padding
   - Clickable area: Full logo size + 8px padding
   
2. **Primary Navigation** (40px margin-left from logo)
   - Items: "Buy" | "Sell" | "Finance" | "About" | "Blog"
   - Spacing: 32px between items
   - Font: 16px, Weight 500
   - Color: #1A1F36
   - Hover: #0066FF (with 200ms transition)
   - Active indicator: 3px bottom border, #0066FF

3. **Search Bar** (Right-aligned section)
   - Width: 320px
   - Height: 44px
   - Border: 1px solid #E1E4E8
   - Border Radius: 8px
   - Placeholder: "Search by make, model, or keyword"
   - Icon: 20px × 20px magnifying glass, left-aligned, 12px padding
   - Padding: 12px 16px 12px 44px

4. **"Sell My Car" Button**
   - Width: Auto (min 140px)
   - Height: 44px
   - Background: Transparent
   - Border: 2px solid #0066FF
   - Color: #0066FF
   - Border Radius: 8px
   - Padding: 12px 24px
   - Margin-left: 16px from search
   - Hover: Background #0066FF, Color #FFFFFF

5. **Account/Login Button**
   - Width: 44px (icon only) or Auto (with text)
   - Height: 44px
   - Icon: User icon, 20px × 20px
   - Margin-left: 16px

#### Mobile Header
**Height**: 64px  
**Background**: #FFFFFF  
**Position**: Fixed top

```
┌───────────────────────────────────────────┐
│  [☰] [Logo - 100×32]         [🔍] [👤]   │
│  ← 16px                        16px →     │
└───────────────────────────────────────────┘
```

**Components**:
- Hamburger Menu: 24px × 24px, left 16px
- Logo: 100px × 32px, centered
- Search Icon: 24px × 24px, right 56px
- Account Icon: 24px × 24px, right 16px

---

### 2. Hero Section

#### Desktop Hero
**Height**: 600px  
**Background**: Linear gradient overlay on hero image  
**Gradient**: `linear-gradient(135deg, rgba(0, 102, 255, 0.85) 0%, rgba(26, 31, 54, 0.75) 100%)`

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│                      [Hero Background Image]                      │
│                                                                   │
│         ┌────────────────────────────────────────┐              │
│         │  Find Your Perfect Car                 │              │
│         │  (H1, 48px, White, Bold)              │              │
│         │                                        │              │
│         │  Shop thousands of certified used      │              │
│         │  vehicles with 10-day guarantee        │              │
│         │  (Body Large, 18px, White)            │              │
│         │                                        │              │
│         │  [Search Widget - 800px wide]         │              │
│         │                                        │              │
│         └────────────────────────────────────────┘              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Hero Content Container**:
- Width: 800px
- Centered horizontally and vertically
- Text-align: center

**Heading**:
- Font: 48px / 56px
- Weight: 700
- Color: #FFFFFF
- Margin-bottom: 16px

**Subheading**:
- Font: 18px / 28px
- Weight: 400
- Color: #FFFFFF with 90% opacity
- Margin-bottom: 40px

**Search Widget** (in Hero):
- Width: 100% of container (800px)
- Height: 80px
- Background: #FFFFFF
- Border-radius: 12px
- Box-shadow: Level 3
- Padding: 16px

**Search Widget Layout**:
```
┌────────────────────────────────────────────────────────────┐
│  [Make ▼] [Model ▼] [Price Range ▼] [Search Button]      │
│   200px     200px      200px           180px              │
└────────────────────────────────────────────────────────────┘
```

Each dropdown:
- Height: 48px
- Border: 1px solid #E1E4E8
- Border-radius: 8px
- Padding: 12px 16px
- Margin-right: 12px (except last)

Search Button:
- Width: 180px
- Height: 48px
- Background: #0066FF
- Color: #FFFFFF
- Border-radius: 8px
- Font: 16px, Weight 600
- Hover: Background #0052CC

#### Mobile Hero
**Height**: 480px

**Search Widget**: Stacks vertically, full width minus 32px padding

---

### 3. Vehicle Card (Grid Item)

#### Desktop Card
**Width**: Flexible (grid-based)  
**Aspect Ratio**: 4:3 for image  
**Background**: #FFFFFF  
**Border**: 1px solid #E1E4E8  
**Border-radius**: 12px  
**Transition**: all 200ms ease

```
┌────────────────────────────────────┐
│                                    │
│    [Vehicle Image - 4:3 ratio]    │
│                                    │
├────────────────────────────────────┤
│  Padding: 20px                     │
│                                    │
│  2021 Honda Civic LX               │
│  (H5, 20px, #1A1F36, Weight 600)  │
│                                    │
│  $24,999                           │
│  (H4, 24px, #0066FF, Weight 700)  │
│                                    │
│  🚗 35,420 km  📍 Toronto, ON     │
│  (14px, #8B95A5)                  │
│                                    │
│  [View Details Button]             │
│                                    │
└────────────────────────────────────┘
```

**Specifications**:

1. **Image Container**:
   - Aspect ratio: 4:3
   - Object-fit: cover
   - Border-radius: 12px 12px 0 0
   - Badge overlay (if applicable):
     - Position: Top-right, 12px from edges
     - Background: #00C853
     - Color: #FFFFFF
     - Padding: 6px 12px
     - Border-radius: 4px
     - Font: 12px, Weight 600
     - Text: "CERTIFIED" or "SALE"

2. **Content Padding**: 20px all sides

3. **Vehicle Title**:
   - Font: 20px / 28px
   - Weight: 600
   - Color: #1A1F36
   - Margin-bottom: 8px
   - Max lines: 1, ellipsis overflow

4. **Price**:
   - Font: 24px / 32px
   - Weight: 700
   - Color: #0066FF
   - Margin-bottom: 12px

5. **Metadata Row**:
   - Font: 14px / 20px
   - Color: #8B95A5
   - Icons: 16px × 16px, inline with text
   - Spacing: 16px between items
   - Margin-bottom: 16px

6. **View Details Button**:
   - Width: 100%
   - Height: 44px
   - Background: Transparent
   - Border: 2px solid #0066FF
   - Color: #0066FF
   - Border-radius: 8px
   - Font: 16px, Weight 600
   - Hover: Background #0066FF, Color #FFFFFF

**Hover State**:
- Transform: translateY(-4px)
- Box-shadow: Level 2
- Border-color: #0066FF

---

### 4. Filter Sidebar

#### Desktop Sidebar
**Width**: 280px  
**Background**: #F5F7FA  
**Border-right**: 1px solid #E1E4E8  
**Padding**: 24px

```
┌──────────────────────────────┐
│  Filters                     │
│  (H5, 20px, Bold)           │
│  ─────────────────           │
│                              │
│  Make & Model                │
│  [Dropdown - full width]     │
│                              │
│  Price Range                 │
│  $10,000 ─────────── $50,000│
│                              │
│  Mileage                     │
│  [Slider]                    │
│                              │
│  Year                        │
│  [From] - [To]              │
│                              │
│  Body Type                   │
│  ☐ Sedan                    │
│  ☐ SUV                      │
│  ☐ Truck                    │
│  ☐ Coupe                    │
│                              │
│  [Apply Filters Button]      │
│  [Clear All]                 │
│                              │
└──────────────────────────────┘
```

**Components**:

1. **Section Header**:
   - Font: 20px / 28px, Weight 600
   - Color: #1A1F36
   - Margin-bottom: 24px
   - Border-bottom: 2px solid #E1E4E8
   - Padding-bottom: 16px

2. **Filter Group**:
   - Margin-bottom: 32px

3. **Filter Label**:
   - Font: 14px / 20px, Weight 500
   - Color: #1A1F36
   - Margin-bottom: 8px

4. **Dropdown Select**:
   - Width: 100%
   - Height: 44px
   - Border: 1px solid #E1E4E8
   - Border-radius: 8px
   - Padding: 12px 16px
   - Background: #FFFFFF

5. **Range Slider**:
   - Width: 100%
   - Height: 4px
   - Background: #E1E4E8
   - Handle: 20px circle, #0066FF
   - Active track: #0066FF

6. **Checkbox**:
   - Size: 20px × 20px
   - Border: 2px solid #E1E4E8
   - Border-radius: 4px
   - Checked: Background #0066FF, white checkmark
   - Margin-right: 12px

7. **Apply Button**:
   - Width: 100%
   - Height: 44px
   - Background: #0066FF
   - Color: #FFFFFF
   - Border-radius: 8px
   - Margin-bottom: 12px

8. **Clear All Link**:
   - Font: 14px
   - Color: #8B95A5
   - Text-align: center
   - Hover: Color #0066FF

#### Mobile Filter
- Appears as bottom sheet/modal
- Full width minus 24px padding
- Sticky "Apply" button at bottom

---

### 5. Buttons

#### Primary Button
```
Height: 48px (Desktop), 44px (Mobile)
Padding: 14px 32px
Background: #0066FF
Color: #FFFFFF
Border-radius: 8px
Font: 16px, Weight 600
Letter-spacing: 0.5px
Box-shadow: 0 2px 4px rgba(0, 102, 255, 0.2)

Hover:
  Background: #0052CC
  Box-shadow: 0 4px 8px rgba(0, 102, 255, 0.3)
  Transform: translateY(-1px)

Active:
  Background: #0041A3
  Transform: translateY(0px)

Disabled:
  Background: #E1E4E8
  Color: #8B95A5
  Cursor: not-allowed
```

#### Secondary Button
```
Height: 48px (Desktop), 44px (Mobile)
Padding: 14px 32px
Background: Transparent
Border: 2px solid #0066FF
Color: #0066FF
Border-radius: 8px
Font: 16px, Weight 600

Hover:
  Background: #0066FF
  Color: #FFFFFF
```

#### Text Button
```
Padding: 8px 16px
Background: Transparent
Color: #0066FF
Font: 16px, Weight 500

Hover:
  Color: #0052CC
  Text-decoration: underline
```

---

### 6. Form Inputs

#### Text Input
```
Width: 100% (or specified)
Height: 48px
Padding: 12px 16px
Border: 1px solid #E1E4E8
Border-radius: 8px
Background: #FFFFFF
Font: 16px, Regular
Color: #1A1F36

Placeholder:
  Color: #8B95A5

Focus:
  Border: 2px solid #0066FF
  Box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1)
  Outline: none

Error:
  Border: 2px solid #E53935
  Box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.1)

Success:
  Border: 2px solid #00C853
```

#### Label
```
Font: 14px / 20px, Weight 500
Color: #1A1F36
Margin-bottom: 8px
Display: block
```

#### Helper Text
```
Font: 12px / 16px
Color: #8B95A5
Margin-top: 4px

Error State:
  Color: #E53935
```

---

### 7. Footer

#### Desktop Footer
**Background**: #1A1F36  
**Color**: #FFFFFF  
**Padding**: 64px 120px

```
┌─────────────────────────────────────────────────────────────────┐
│  Logo (White)         Quick Links          Company               │
│                       • Buy Cars           • About Us             │
│  Stay Connected       • Sell My Car        • Careers              │
│  [Email Input]        • Financing          • Press                │
│  [Subscribe Button]   • Insurance          • Contact              │
│                       • FAQs               • Blog                 │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│  © 2025 Company Name. All rights reserved.   Privacy | Terms | Cookies │
│  [Social Icons: Twitter, Facebook, Instagram, LinkedIn]          │
└─────────────────────────────────────────────────────────────────┘
```

**Specifications**:

1. **Top Section**: 4-column grid (3 + logo column)
   - Column gap: 48px

2. **Logo Column**:
   - Logo: 140px × 45px (white version)
   - Margin-bottom: 24px

3. **Newsletter**:
   - Heading: "Stay Connected"
   - Font: 16px, Weight 600
   - Input: 280px × 44px
   - Button: 120px × 44px, attached to input

4. **Link Columns**:
   - Heading: 16px, Weight 600, Margin-bottom 16px
   - Links: 14px, Weight 400, Line-height 32px
   - Hover: Color #0066FF

5. **Bottom Bar**:
   - Margin-top: 48px
   - Border-top: 1px solid rgba(255, 255, 255, 0.1)
   - Padding-top: 32px
   - Display: flex, justify-content: space-between

6. **Copyright**:
   - Font: 14px
   - Color: rgba(255, 255, 255, 0.7)

7. **Social Icons**:
   - Size: 24px × 24px
   - Spacing: 16px
   - Color: #FFFFFF
   - Hover: Color #0066FF

---

## Page Layouts

### Homepage Layout

#### Desktop (1440px container)
```
┌─────────────────────────────────────────────────────────────────┐
│                         HEADER (80px)                             │
├─────────────────────────────────────────────────────────────────┤
│                      HERO SECTION (600px)                         │
│                    [Search Widget centered]                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  FEATURED SECTION (Padding: 64px vertical)                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Featured Vehicles (H2, centered)                        │   │
│  │  Browse our hand-picked selection (subtitle)             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │Vehicle   │  │Vehicle   │  │Vehicle   │  │Vehicle   │       │
│  │Card 1    │  │Card 2    │  │Card 3    │  │Card 4    │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  HOW IT WORKS (Padding: 64px vertical, Background: #F5F7FA)     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  How It Works (H2, centered)                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ Icon     │  │ Icon     │  │ Icon     │                      │
│  │ Search   │  │ Choose   │  │ Get It   │                      │
│  │ Step 1   │  │ Step 2   │  │ Step 3   │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│  TESTIMONIALS (Padding: 64px vertical)                           │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER (Variable height)                                        │
└─────────────────────────────────────────────────────────────────┘
```

### Browse/Listing Page Layout

#### Desktop (1440px container)
```
┌─────────────────────────────────────────────────────────────────┐
│                         HEADER (80px)                             │
├─────────────────────────────────────────────────────────────────┤
│  BREADCRUMBS (48px height)                                       │
│  Home > Browse > Used Cars in Toronto                            │
├─────────────────────────────────────────────────────────────────┤
│  Page Title & Results Count (64px padding-top)                   │
│  Used Cars in Toronto                                            │
│  1,247 vehicles available                                        │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                    │
│  FILTER      │  RESULTS GRID (3 columns)                        │
│  SIDEBAR     │                                                    │
│  (280px)     │  Sort By: [Dropdown]         View: [Grid] [List] │
│              │                                                    │
│              │  ┌────────┐ ┌────────┐ ┌────────┐              │
│              │  │Vehicle │ │Vehicle │ │Vehicle │              │
│              │  │Card    │ │Card    │ │Card    │              │
│              │  └────────┘ └────────┘ └────────┘              │
│              │                                                    │
│              │  ┌────────┐ ┌────────┐ ┌────────┐              │
│              │  │Vehicle │ │Vehicle │ │Vehicle │              │
│              │  │Card    │ │Card    │ │Card    │              │
│              │  └────────┘ └────────┘ └────────┘              │
│              │                                                    │
│              │  [Pagination]                                     │
│              │                                                    │
└──────────────┴──────────────────────────────────────────────────┘
```

**Grid Specifications**:
- Container: 1440px - 280px (sidebar) - 48px (gap) = 1112px
- 3 columns: (1112px - 48px) / 3 = 354.67px per card
- Row gap: 24px
- Column gap: 24px

### Vehicle Detail Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         HEADER (80px)                             │
├─────────────────────────────────────────────────────────────────┤
│  BREADCRUMBS                                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  VEHICLE TITLE & PRICE (64px padding)                            │
│  2021 Honda Civic LX                                             │
│  $24,999                                                         │
│                                                                   │
├───────────────────────────┬─────────────────────────────────────┤
│                           │                                       │
│  IMAGE GALLERY            │  KEY DETAILS CARD                    │
│  (Main: 800×600px)        │                                       │
│                           │  • Mileage: 35,420 km                │
│  [Thumbnail strip]        │  • Location: Toronto, ON             │
│                           │  • Transmission: Automatic            │
│                           │  • Fuel Type: Gasoline               │
│                           │                                       │
│                           │  [Get Pre-Approved Button]           │
│                           │  [Schedule Test Drive Button]        │
│                           │  [Contact Seller Button]             │
│                           │                                       │
├───────────────────────────┴─────────────────────────────────────┤
│  TAB NAVIGATION                                                   │
│  Overview | Features | Specifications | Vehicle History          │
├─────────────────────────────────────────────────────────────────┤
│  TAB CONTENT                                                      │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│  SIMILAR VEHICLES                                                 │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER                                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Stories & Acceptance Criteria

### Epic: Vehicle Browse & Search

#### User Story 1: Basic Vehicle Search
**As a** car buyer  
**I want to** search for vehicles by make and model  
**So that** I can find cars that match my preferences

**Acceptance Criteria**:
1. ✅ Search input accepts text for make, model, or keyword
2. ✅ Autocomplete suggestions appear after typing 2+ characters
3. ✅ Search results display within 1 second
4. ✅ Results show relevant matches sorted by best match
5. ✅ Empty state displays helpful message when no results found
6. ✅ Search history saved in browser for quick access
7. ✅ Mobile keyboard opens with appropriate type (search)

**Design Requirements**:
- Search bar: 320px wide (desktop), full width minus 32px (mobile)
- Autocomplete dropdown: Max 8 suggestions, 48px height each
- Result count displayed above vehicle grid
- Loading spinner shown during search (spinner size: 32px)

---

#### User Story 2: Filter Vehicles by Criteria
**As a** car buyer  
**I want to** filter vehicles by price, mileage, year, and body type  
**So that** I can narrow down my options

**Acceptance Criteria**:
1. ✅ Price range slider updates results dynamically
2. ✅ Multiple filters can be applied simultaneously
3. ✅ Active filters displayed as removable chips above results
4. ✅ "Clear All" button removes all filters with one click
5. ✅ Filter count badge shows number of active filters
6. ✅ Results update without full page reload
7. ✅ Mobile filters accessible via bottom sheet modal

**Design Requirements**:
- Filter sidebar: 280px fixed width (desktop)
- Filter chips: Height 32px, Padding 8px 12px, Border-radius 16px
- Active filter count badge: 20px circle, background #E53935
- Mobile filter button: Fixed bottom-right, 56px circle FAB
- Filter bottom sheet: Full width, max 80% viewport height

---

#### User Story 3: View Vehicle Details
**As a** car buyer  
**I want to** view comprehensive information about a vehicle  
**So that** I can make an informed decision

**Acceptance Criteria**:
1. ✅ High-resolution images load progressively (lazy loading)
2. ✅ Image gallery supports swipe on mobile
3. ✅ All key specifications clearly displayed
4. ✅ Vehicle history report accessible with one click
5. ✅ Similar vehicles recommended at bottom of page
6. ✅ Contact options clearly visible (sticky on scroll)
7. ✅ 360° view available when supported
8. ✅ Breadcrumb navigation shows path back to search

**Design Requirements**:
- Main image: 800px × 600px (desktop), full width (mobile)
- Thumbnail strip: 80px × 60px per thumbnail, 8px gap
- Detail sidebar: 400px wide (desktop), full width below images (mobile)
- Tab navigation: Sticky at 80px from top on scroll
- CTA buttons: Fixed bottom bar on mobile (56px height)

---

### Epic: Vehicle Card Component

#### User Story 4: Quick Vehicle Overview
**As a** car buyer  
**I want to** see essential vehicle information at a glance  
**So that** I can quickly evaluate multiple options

**Acceptance Criteria**:
1. ✅ Card displays: image, title, price, mileage, location
2. ✅ "View Details" button clearly visible
3. ✅ Hover state provides visual feedback
4. ✅ Badge shows special status (Certified, Sale, etc.)
5. ✅ Favorite icon allows quick saving
6. ✅ Price formatted with appropriate currency symbol
7. ✅ Card accessible via keyboard navigation
8. ✅ Card aspect ratio maintained on all screen sizes

**Design Requirements**:
- Card width: Fluid grid (354px at 1440px container)
- Image aspect ratio: 4:3
- Card height: Auto (based on content)
- Hover elevation: 4px translateY, box-shadow level 2
- Favorite icon: 24px, top-right 12px from edges
- Badge: Top-right over image, 12px from edges
- Minimum touch target: 44px × 44px (mobile)

---

### Epic: Responsive Design

#### User Story 5: Mobile Experience
**As a** mobile user  
**I want to** browse and search vehicles on my phone  
**So that** I can shop anytime, anywhere

**Acceptance Criteria**:
1. ✅ All content readable without horizontal scrolling
2. ✅ Touch targets minimum 44px × 44px
3. ✅ Navigation accessible via hamburger menu
4. ✅ Filters accessible via modal/bottom sheet
5. ✅ Images optimized for mobile bandwidth
6. ✅ CTAs sticky at bottom of vehicle detail page
7. ✅ Font sizes adjusted for mobile readability
8. ✅ Forms use appropriate mobile keyboards

**Design Requirements**:
- Viewport meta tag: `width=device-width, initial-scale=1`
- Base font size: 16px (prevent zoom on iOS)
- Breakpoints: 375px (mobile), 768px (tablet), 1440px (desktop)
- Hamburger menu: 24px icon, 16px from edges
- Bottom sheet: Slide-up animation, 300ms ease
- Sticky CTA bar: 56px height, shadow elevation level 4

---

### Epic: Accessibility

#### User Story 6: Keyboard Navigation
**As a** keyboard user  
**I want to** navigate the entire site using only my keyboard  
**So that** I can browse vehicles without a mouse

**Acceptance Criteria**:
1. ✅ Tab order follows logical reading flow
2. ✅ Focus indicators clearly visible (2px outline)
3. ✅ Skip to main content link available
4. ✅ Dropdown menus accessible via Enter/Space
5. ✅ Modal dialogs trap focus appropriately
6. ✅ Close buttons accessible via Escape key
7. ✅ All interactive elements keyboard accessible

**Design Requirements**:
- Focus outline: 2px solid #0066FF, 2px offset
- Skip link: Visible on focus, positioned top-left
- Focus trap in modals: First and last focusable elements
- Keyboard shortcuts documented in footer

---

#### User Story 7: Screen Reader Support
**As a** screen reader user  
**I want to** understand all content and navigation  
**So that** I can independently browse vehicles

**Acceptance Criteria**:
1. ✅ All images have descriptive alt text
2. ✅ Semantic HTML used throughout (nav, main, aside, footer)
3. ✅ ARIA labels on icon-only buttons
4. ✅ Form inputs have associated labels
5. ✅ Live regions announce dynamic content updates
6. ✅ Heading hierarchy logical (H1 → H6)
7. ✅ Link text descriptive (not "click here")

**Design Requirements**:
- Alt text: Describe vehicle make, model, year, angle
- ARIA labels: "Search", "Filter", "Close", etc.
- Live regions: aria-live="polite" for filter updates
- Landmark roles: banner, navigation, main, complementary, contentinfo

---

### Epic: Performance

#### User Story 8: Fast Load Times
**As a** user  
**I want** pages to load quickly  
**So that** I don't waste time waiting

**Acceptance Criteria**:
1. ✅ First Contentful Paint < 1.5 seconds
2. ✅ Largest Contentful Paint < 2.5 seconds
3. ✅ Time to Interactive < 3.5 seconds
4. ✅ Images lazy loaded below fold
5. ✅ Critical CSS inlined
6. ✅ JavaScript deferred or async
7. ✅ Fonts preloaded

**Design Requirements**:
- Image formats: WebP with JPG fallback
- Image sizes: 400w, 800w, 1200w, 1600w
- Lazy load threshold: 200px before viewport
- Loading skeleton matches final layout
- Spinner size: 32px (small), 48px (medium), 64px (large)

---

## Mockups

### Desktop Homepage Mockup

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  [LOGO]        Buy    Sell    Finance    About    Blog         [Search] [Sell] [👤] │
│  120×40        ←────────── 32px gaps ──────────→                ←── 16px gaps ───→  │
└─────────────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                       │
│                         ╔═════════════════════════════════════════╗                 │
│                         ║                                         ║                 │
│                         ║    Find Your Perfect Car                ║                 │
│                         ║    (48px Bold White)                    ║                 │
│                         ║                                         ║                 │
│                         ║    Shop thousands of certified used     ║                 │
│                         ║    vehicles with 10-day guarantee       ║                 │
│                         ║    (18px Regular White 90% opacity)     ║                 │
│                         ║                                         ║                 │
│                         ║    ┌───────────────────────────────┐   ║                 │
│                         ║    │ [Make ▼] [Model ▼] [Price ▼] │   ║                 │
│                         ║    │ [        Search Now        ]  │   ║                 │
│                         ║    └───────────────────────────────┘   ║                 │
│                         ║                                         ║                 │
│                         ╚═════════════════════════════════════════╝                 │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                       │
│                            Featured Vehicles                                          │
│                            (40px Bold, centered)                                      │
│                                                                                       │
│                     Browse our hand-picked selection                                  │
│                     (18px Regular Gray, centered)                                     │
│                                                                                       │
│     ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐│
│     │   ╔═════════╗   │  │   ╔═════════╗   │  │   ╔═════════╗   │  │  ╔═════════╗ ││
│     │   ║ Image   ║   │  │   ║ Image   ║   │  │   ║ Image   ║   │  │  ║ Image   ║ ││
│     │   ║  4:3    ║   │  │   ║  4:3    ║   │  │   ║  4:3    ║   │  │  ║  4:3    ║ ││
│     │   ╚═════════╝   │  │   ╚═════════╝   │  │   ╚═════════╝   │  │  ╚═════════╝ ││
│     │                  │  │                  │  │                  │  │              ││
│     │ 2021 Honda Civic │  │ 2020 Toyota RAV4 │  │ 2022 Mazda CX-5  │  │ 2019 Ford   ││
│     │ (20px Bold)      │  │ (20px Bold)      │  │ (20px Bold)      │  │ Escape      ││
│     │                  │  │                  │  │                  │  │ (20px Bold) ││
│     │ $24,999          │  │ $28,500          │  │ $32,750          │  │ $22,900     ││
│     │ (24px Blue Bold) │  │ (24px Blue Bold) │  │ (24px Blue Bold) │  │ (24px Blue) ││
│     │                  │  │                  │  │                  │  │             ││
│     │ 🚗 35,420 km     │  │ 🚗 42,100 km     │  │ 🚗 18,500 km     │  │ 🚗 55,200 km││
│     │ 📍 Toronto, ON   │  │ 📍 Mississauga   │  │ 📍 Vancouver, BC │  │ 📍 Ottawa   ││
│     │                  │  │                  │  │                  │  │             ││
│     │ [View Details]   │  │ [View Details]   │  │ [View Details]   │  │[View Detail]││
│     └─────────────────┘  └─────────────────┘  └─────────────────┘  └──────────────┘│
│          354px                354px                354px                354px        │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                   ↕ 24px gap ↕

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         Background: #F5F7FA                                           │
│                                                                                       │
│                            How It Works                                               │
│                            (40px Bold, centered)                                      │
│                                                                                       │
│        ┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐     │
│        │    🔍              │   │    ✓               │   │    🚗             │     │
│        │    (64px icon)     │   │    (64px icon)     │   │    (64px icon)     │     │
│        │                    │   │                    │   │                    │     │
│        │  1. Search         │   │  2. Choose         │   │  3. Get It         │     │
│        │  (24px Bold)       │   │  (24px Bold)       │   │  (24px Bold)       │     │
│        │                    │   │                    │   │                    │     │
│        │  Browse thousands  │   │  Review details    │   │  We deliver to     │     │
│        │  of certified      │   │  & complete your   │   │  your door with    │     │
│        │  vehicles online   │   │  purchase securely │   │  10-day guarantee  │     │
│        │  (16px Regular)    │   │  (16px Regular)    │   │  (16px Regular)    │     │
│        │                    │   │                    │   │                    │     │
│        └────────────────────┘   └────────────────────┘   └────────────────────┘     │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Mobile Homepage Mockup

```
┌───────────────────────────────────┐
│ [☰]   [LOGO 100×32]    [🔍] [👤] │ ← 64px height
│ 16px                       16px   │
└───────────────────────────────────┘

┌───────────────────────────────────┐
│                                   │
│  ╔═══════════════════════════╗   │
│  ║                           ║   │
│  ║  Find Your                ║   │
│  ║  Perfect Car              ║   │
│  ║  (36px Bold White)        ║   │
│  ║                           ║   │
│  ║  Shop thousands of        ║   │
│  ║  certified vehicles       ║   │
│  ║  (16px Regular White)     ║   │
│  ║                           ║   │
│  ║  ┌─────────────────────┐ ║   │
│  ║  │ Make         ▼      │ ║   │
│  ║  ├─────────────────────┤ ║   │
│  ║  │ Model        ▼      │ ║   │
│  ║  ├─────────────────────┤ ║   │
│  ║  │ Price Range  ▼      │ ║   │
│  ║  ├─────────────────────┤ ║   │
│  ║  │   Search Now        │ ║   │
│  ║  └─────────────────────┘ ║   │
│  ║                           ║   │
│  ╚═══════════════════════════╝   │
│                                   │
└───────────────────────────────────┘
        ↕ 480px height ↕

┌───────────────────────────────────┐
│      Featured Vehicles            │
│      (32px Bold, centered)        │
│                                   │
│  ┌─────────────────────────────┐ │
│  │ ╔═════════════════════════╗ │ │
│  │ ║      Image 4:3          ║ │ │
│  │ ╚═════════════════════════╝ │ │
│  │                             │ │
│  │ 2021 Honda Civic LX         │ │
│  │ (18px Bold)                 │ │
│  │                             │ │
│  │ $24,999                     │ │
│  │ (22px Blue Bold)            │ │
│  │                             │ │
│  │ 🚗 35,420 km 📍 Toronto     │ │
│  │ (14px Gray)                 │ │
│  │                             │ │
│  │ [    View Details    ]      │ │
│  │                             │ │
│  └─────────────────────────────┘ │
│            ↕ 16px gap ↕           │
│  ┌─────────────────────────────┐ │
│  │ (Next vehicle card...)      │ │
│  └─────────────────────────────┘ │
│                                   │
└───────────────────────────────────┘
```

---

### Vehicle Card Detailed Mockup

```
Desktop Card (354px width)
┌────────────────────────────────────────┐
│  ╔═══════════════════════════════════╗ │ ← Border-radius: 12px
│  ║                                   ║ │   Border: 1px #E1E4E8
│  ║   🏷️ CERTIFIED  [♡ Favorite]    ║ │
│  ║   (Badge)       (Icon)            ║ │
│  ║                                   ║ │
│  ║         Vehicle Image             ║ │ ← Aspect ratio 4:3
│  ║           4:3                     ║ │   Object-fit: cover
│  ║                                   ║ │
│  ║                                   ║ │
│  ╚═══════════════════════════════════╝ │
├────────────────────────────────────────┤
│  Padding: 20px all sides               │
│                                        │
│  2021 Honda Civic LX                   │ ← 20px/28px Bold #1A1F36
│  (Max 1 line, ellipsis)                │   Max-width overflow ellipsis
│                                        │
│  $24,999                               │ ← 24px/32px Bold #0066FF
│  (8px margin-bottom)                   │
│                                        │
│  🚗 35,420 km     📍 Toronto, ON      │ ← 14px/20px #8B95A5
│  (Icons 16×16, 16px gap)               │   Icon inline with text
│  (12px margin-bottom)                  │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │      View Details                 │ │ ← Height: 44px
│  │      (16px Bold #0066FF)          │ │   Border: 2px #0066FF
│  └──────────────────────────────────┘ │   Border-radius: 8px
│                                        │   Full width
└────────────────────────────────────────┘

Hover State:
- Transform: translateY(-4px)
- Box-shadow: Level 2
- Border: 2px solid #0066FF
- Transition: all 200ms ease
```

---

### Filter Sidebar Detailed Mockup

```
Desktop Sidebar (280px width)
┌────────────────────────────────┐
│  Padding: 24px all sides       │
│                                │
│  Filters                       │ ← 20px/28px Bold #1A1F36
│  ─────────────────────────     │   Border-bottom 2px #E1E4E8
│  (16px margin-bottom)          │   Padding-bottom 16px
│                                │
│  Make & Model                  │ ← 14px/20px Medium #1A1F36
│  (8px margin-bottom)           │
│  ┌──────────────────────────┐ │
│  │ Select Make        ▼     │ │ ← 44px height
│  └──────────────────────────┘ │   Border: 1px #E1E4E8
│  (32px margin-bottom)          │   Border-radius: 8px
│                                │
│  Price Range                   │ ← 14px/20px Medium
│  (8px margin-bottom)           │
│  $10,000 ─●──────────── $50,000│ ← Range slider
│  (Handle: 20px circle #0066FF) │   Track: 4px #E1E4E8
│  (32px margin-bottom)          │   Active: #0066FF
│                                │
│  Mileage                       │
│  (8px margin-bottom)           │
│  ┌──────────────────────────┐ │
│  │ 0 ─●────────── 100,000   │ │
│  └──────────────────────────┘ │
│  (32px margin-bottom)          │
│                                │
│  Year                          │
│  (8px margin-bottom)           │
│  ┌──────────┐  ┌──────────┐  │
│  │ 2015  ▼  │  │ 2024  ▼  │  │ ← Each 120px width
│  └──────────┘  └──────────┘  │   12px gap
│  (32px margin-bottom)          │
│                                │
│  Body Type                     │
│  (8px margin-bottom)           │
│  ☐ Sedan    (4px gap)         │ ← Checkbox 20×20
│  ☐ SUV      (4px gap)         │   Text 14px
│  ☐ Truck    (4px gap)         │   Margin-right 12px
│  ☐ Coupe    (4px gap)         │   Line-height 32px
│  ☐ Hatchback                   │
│  (32px margin-bottom)          │
│                                │
│  ┌──────────────────────────┐ │
│  │    Apply Filters          │ │ ← 44px height
│  │    (16px Bold White)      │ │   Background #0066FF
│  └──────────────────────────┘ │   Border-radius: 8px
│  (12px gap)                    │   Full width
│                                │
│  Clear All                     │ ← 14px #8B95A5
│  (Centered, underline hover)   │   Text-align: center
│                                │
└────────────────────────────────┘
```

---

### Button Specifications Visual

```
PRIMARY BUTTON (Default)
┌────────────────────────────────────┐
│         Search Now                 │ ← Height: 48px
│      (16px Bold White)             │   Padding: 14px 32px
└────────────────────────────────────┘   Background: #0066FF
  Min-width: 140px                       Border-radius: 8px
  Box-shadow: 0 2px 4px rgba(0,102,255,0.2)

PRIMARY BUTTON (Hover)
┌────────────────────────────────────┐
│         Search Now                 │ ← Background: #0052CC
│      (16px Bold White)             │   Transform: translateY(-1px)
└────────────────────────────────────┘   Box-shadow: 0 4px 8px rgba(0,102,255,0.3)

PRIMARY BUTTON (Disabled)
┌────────────────────────────────────┐
│         Search Now                 │ ← Background: #E1E4E8
│      (16px Bold #8B95A5)           │   Cursor: not-allowed
└────────────────────────────────────┘   No shadow

SECONDARY BUTTON (Default)
┌────────────────────────────────────┐
│         View Details               │ ← Height: 48px
│      (16px Bold #0066FF)           │   Border: 2px solid #0066FF
└────────────────────────────────────┘   Background: Transparent

SECONDARY BUTTON (Hover)
┌────────────────────────────────────┐
│         View Details               │ ← Background: #0066FF
│      (16px Bold White)             │   Color: White
└────────────────────────────────────┘   Transition: 200ms

TEXT BUTTON
  View All Vehicles   ← No background/border
  (16px Medium #0066FF)  Padding: 8px 16px
  Underline on hover
```

---

### Form Input Specifications Visual

```
TEXT INPUT (Default)
┌────────────────────────────────────────────┐
│  Search by make, model, or keyword         │ ← Height: 48px
│  (16px Regular #8B95A5 placeholder)        │   Padding: 12px 16px
└────────────────────────────────────────────┘   Border: 1px #E1E4E8
  Border-radius: 8px

TEXT INPUT (Focus)
┌────────────────────────────────────────────┐
│  Honda_                                    │ ← Border: 2px #0066FF
│  (16px Regular #1A1F36)                    │   Box-shadow: 0 0 0 3px
└────────────────────────────────────────────┘   rgba(0,102,255,0.1)

TEXT INPUT (Error)
┌────────────────────────────────────────────┐
│  Invalid entry                             │ ← Border: 2px #E53935
│  (16px Regular #1A1F36)                    │   Box-shadow: 0 0 0 3px
└────────────────────────────────────────────┘   rgba(229,57,53,0.1)
  Please enter a valid search term              Helper text: 12px #E53935

DROPDOWN SELECT
┌────────────────────────────────────────┐
│  Select Make                      ▼   │ ← Height: 48px
│  (16px Regular #1A1F36)                │   Padding: 12px 16px
└────────────────────────────────────────┘   Chevron: 20×20 right 16px

CHECKBOX
☐  Sedan                 ← Unchecked: 20×20, Border 2px #E1E4E8
☑  SUV                   ← Checked: Background #0066FF, White ✓
   (14px Regular #1A1F36)   Border-radius: 4px

RADIO BUTTON
○  New                   ← Unchecked: 20×20 circle, Border 2px #E1E4E8
●  Used                  ← Checked: #0066FF outer, white inner dot
   (14px Regular #1A1F36)
```

---

### Responsive Breakpoint Examples

```
DESKTOP (1440px)
┌──────────────────────────────────────────────────────────────────┐
│  Header (80px) - Full navigation visible                         │
│  Hero (600px) - Search widget 800px wide                         │
│  [Sidebar 280px] │ [Content Grid - 3 columns]                    │
│  Footer - 4 columns                                              │
└──────────────────────────────────────────────────────────────────┘

TABLET (768px)
┌─────────────────────────────────────────────┐
│  Header (72px) - Hamburger menu             │
│  Hero (500px) - Search widget stacks        │
│  [Content Grid - 2 columns, full width]     │
│  Sidebar becomes filter modal               │
│  Footer - 2 columns                         │
└─────────────────────────────────────────────┘

MOBILE (375px)
┌───────────────────────────┐
│  Header (64px) - Icons    │
│  Hero (480px)             │
│  Search stacks vertically │
│  Content - 1 column       │
│  Filter - Bottom sheet    │
│  Footer - Stacked         │
└───────────────────────────┘
```

---

## Implementation Notes

### CSS Custom Properties (Variables)

```css
:root {
  /* Colors */
  --color-primary: #0066FF;
  --color-primary-dark: #0052CC;
  --color-primary-darker: #0041A3;
  --color-text-primary: #1A1F36;
  --color-text-secondary: #8B95A5;
  --color-success: #00C853;
  --color-warning: #FF6B00;
  --color-error: #E53935;
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F5F7FA;
  --color-border: #E1E4E8;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;
  
  /* Typography */
  --font-primary: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 32px;
  --font-size-4xl: 40px;
  --font-size-5xl: 48px;
  
  /* Borders */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-1: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-2: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-3: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-4: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
}
```

### Accessibility Checklist

- [ ] Color contrast ratio minimum 4.5:1 for text
- [ ] Focus indicators visible and clear (2px outline)
- [ ] All interactive elements keyboard accessible
- [ ] Skip to main content link present
- [ ] Semantic HTML elements used
- [ ] ARIA labels on icon-only buttons
- [ ] Form inputs have associated labels
- [ ] Images have descriptive alt text
- [ ] Heading hierarchy logical
- [ ] Live regions for dynamic content
- [ ] Modal focus trapping implemented
- [ ] Touch targets minimum 44×44px
- [ ] Zoom to 200% without horizontal scroll

### Performance Checklist

- [ ] Images optimized (WebP with fallback)
- [ ] Images lazy loaded below fold
- [ ] Responsive images (srcset, sizes)
- [ ] Critical CSS inlined
- [ ] JavaScript deferred/async
- [ ] Fonts preloaded
- [ ] HTTP/2 or HTTP/3 enabled
- [ ] Gzip/Brotli compression
- [ ] CDN for static assets
- [ ] Browser caching configured
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.5s
- [ ] Cumulative Layout Shift < 0.1

---

## Appendix

### Figma Design Tokens Export

```json
{
  "colors": {
    "primary": {
      "500": "#0066FF",
      "600": "#0052CC",
      "700": "#0041A3"
    },
    "text": {
      "primary": "#1A1F36",
      "secondary": "#8B95A5"
    },
    "background": {
      "primary": "#FFFFFF",
      "secondary": "#F5F7FA"
    },
    "border": "#E1E4E8"
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  },
  "typography": {
    "fontFamily": "Inter",
    "fontSize": {
      "h1": "48px",
      "h2": "40px",
      "h3": "32px",
      "body": "16px",
      "small": "14px"
    }
  }
}
```

### Component Inventory

1. **Navigation Components**
   - Primary Navigation Bar
   - Mobile Hamburger Menu
   - Breadcrumbs
   - Tabs

2. **Form Components**
   - Text Input
   - Select Dropdown
   - Checkbox
   - Radio Button
   - Range Slider
   - Search Input

3. **Button Components**
   - Primary Button
   - Secondary Button
   - Text Button
   - Icon Button
   - FAB (Floating Action Button)

4. **Card Components**
   - Vehicle Card
   - Feature Card
   - Testimonial Card

5. **Layout Components**
   - Header
   - Hero Section
   - Filter Sidebar
   - Footer
   - Container
   - Grid

6. **Feedback Components**
   - Loading Spinner
   - Skeleton Loader
   - Toast Notification
   - Alert Banner
   - Badge

7. **Modal Components**
   - Dialog Modal
   - Bottom Sheet (Mobile)
   - Image Gallery Modal

---

**End of Document**

*For questions or clarifications, please contact the design team.*
