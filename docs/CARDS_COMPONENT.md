# Cards Documentation (3.3)

## Overview

Cards are versatile container components used to group related content and actions. The design system includes three main card types: Standard Cards, Stat Cards, and Vehicle Cards, each with specific use cases and specifications.

---

## Standard Card

### Specifications

- **Background:** White
- **Border:** 1px solid `#E5E7EB`
- **Border Radius:** 8px
- **Shadow:** `shadow-elevation-2` (design system level 2)
- **Padding:** 24px (all sides)
- **Min Height:** Auto (content-driven)

### Structure

#### Card Container

```
┌─────────────────────────────────┐
│                                 │
│    Content Area                 │
│    (24px padding all sides)      │
│                                 │
└─────────────────────────────────┘
```

#### Optional Header (Inside Padding)

- **Title:** 20px, semibold (font-weight: 600)
- **Subtitle:** 14px, gray (`#6B7280`)
- **Actions:** Right-aligned buttons/menu
- **Bottom Border:** 1px solid `#E5E7EB`
- **Padding Below Header:** 16px

#### Optional Footer (Inside Padding)

- **Top Border:** 1px solid `#E5E7EB`
- **Padding:** 16px 24px (top-bottom × left-right)
- **Typical Content:** Buttons, links, pagination

### Component File

**Location:** `components/ui/card.tsx`

### Usage Example

```tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Simple Card
<Card>
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Card Title</h3>
    <p className="text-gray-600">Card content goes here</p>
  </div>
</Card>

// Card with Header
<Card>
  <div className="border-b border-gray-200 pb-4 mb-4">
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-card-title font-semibold">Title</h2>
        <p className="text-sm text-gray-600">Subtitle</p>
      </div>
      <Button variant="ghost" size="icon">⋯</Button>
    </div>
  </div>
  <div className="space-y-2">
    <p>Content area</p>
  </div>
</Card>

// Card with Footer
<Card>
  <div className="space-y-4">Content</div>
  <div className="border-t border-gray-200 mt-4 pt-4">
    <Button variant="primary" size="md">Action</Button>
  </div>
</Card>
```

### CSS Classes

```css
/* Using design system utilities */
.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: var(--shadow-elevation-2);
  padding: 24px;
}

.card-header {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.card-footer {
  border-top: 1px solid #e5e7eb;
  margin-top: 16px;
  padding-top: 16px;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.25;
}

.card-subtitle {
  font-size: 14px;
  color: #6b7280;
}
```

---

## Stat Card

### Specifications

- **Height:** 120px (fixed)
- **Width:** Full container width
- **Background:** White
- **Border:** 1px solid `#E5E7EB`
- **Border Radius:** 8px
- **Shadow:** `shadow-elevation-1`
- **Padding:** 20px
- **Layout:** Flexbox horizontal (icon | content)

### Layout Structure

```
┌──────────────────────────────────────┐
│ ⚫  │  9,234              │           │
│    │  Total Users        │  +12.5%  │
│    │  (gray, 14px)       │  (green) │
└──────────────────────────────────────┘

Icon (40×40px circle) | Number (28px bold) | Label (14px gray) | Change (12px)
```

### Components

#### Icon

- **Size:** 40px × 40px
- **Background:** Colored circle (varies by category)
- **Icon Color:** White or darker shade
- **Icon Library:** Lucide React
- **Typical Colors:**
  - Users: `#3B82F6` (blue)
  - Sales: `#10B981` (green)
  - Revenue: `#F59E0B` (amber)
  - Tasks: `#8B5CF6` (purple)

#### Number

- **Font Size:** 28px
- **Font Weight:** Bold (700)
- **Color:** `#1F2937` (dark)
- **Line Height:** 1.25

#### Label

- **Font Size:** 14px
- **Font Weight:** Regular (400)
- **Color:** `#6B7280` (gray)

#### Change Indicator

- **Format:** `+X%` or `-X%`
- **Font Size:** 12px
- **Font Weight:** Medium (500)
- **Colors:**
  - Positive/Increase: `#10B981` (green)
  - Negative/Decrease: `#EF4444` (red)
- **Icon:** ChevronUp (green) or ChevronDown (red)

### Interactive States

#### Default

- Opacity: 100%
- Cursor: pointer
- Background: White

#### Hover

- Background: `#F9FAFB` (very light gray)
- Shadow: Enhanced to `shadow-elevation-2`
- Cursor: pointer (clickable)

#### Active/Click

- Filters data to that specific view
- Card styling remains same
- Page content updates

### Component File

**Location:** `components/ui/stat-card.tsx` (new or in card.tsx)

### Usage Example

