# Cards Implementation Guide (3.3)

## Implementation Status

### ✅ Completed

1. **Documentation**
   - [CARDS_COMPONENT.md](./CARDS_COMPONENT.md) - Comprehensive specs
   - [SECTION_3_3_QUICK_REFERENCE.md](./SECTION_3_3_QUICK_REFERENCE.md) - Quick lookup
   - This integration guide

2. **Components Created**
   - `components/ui/stat-card.tsx` - StatCard component
   - `components/ui/vehicle-card.tsx` - VehicleCard component
   - `components/ui/card.tsx` - Standard Card (already existed)
   - `components/inventory/vehicle-grid.tsx` - Vehicle grid layout

3. **Dashboard Integration**
   - Updated `components/dashboard/kpi-grid.tsx` to use StatCard
   - Dashboard now displays 4 KPI metrics with StatCard

### 🚀 Ready to Implement

- Customer cards (Standard Card)
- Leads cards (Standard Card)
- Reports sections (StatCard + Standard Card)

---

## Component Files Reference

### Core Components

#### Standard Card

**File:** `components/ui/card.tsx`
**Imports:**

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
```

**Purpose:** Generic container for grouping related content
**Status:** ✅ Already exists (shadcn/ui)

#### Stat Card

**File:** `components/ui/stat-card.tsx`
**Imports:**

```tsx
import { StatCard } from "@/components/ui/stat-card";
```

**Purpose:** Display key metrics with icon, number, label, and change indicator
**Status:** ✅ Created
**Props:**

```tsx
interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string; // Tailwind class like "bg-blue-500"
  number: number | string;
  label: string;
  change: number;
  isPositive?: boolean;
  trend?: "up" | "down";
  onClick?: () => void;
}
```

#### Vehicle Card

**File:** `components/ui/vehicle-card.tsx`
**Imports:**

```tsx
import { VehicleCard } from "@/components/ui/vehicle-card";
```

**Purpose:** Display vehicle information with image, specs, and actions
**Status:** ✅ Created
**Props:**

```tsx
interface VehicleCardProps {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  price: number;
  status: "Available" | "Reserved" | "Sold" | "Pending";
  stockNumber: string;
  specs: Array<{ icon?: string; label: string }>;
  vin: string;
  actions?: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }>;
  onSelect?: () => void;
}
```

### Composite Components

#### Vehicle Grid

**File:** `components/inventory/vehicle-grid.tsx`
**Imports:**

```tsx
import { VehicleGrid } from "@/components/inventory/vehicle-grid";
```

**Purpose:** Grid layout for displaying multiple vehicles
**Status:** ✅ Created
**Props:**

```tsx
interface VehicleGridProps {
  vehicles: Vehicle[];
  onViewVehicle?: (vehicleId: string) => void;
  onLikeVehicle?: (vehicleId: string) => void;
  onShareVehicle?: (vehicleId: string) => void;
}
```

#### KPI Grid

**File:** `components/dashboard/kpi-grid.tsx`
**Status:** ✅ Updated to use StatCard
**Purpose:** Dashboard KPI metrics
**Usage:**

```tsx
import { KPIGrid } from "@/components/dashboard/kpi-grid";

<KPIGrid stats={stats} />;
```

---

## Dashboard Integration (COMPLETED)

### Location

`app/(dashboard)/dashboard/page.tsx`

### What Changed

- Replaced custom Card-based KPI display with StatCard component
- Removed gradient overlays and glow effects
- Simplified to clean, professional metric display
- Maintains same grid layout (4 columns on desktop, responsive)

### Current KPIs Displayed

1. Inventory Value (blue)
2. Projected Profit (green)
3. Active Inventory (purple)
4. Leads This Month (amber)

### How It Works

```tsx
import { KPIGrid } from "@/components/dashboard/kpi-grid";

// In dashboard page
<KPIGrid stats={stats} />;

// Component automatically renders 4 StatCards with data
```

---

## Inventory Integration (READY)

### How to Add Vehicle Grid

#### Option 1: Add to Existing Inventory Page

File: `app/(dashboard)/inventory/page.tsx`

```tsx
import { VehicleGrid } from "@/components/inventory/vehicle-grid"

// Inside component:
const [viewMode, setViewMode] = useState<"table" | "grid">("table")

return (
  <>
    {/* Existing header and controls */}

    {/* View Mode Toggle */}
    <div className="flex gap-2 mb-6">
      <Button
        variant={viewMode === "table" ? "primary" : "secondary"}
        onClick={() => setViewMode("table")}
      >
        Table View
      </Button>
      <Button
        variant={viewMode === "grid" ? "primary" : "secondary"}
        onClick={() => setViewMode("grid")}
      >
        Grid View
      </Button>
    </div>

    {/* Show grid or table based on view mode */}
    {viewMode === "grid" ? (
      <VehicleGrid
        vehicles={vehicles}
        onViewVehicle={handleViewVehicle}
        onLikeVehicle={handleLikeVehicle}
        onShareVehicle={handleShareVehicle}
      />
    ) : (
      // Existing table view
    )}
  </>
)
```

#### Option 2: Add as Card Section

```tsx
<Card className="mt-8">
  <CardHeader>
    <CardTitle>Featured Vehicles</CardTitle>
  </CardHeader>
  <CardContent>
    <VehicleGrid vehicles={featuredVehicles} />
  </CardContent>
