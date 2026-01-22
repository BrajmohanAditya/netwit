# Button Component Documentation (3.1)

## Overview

The button component system provides three variants (Primary, Secondary, Destructive) with three size options (Small, Medium, Large) to be used consistently throughout the dashboard.

---

## Button Variants

### Primary Button

**Use for:** Save, Create, Submit

- **Background Color:** `#2563EB` (Brand Blue)
- **Text Color:** White
- **Text Size:** 14px, medium weight
- **Border Radius:** 6px
- **Height:** 40px (default)
- **Padding:** 10px 16px (default)

#### States

| State    | Background | Notes                          |
| -------- | ---------- | ------------------------------ |
| Default  | `#2563EB`  | -                              |
| Hover    | `#1D4ED8`  | Darker shade                   |
| Active   | `#1E40AF`  | Even darker, scale 0.98        |
| Disabled | `#2563EB`  | 50% opacity                    |
| Loading  | `#2563EB`  | Spinner icon visible, disabled |

#### Example Usage

```tsx
<Button variant="primary" size="md">
  Create Lead
</Button>
```

---

### Secondary Button

**Use for:** Cancel, Reset, Alternative Actions

- **Background Color:** Transparent
- **Border:** 2px solid `#D1D5DB` (Light Gray)
- **Text Color:** `#374151` (Dark Gray)
- **Border Radius:** 6px
- **Height:** 40px (default)
- **Padding:** 10px 16px (default)

#### States

| State    | Background  | Border    | Text Color |
| -------- | ----------- | --------- | ---------- |
| Default  | Transparent | `#D1D5DB` | `#374151`  |
| Hover    | `#F3F4F6`   | `#D1D5DB` | `#374151`  |
| Active   | Gray-100    | `#D1D5DB` | `#374151`  |
| Disabled | Transparent | `#D1D5DB` | `#374151`  |

#### Example Usage

```tsx
<Button variant="secondary" size="md">
  Cancel
</Button>
```

---

### Destructive Button

**Use for:** Delete, Remove, Dangerous Actions

- **Background Color:** `#EF4444` (Red)
- **Text Color:** White
- **Border Radius:** 6px
- **Height:** 40px (default)
- **Padding:** 10px 16px (default)
- **Important:** Always require confirmation before action

#### States

| State    | Background | Notes                   |
| -------- | ---------- | ----------------------- |
| Default  | `#EF4444`  | -                       |
| Hover    | `#DC2626`  | Darker shade            |
| Active   | `#B91C1C`  | Even darker, scale 0.98 |
| Disabled | `#EF4444`  | 50% opacity             |

#### Example Usage

```tsx
<Button variant="destructive" size="md" onClick={handleDelete}>
  Delete
</Button>
```

---

## Button Sizes

### Small (sm)

- **Height:** 32px
- **Padding:** 8px 12px
- **Font Size:** 14px (text-sm)
- **Usage:** Compact UI, secondary actions in dense layouts

```tsx
<Button variant="primary" size="sm">
  Quick Action
</Button>
```

### Medium (md) - Default

- **Height:** 40px
- **Padding:** 10px 16px
- **Font Size:** 16px (text-base)
- **Usage:** Standard buttons across dashboard

```tsx
<Button variant="primary" size="md">
  Save Changes
</Button>
```

### Large (lg)

- **Height:** 48px
- **Padding:** 12px 20px
- **Font Size:** 16px (text-base)
- **Usage:** Primary call-to-action buttons, important actions

```tsx
<Button variant="primary" size="lg">
  Create Invoice
</Button>
```

### Icon

- **Size:** 40px × 40px
- **Usage:** Icon-only buttons

```tsx
<Button variant="primary" size="icon">
  <PlusIcon className="w-4 h-4" />
</Button>
```

---

## Global Button States

### Hover State

- **Transition Duration:** 150ms
- **Transition Timing:** cubic-bezier(0.4, 0, 0.2, 1)
- **Shadow Enhancement:** Elevation increases by 1 level
- **Color:** Specific to each variant

### Active State

- **Scale Transform:** 0.98 (slight compression for tactile feedback)
- **Transition:** Instant
- **Color:** Darker variant color

### Disabled State

- **Opacity:** 50%
- **Cursor:** not-allowed
- **Pointer Events:** None
- \*\*No transitions on hover