```tsx
import { StatCard } from "@/components/ui/stat-card";
import { Users, TrendingUp } from "lucide-react";

<StatCard
  icon={<Users className="w-6 h-6 text-white" />}
  iconBg="bg-blue-500"
  number={9234}
  label="Total Users"
  change={12.5}
  isPositive={true}
  onClick={() => navigateTo("/users")}
/>

// Grid of Stat Cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard icon={...} number={1250} label="Sales" change={8.2} />
  <StatCard icon={...} number={$45600} label="Revenue" change={-3.1} />
  <StatCard icon={...} number={156} label="Vehicles" change={15.0} />
  <StatCard icon={...} number={42} label="Tasks" change={-5.0} />
</div>
```

### Data Structure

```tsx
interface StatCardProps {
  icon: React.ReactNode; // Lucide icon
  iconBg: string; // Tailwind color class
  number: number | string; // Display value
  label: string; // Card label
  change: number; // Percentage change
  isPositive?: boolean; // Color direction
  onClick?: () => void; // Click handler
  trend?: "up" | "down"; // Manual override
}
```

---

## Vehicle Card

### Specifications

#### Container

- **Background:** White
- **Border:** 1px solid `#E5E7EB`
- **Border Radius:** 8px
- **Shadow:** `shadow-elevation-1`
- **Width:** 280px (grid item)
- **Height:** Auto

#### Image Section

- **Aspect Ratio:** 16:9
- **Height:** 160px (280px × 9/16)
- **Border Radius:** 8px 8px 0 0
- **Background:** `#F3F4F6` (light gray)
- **Object Fit:** Cover

#### Badges

- **Status Badge (Top-Right)**
  - Position: Absolute, top 12px, right 12px
  - Padding: 6px 12px
  - Font Size: 12px
  - Font Weight: 600
  - Border Radius: 4px
  - Colors:
    - Active/Available: `#10B981` (green)
    - Reserved: `#F59E0B` (amber)
    - Sold: `#EF4444` (red)
    - Pending: `#3B82F6` (blue)

- **Stock # Badge (Top-Left)**
  - Position: Absolute, top 12px, left 12px
  - Padding: 6px 10px
  - Font Size: 11px
  - Background: `rgba(0, 0, 0, 0.6)` (dark overlay)
  - Color: White
  - Border Radius: 4px
  - Monospace font

#### Content Section

- **Padding:** 16px

#### Title

- **Font Size:** 16px
- **Font Weight:** Bold (700)
- **Color:** `#1F2937`
- **Line Height:** 1.25
- **Truncate:** 1 line max

#### Subtitle

- **Font Size:** 14px
- **Font Weight:** Regular (400)
- **Color:** `#6B7280`
- **Line Height:** 1.5
- **Truncate:** 1 line max

#### Price

- **Font Size:** 20px
- **Font Weight:** Bold (700)
- **Color:** `#2563EB` (primary blue)
- **Format:** $XX,XXX
- **Line Height:** 1.25

#### Specs (Icons + Text)

- **Layout:** Flex row, wrap
- **Gap:** 12px
- **Font Size:** 12px
- **Color:** `#6B7280`
- **Icon Size:** 16px
- **Items:** 2-4 specs per card

Typical specs:

- `🛞 205/55R16` (tire size)
- `📅 2024` (year)
- `⛽ 45K mi` (mileage)
- `🔧 FWD` (drivetrain)

#### VIN

- **Font Size:** 12px
- **Font Weight:** Regular (400)
- **Font Family:** Monospace
- **Color:** `#9CA3AF` (light gray)
- **Format:** `VIN: ABCD1234567890EFG`
- **Truncate:** Text-overflow ellipsis

#### Actions Section (Hidden by Default)

- **Opacity:** 0 (default), 100% (hover)
- **Display:** Flex gap-2
- **Padding:** 16px
- **Background:** `#F9FAFB`
- **Border-Top:** 1px solid `#E5E7EB`
- **Buttons:** Secondary/Primary size md
- **Transition:** 200ms opacity

### Interactive States

#### Default

- Shadow: Level 1
- Opacity: 100%
- Actions: Hidden (opacity 0)

#### Hover

- Shadow: Level 2 (elevated)
- Opacity: 100%
- Actions: Visible (opacity 100%)
- Background: Slightly lighter
- Cursor: pointer

#### Active

- Highlight border or background change
- Show selected state

### Component File

**Location:** `components/ui/vehicle-card.tsx` (new)

### Usage Example

```tsx
import { VehicleCard } from "@/components/ui/vehicle-card";
import { Heart, Eye, Share2 } from "lucide-react";

<VehicleCard
  image="/vehicles/car-1.jpg"
  title="2024 Tesla Model 3"
  subtitle="Sedan • Silver"
  price={45999}
  status="Available"
  stockNumber="VH-2024-001"
  specs={[
    { icon: "📅", label: "2024" },
    { icon: "⛽", label: "45K mi" },
    { icon: "🔧", label: "FWD" },
    { icon: "🛞", label: "205/55R16" }
  ]}
  vin="ABCD1234567890EFG"
  actions={[
    { label: "View", icon: <Eye />, onClick: handleView },
    { label: "Like", icon: <Heart />, onClick: handleLike },
    { label: "Share", icon: <Share2 />, onClick: handleShare }
  ]}
/>

// Grid of Vehicle Cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {vehicles.map(vehicle => (
    <VehicleCard key={vehicle.id} {...vehicle} />
  ))}
</div>
```