</Card>
```

### Mock Data Example

```tsx
const mockVehicles = [
  {
    id: "1",
    vin: "1HGBH41JXMN109186",
    year: 2024,
    make: "Tesla",
    model: "Model 3",
    trim: "Long Range",
    stockNumber: "VH-2024-001",
    status: "Active",
    retailPrice: 45999,
    condition: "New",
    mileage: 2,
    image: "/vehicles/tesla-model-3.jpg",
  },
  // ... more vehicles
];
```

---

## Other Page Integration Examples

### Customers Page

File: `app/(dashboard)/customers/page.tsx`

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Customer info cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {customers.map((customer) => (
    <Card key={customer.id}>
      <CardHeader>
        <CardTitle>{customer.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600">{customer.email}</p>
        <p className="text-sm text-gray-600">{customer.phone}</p>
        <p className="text-lg font-semibold">
          {customer.totalPurchases} purchases
        </p>
      </CardContent>
    </Card>
  ))}
</div>;
```

### Leads Page

File: `app/(dashboard)/leads/page.tsx`

```tsx
// Lead status cards with StatCard
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
  <StatCard
    icon={<Users className="w-6 h-6 text-white" />}
    iconBg="bg-blue-500"
    number={totalLeads}
    label="Total Leads"
    change={10}
    isPositive={true}
  />
  <StatCard
    icon={<CheckCircle className="w-6 h-6 text-white" />}
    iconBg="bg-green-500"
    number={convertedLeads}
    label="Converted"
    change={15}
    isPositive={true}
  />
  {/* ... more stat cards */}
</div>

// Lead detail cards
<div className="space-y-4">
  {leads.map(lead => (
    <Card key={lead.id}>
      <CardHeader className="flex flex-row justify-between items-start">
        <CardTitle>{lead.name}</CardTitle>
        <Badge>{lead.status}</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm"><strong>Email:</strong> {lead.email}</p>
        <p className="text-sm"><strong>Interest:</strong> {lead.vehicleInterest}</p>
        <p className="text-sm"><strong>Score:</strong> {lead.leadScore}/100</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Contact</Button>
      </CardFooter>
    </Card>
  ))}
</div>
```

### Reports Page

File: `app/(dashboard)/reports/page.tsx`

```tsx
// Overview stats
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
  <StatCard
    icon={<DollarSign className="w-6 h-6 text-white" />}
    iconBg="bg-amber-500"
    number="$1.2M"
    label="Total Revenue"
    change={22}
    isPositive={true}
  />
  {/* ... more metrics */}
</div>

// Report sections
<Card className="mb-8">
  <CardHeader>
    <CardTitle>Sales Performance</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Chart content */}
  </CardContent>
</Card>
```

---

## Styling & Customization

### Default Styling

All cards use the design system (Section 1):

- **Colors:** #2563EB (primary), #EF4444 (destructive), #10B981 (success)
- **Shadows:** shadow-elevation-1, shadow-elevation-2
- **Spacing:** 16px-24px padding
- **Border Radius:** 8px
- **Typography:** Design system fonts

### Tailwind Classes

Standard Card classes:

```
bg-white
border border-gray-200
rounded-lg
shadow-elevation-2
p-6
```

Stat Card classes:

```
h-120px
bg-white
border border-gray-200
rounded-lg
shadow-elevation-1
p-5
hover:shadow-elevation-2
hover:bg-gray-50
```

Vehicle Card classes:

```
max-w-xs
bg-white
border border-gray-200
rounded-lg
shadow-elevation-1
hover:shadow-elevation-2
```

### Custom Styling

All components accept `className` prop:

```tsx
<StatCard
  {...props}
  className="min-h-140px" // Custom height
/>

<Card className="bg-gray-50"> {/* Custom background */}
  ...
</Card>

<VehicleCard
  {...props}
  className="max-w-sm" // Custom width
/>
```

---

## Implementation Checklist

### Phase 1: Verification ✅

- [x] Review existing components
- [x] Verify design system tokens
- [x] Check import paths

### Phase 2: Creation ✅

- [x] Create stat-card.tsx
- [x] Create vehicle-card.tsx
- [x] Create vehicle-grid.tsx

### Phase 3: Integration ✅

- [x] Update KPIGrid (Dashboard)
- [ ] Add to Inventory page (optional grid view)
- [ ] Add to Customers page
- [ ] Add to Leads page
- [ ] Add to Reports page

### Phase 4: Testing

- [ ] Test all card states
- [ ] Test responsive behavior
- [ ] Test with real data
- [ ] Test accessibility
- [ ] Cross-browser testing

---

## Related Documentation

- [Cards Component Specs](./CARDS_COMPONENT.md)
- [Quick Reference](./SECTION_3_3_QUICK_REFERENCE.md)
- [Button Component (3.1)](./BUTTON_COMPONENT.md)
- [Form Inputs (3.2)](./FORM_INPUTS.md)
- [Design System (1.0-2.0)](./DESIGN_SYSTEM_STRUCTURE.md)

---

## Common Issues & Solutions

### Issue: Card looks stretched or incorrect height

**Solution:** Make sure to pass correct `className` prop if using custom sizing. StatCard has fixed `h-120px` height.

### Issue: Vehicle images not loading

**Solution:** Provide valid image URLs or ensure `/public/vehicles/` folder exists with images. Component has fallback for missing images.

### Issue: Stat card not responding to click

**Solution:** Make sure to pass `onClick` prop to StatCard to enable interaction.

### Issue: Vehicle actions not showing on desktop

**Solution:** Actions appear on hover. Ensure mouse/hover events are working. On mobile, they may be always visible depending on implementation.

---

## Version History

| Version | Date         | Changes                            |
| ------- | ------------ | ---------------------------------- |
| 1.0     | Jan 23, 2026 | Initial cards implementation (3.3) |
|         |              | - StatCard component created       |
|         |              | - VehicleCard component created    |
|         |              | - VehicleGrid composite component  |
|         |              | - Dashboard KPIGrid updated        |
|         |              | - Comprehensive documentation      |
