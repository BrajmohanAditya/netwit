# Cards Quick Reference (3.3)

## Component Import Paths

```tsx
// Standard Card (shadcn/ui - already exists)
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

// Stat Card (NEW)
import { StatCard } from "@/components/ui/stat-card";

// Vehicle Card (NEW)
import { VehicleCard } from "@/components/ui/vehicle-card";
```

---

## Quick Specifications

### Standard Card

| Property   | Value                              |
| ---------- | ---------------------------------- |
| Background | White                              |
| Border     | 1px solid #E5E7EB                  |
| Radius     | 8px                                |
| Shadow     | Level 2                            |
| Padding    | 24px                               |
| Header     | 20px semibold + 14px gray subtitle |
| Footer     | 16px padding, top border           |

### Stat Card

| Property | Value                    |
| -------- | ------------------------ |
| Height   | 120px                    |
| Shadow   | Level 1 (hover: Level 2) |
| Icon     | 40px circle, colored     |
| Number   | 28px bold                |
| Label    | 14px gray                |
| Change   | 12px, green/red          |
| Hover    | +shadow, bg change       |

### Vehicle Card

| Property    | Value                            |
| ----------- | -------------------------------- |
| Image Ratio | 16:9 (160px height)              |
| Shadow      | Level 1 (hover: Level 2)         |
| Padding     | 16px content                     |
| Title       | 16px bold                        |
| Price       | 20px bold blue                   |
| Actions     | Hidden by default, show on hover |

---

## Usage Examples

### Stat Card

```tsx
import { StatCard } from "@/components/ui/stat-card"
import { Users, TrendingUp, ShoppingCart, BarChart3 } from "lucide-react"

// Single Stat Card
<StatCard
  icon={<Users className="h-6 w-6 text-white" />}
  iconBg="bg-blue-500"
  number={9234}
  label="Total Users"
  change={12.5}
  isPositive={true}
  onClick={() => navigate("/users")}
/>

// Dashboard Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard
    icon={<Users className="h-6 w-6 text-white" />}
    iconBg="bg-blue-500"
    number={9234}
    label="Total Users"
    change={12.5}
  />
  <StatCard
    icon={<ShoppingCart className="h-6 w-6 text-white" />}
    iconBg="bg-green-500"
    number={1250}
    label="Total Sales"
    change={8.2}
  />
  <StatCard
    icon={<TrendingUp className="h-6 w-6 text-white" />}
    iconBg="bg-amber-500"
    number="$45,600"}
    label="Total Revenue"
    change={-3.1}
    isPositive={false}
  />
  <StatCard
    icon={<BarChart3 className="h-6 w-6 text-white" />}
    iconBg="bg-purple-500"
    number={156}
    label="Total Vehicles"
    change={15.0}
  />
</div>
```

### Vehicle Card

```tsx
import { VehicleCard } from "@/components/ui/vehicle-card";
import { Heart, Eye, Share2 } from "lucide-react";

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <VehicleCard
    id="1"
    image="/vehicles/tesla-model-3.jpg"
    title="2024 Tesla Model 3"
    subtitle="Sedan • Silver"
    price={45999}
    status="Available"
    stockNumber="VH-2024-001"
    specs={[
      { icon: "📅", label: "2024" },
      { icon: "⛽", label: "45K mi" },
      { icon: "🔧", label: "FWD" },
      { icon: "🛞", label: "205/55R16" },
    ]}
    vin="ABCD1234567890EFG"
    actions={[
      {
        label: "View",
        icon: <Eye className="h-4 w-4" />,
        onClick: () => viewVehicle("1"),
      },
      {
        label: "Like",
        icon: <Heart className="h-4 w-4" />,
        onClick: () => likeVehicle("1"),
      },
      {
        label: "Share",
        icon: <Share2 className="h-4 w-4" />,
        onClick: () => shareVehicle("1"),
      },
    ]}
  />
</div>;
```

### Standard Card

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Simple Card
<Card>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>

// Card with Header & Footer
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Main content</p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Submit</Button>
  </CardFooter>
</Card>
```

---

## Where to Use

| Card Type | Dashboard   | Inventory  | Customers | Leads    | Reports    |
| --------- | ----------- | ---------- | --------- | -------- | ---------- |
| Standard  | ✅ Sections | ✅ Filters | ✅ Info   | ✅ Info  | ✅ KPI     |
| Stat      | ✅ KPIs     | ✅ Stats   | ✅ Stats  | ✅ Stats | ✅ Metrics |
| Vehicle   | ❌          | ✅ Grid    | ❌        | ❌       | ❌         |

---

## Color Reference for StatCard Icons

```tsx
// Users/People
iconBg = "bg-blue-500"; // #3B82F6

// Sales/Orders
iconBg = "bg-green-500"; // #10B981

// Revenue/Money
iconBg = "bg-amber-500"; // #F59E0B

// Tasks/Work
iconBg = "bg-purple-500"; // #A855F7

// Performance
iconBg = "bg-cyan-500"; // #06B6D4

// Inventory
iconBg = "bg-rose-500"; // #F43F5E
```

---

## File Locations

| Component     | File                             | Status     |
| ------------- | -------------------------------- | ---------- |
| Standard Card | `components/ui/card.tsx`         | ✅ Exists  |
| Stat Card     | `components/ui/stat-card.tsx`    | ✅ Created |
| Vehicle Card  | `components/ui/vehicle-card.tsx` | ✅ Created |

---

## Implementation Checklist

### Dashboard Page

- [ ] Import StatCard
- [ ] Create stat cards grid with 4 metrics
- [ ] Set onClick handlers for filtering

### Inventory Page

- [ ] Import VehicleCard
- [ ] Create vehicle grid layout
- [ ] Add image URLs
- [ ] Add action handlers (view, like, share)
- [ ] Test hover states
- [ ] Test responsive layout

### Customer Cards

- [ ] Use Standard Card for customer info
- [ ] Add customer details in CardContent

### Reports

- [ ] Use StatCard for metrics
- [ ] Use Standard Card for sections
- [ ] Group related KPIs

---

## Related Files

- **Full Documentation:** [CARDS_COMPONENT.md](./CARDS_COMPONENT.md)
- **Button Component:** [BUTTON_COMPONENT.md](./BUTTON_COMPONENT.md)
- **Form Inputs:** [FORM_INPUTS.md](./FORM_INPUTS.md)
- **Design System:** [DESIGN_SYSTEM_STRUCTURE.md](./DESIGN_SYSTEM_STRUCTURE.md)