### Data Structure

```tsx
interface VehicleCardProps {
  id: string;
  image: string; // Image URL
  title: string; // Vehicle title (make/model/year)
  subtitle: string; // Vehicle subtitle (type/color)
  price: number; // Price in dollars
  status: "Available" | "Reserved" | "Sold" | "Pending";
  stockNumber: string; // Stock/inventory number
  specs: Array<{
    // 2-4 specs
    icon?: string;
    label: string;
  }>;
  vin: string; // Vehicle Identification Number
  actions?: Array<{
    // Optional action buttons
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }>;
  onSelect?: () => void; // Click handler
}
```

---

## Card Usage Across Dashboard

### Standard Card Use Cases

1. **Dashboard:** KPI summaries, recent activity
2. **Leads:** Lead information cards
3. **Customers:** Customer profile cards
4. **Settings:** Configuration sections
5. **Reports:** Data visualization containers

### Stat Card Use Cases

1. **Dashboard:** KPI metrics (users, sales, revenue)
2. **Reports:** Performance indicators
3. **Analytics:** Status overview
4. **Inventory:** Quick stats

### Vehicle Card Use Cases

1. **Inventory:** Vehicle list grid
2. **Search Results:** Vehicle search results
3. **Featured:** Featured vehicles section
4. **Similar Vehicles:** Related vehicles

---

## Layout Examples

### Dashboard Grid (Stat Cards)

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {stats.map((stat) => (
    <StatCard key={stat.id} {...stat} />
  ))}
</div>
```

### Inventory Grid (Vehicle Cards)

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {vehicles.map((vehicle) => (
    <VehicleCard key={vehicle.id} {...vehicle} />
  ))}
</div>
```

### Content Sections (Standard Card)

```tsx
<div className="space-y-6">
  <Card>
    <h2 className="text-card-title mb-4">Section Title</h2>
    <div className="space-y-3">{/* content */}</div>
  </Card>
</div>
```

---

## Styling Guidelines

### Shadow Levels Used

- **Stat Card:** `shadow-elevation-1`
- **Vehicle Card:** `shadow-elevation-1` (default), `shadow-elevation-2` (hover)
- **Standard Card:** `shadow-elevation-2`

### Padding Standards

- **Standard Card:** 24px (all sides)
- **Vehicle Card:** 16px (content)
- **Stat Card:** 20px (all sides)

### Border Color

All cards use: `#E5E7EB` (light gray)

### Spacing Between Cards

- Grid gap: 16px (small), 24px (large)
- Section spacing: 32px

---

## Accessibility Features

✅ Proper heading hierarchy (h2, h3)  
✅ Color not only indicator (icons + text)  
✅ Adequate color contrast (WCAG AA)  
✅ Keyboard navigation support  
✅ Screen reader friendly  
✅ Focus states clearly visible  
✅ Semantic HTML structure  
✅ ARIA labels where needed

---

## Responsive Behavior

### Mobile (< 640px)

- Single column layout
- Full width cards
- Touch-friendly hover states

### Tablet (640px - 1024px)

- 2 columns for grids
- Reduced gap spacing

### Desktop (> 1024px)

- 4 columns for stat cards
- 3-4 columns for vehicle cards
- Full spacing and hover effects

---

## Component Files Reference

| Component     | File                             | Status    |
| ------------- | -------------------------------- | --------- |
| Standard Card | `components/ui/card.tsx`         | ✅ Exists |
| Stat Card     | `components/ui/stat-card.tsx`    | 🆕 Create |
| Vehicle Card  | `components/ui/vehicle-card.tsx` | 🆕 Create |

---

## Related Documentation

- [Button Component (3.1)](./BUTTON_COMPONENT.md)
- [Form Inputs (3.2)](./FORM_INPUTS.md)
- [Design System (1.0-2.0)](./DESIGN_SYSTEM_STRUCTURE.md)

---

## Version History

| Version | Date         | Changes                          |
| ------- | ------------ | -------------------------------- |
| 1.0     | Jan 23, 2026 | Initial card design system (3.3) |

---

## Implementation Checklist

### Phase 1: Verification

- [ ] Review existing `card.tsx`
- [ ] Verify shadow levels match system
- [ ] Verify border colors match system

### Phase 2: Creation

- [ ] Create `stat-card.tsx` component
- [ ] Create `vehicle-card.tsx` component
- [ ] Add to exports

### Phase 3: Integration

- [ ] Apply to Dashboard page
- [ ] Apply to Inventory/Vehicles page
- [ ] Apply to Customer cards
- [ ] Apply to Lead cards

### Phase 4: Testing

- [ ] Test all states (default, hover, active)
- [ ] Test responsive behavior
- [ ] Test accessibility
- [ ] Test with real data