### Loading State

- **Display:** Loader2 spinner icon
- **Icon Placement:** Left of text with 8px margin
- **Animation:** Spinning animation (animate-spin)
- **Behavior:** Button disabled while loading
- **Usage:** Form submissions, async operations

```tsx
<Button
  variant="primary"
  size="md"
  isLoading={isSubmitting}
  disabled={isSubmitting}
>
  {isSubmitting ? "Saving..." : "Save"}
</Button>
```

---

## Implementation Details

### Component File

**Location:** `components/ui/button.tsx`

### Import

```tsx
import { Button } from "@/components/ui/button";
```

### Key Props

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  asChild?: boolean;
  className?: string;
}
```

### Common Props

- `variant`: Style variant (default: "primary")
- `size`: Button size (default: "md")
- `isLoading`: Show loading spinner (default: false)
- `disabled`: Disable button interactions
- `type`: HTML button type ("button", "submit", "reset")
- `onClick`: Click handler function
- `className`: Additional Tailwind classes

---

## Usage Examples

### Form Submit Button

```tsx
<Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
  Save Changes
</Button>
```

### Cancel Button

```tsx
<Button variant="secondary" size="md" onClick={() => navigate(-1)}>
  Cancel
</Button>
```

### Delete with Confirmation

```tsx
<Button
  variant="destructive"
  size="sm"
  onClick={() => {
    if (window.confirm("Are you sure?")) {
      handleDelete();
    }
  }}
>
  Delete
</Button>
```

### Icon Button

```tsx
<Button variant="secondary" size="icon" title="Edit">
  <EditIcon className="w-4 h-4" />
</Button>
```

### Button Group

```tsx
<div className="flex gap-3">
  <Button variant="primary" size="md">
    Save
  </Button>
  <Button variant="secondary" size="md">
    Cancel
  </Button>
  <Button variant="destructive" size="sm">
    Delete
  </Button>
</div>
```

---

## Color Specifications

### Exact Hex Values

```
Primary:
  - Default: #2563EB
  - Hover: #1D4ED8
  - Active: #1E40AF

Secondary:
  - Background: Transparent
  - Border: #D1D5DB
  - Text: #374151
  - Hover Background: #F3F4F6

Destructive:
  - Default: #EF4444
  - Hover: #DC2626
  - Active: #B91C1C

Text Colors:
  - Primary: White
  - Secondary: #374151
  - Destructive: White
```

---

## Accessibility

- ✅ Focus ring visible on keyboard navigation
- ✅ Sufficient color contrast ratio (WCAG AA)
- ✅ Disabled state clearly indicated
- ✅ Loading state announced to screen readers
- ✅ Type attribute supports semantic HTML
- ✅ Supports aria attributes

---

## Dashboard Usage

### Current Implementation

Buttons are implemented in the following pages:

- Dashboard (page-header)
- Leads (create, view actions)
- Test Drives (schedule)
- Settings (system health)
- Invoices (create, print, mark as paid)
- User Menu (logout - destructive)
- Notifications (view all - link)

### Recommended Patterns

**Create/Add Actions:** Primary button, Large size
**Delete/Remove Actions:** Destructive button, always with confirmation
**Navigation/Cancel:** Secondary button, Medium size
**Icon Actions:** Icon size, Secondary variant for non-critical
**Form Submit:** Primary button, Medium to Large size
**Loading States:** Always use `isLoading` prop with loading text

---

## Version History

| Version | Date         | Changes                                                                |
| ------- | ------------ | ---------------------------------------------------------------------- |
| 1.0     | Jan 23, 2026 | Initial design system (3.1) - Primary, Secondary, Destructive variants |

---

## Related Components

- [Page Header Documentation](./DESIGN_SYSTEM.md#section-3)
- [Design System (Sections 1-2)](./DESIGN_SYSTEM.md)
- [Color System](./DESIGN_SYSTEM.md#section-1)
- [Typography](./DESIGN_SYSTEM.md#section-1-2)

---

## Support & Updates

For updates to button specifications or to suggest improvements:

1. Review design requirements in Section 3.1
2. Update component in `components/ui/button.tsx`
3. Test across all dashboard pages
4. Update this documentation
5. Commit with descriptive message
