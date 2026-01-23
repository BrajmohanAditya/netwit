# Badge Component (Section 3.6)

## Overview

The Badge component displays short labels, status indicators, tags, and counts. It's a lightweight, reusable component for highlighting information on your UI.

## Design Specifications

### Structure

#### Height

- **Value**: 24px (h-6)
- **Internal Padding Vertical**: 6px (py-1.5)
- **Internal Padding Horizontal**: 10px (px-2.5)

#### Typography

- **Font Size**: 12px (text-xs)
- **Font Weight**: Medium (500)
- **Line Height**: 1.5rem
- **Letter Spacing**: Normal

#### Border Radius

- **Default**: 4px (rounded)
- **Pill**: 999px (rounded-full)

### Color Variants

#### Gray

- **Background**: #F3F4F6 (bg-gray-100)
- **Text**: #374151 (text-gray-900)
- **Usage**: Neutral status, secondary information

#### Blue

- **Background**: #DBEAFE (bg-blue-100)
- **Text**: #1E40AF (text-blue-900)
- **Usage**: Info, active, primary status

#### Green

- **Background**: #D1FAE5 (bg-green-100)
- **Text**: #065F46 (text-green-900)
- **Usage**: Success, verified, approved

#### Yellow

- **Background**: #FEF3C7 (bg-yellow-100)
- **Text**: #92400E (text-yellow-900)
- **Usage**: Warning, pending, caution

#### Red

- **Background**: #FEE2E2 (bg-red-100)
- **Text**: #991B1B (text-red-900)
- **Usage**: Error, alert, critical

---

## Component API

### Badge

```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "gray" | "blue" | "green" | "yellow" | "red";
  radius?: "default" | "pill";
  children: React.ReactNode;
}
```

**Props:**

- `variant` - Color variant (default: "gray")
- `radius` - Border radius style (default: "default")
- `children` - Badge content (text, numbers, icons)
- `className` - Additional CSS classes

---

## Usage Examples

### Basic Badge

```tsx
import { Badge } from "@/components/ui/badge";

export function BasicBadges() {
  return (
    <div className="flex gap-2">
      <Badge>Default</Badge>
      <Badge variant="blue">New</Badge>
      <Badge variant="green">Active</Badge>
      <Badge variant="yellow">Pending</Badge>
      <Badge variant="red">Error</Badge>
    </div>
  );
}
```

### Status Badge

```tsx
export function StatusBadge({ status }) {
  const variants: Record<string, "gray" | "blue" | "green" | "yellow" | "red"> =
    {
      draft: "gray",
      active: "green",
      pending: "yellow",
      inactive: "red",
    };

  return <Badge variant={variants[status]}>{status}</Badge>;
}
```

### Pill Badge

```tsx
export function PillBadges() {
  return (
    <div className="flex gap-2">
      <Badge radius="pill" variant="blue">
        React
      </Badge>
      <Badge radius="pill" variant="green">
        TypeScript
      </Badge>
      <Badge radius="pill" variant="yellow">
        In Progress
      </Badge>
    </div>
  );
}
```

### Count Badge

```tsx
export function CountBadges() {
  return (
    <div className="flex gap-4">
      <div className="relative">
        <button>Notifications</button>
        <Badge variant="red" className="absolute -top-2 -right-2">
          5
        </Badge>
      </div>

      <div className="relative">
        <button>Messages</button>
        <Badge variant="blue" className="absolute -top-2 -right-2">
          12
        </Badge>
      </div>
    </div>
  );
}
```

### Badge with Icon

```tsx
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

export function IconBadges() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <CheckCircle size={14} />
        <Badge variant="green">Verified</Badge>
      </div>

      <div className="flex items-center gap-2">
        <AlertCircle size={14} />
        <Badge variant="yellow">Review Needed</Badge>
      </div>

      <div className="flex items-center gap-2">
        <XCircle size={14} />
        <Badge variant="red">Rejected</Badge>
      </div>
    </div>
  );
}
```

### Badge List (Tags)

```tsx
export function TagList() {
  const tags = ["react", "typescript", "design-system"];

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge key={tag} radius="pill" variant="blue">
          {tag}
        </Badge>
      ))}
    </div>
  );
}
```

### Dynamic Color Badge

```tsx
export function DynamicBadge({ value, type }) {
  const getVariant = (
    type: string,
  ): "gray" | "blue" | "green" | "yellow" | "red" => {
    switch (type) {
      case "info":
        return "blue";
      case "success":
        return "green";
      case "warning":
        return "yellow";
      case "error":
        return "red";
      default:
        return "gray";
    }
  };

  return <Badge variant={getVariant(type)}>{value}</Badge>;
}
```

---

## Styling

### Default Style

```tsx
<Badge variant="gray">Default Badge</Badge>
```

### Pill Shape

```tsx
<Badge radius="pill">Pill Badge</Badge>
```

### Custom Styling

```tsx
<Badge variant="blue" className="text-sm font-bold">
  Custom Style
</Badge>
```

### Size Variations

Using className:

```tsx
// Smaller
<Badge className="h-5 px-2 text-xs">Small</Badge>

// Larger
<Badge className="h-8 px-3 text-sm">Large</Badge>
```

---

## Accessibility

✅ **Semantic HTML**: Uses `<div>` with appropriate styling  
✅ **Color + Text**: Never relies on color alone  
✅ **Contrast**: All variants meet WCAG AA standards  
✅ **Font Size**: 12px minimum for readability  
✅ **Spacing**: Adequate padding for touch targets

---

## Color Reference

### Hex Values

| Variant | Background | Text    |
| ------- | ---------- | ------- |
| Gray    | #F3F4F6    | #374151 |
| Blue    | #DBEAFE    | #1E40AF |
| Green   | #D1FAE5    | #065F46 |
| Yellow  | #FEF3C7    | #92400E |
| Red     | #FEE2E2    | #991B1B |

### Tailwind Classes

| Variant | Background    | Text            |
| ------- | ------------- | --------------- |
| Gray    | bg-gray-100   | text-gray-900   |
| Blue    | bg-blue-100   | text-blue-900   |
| Green   | bg-green-100  | text-green-900  |
| Yellow  | bg-yellow-100 | text-yellow-900 |
| Red     | bg-red-100    | text-red-900    |

---

## Common Patterns

### Status Badge

```tsx
<Badge variant={isActive ? "green" : "gray"}>
  {isActive ? "Active" : "Inactive"}
</Badge>
```

### Priority Badge

```tsx
const getPriorityVariant = (
  priority: "low" | "medium" | "high" | "critical",
) => {
  switch (priority) {
    case "low":
      return "gray";
    case "medium":
      return "blue";
    case "high":
      return "yellow";
    case "critical":
      return "red";
  }
};

<Badge variant={getPriorityVariant(priority)}>{priority.toUpperCase()}</Badge>;
```

### Count Badge

```tsx
{
  count > 0 && (
    <Badge
      variant="red"
      className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0 flex items-center justify-center"
    >
      {count}
    </Badge>
  );
}
```

### Technology Tag

```tsx
<div className="flex gap-2 flex-wrap">
  {technologies.map((tech) => (
    <Badge key={tech} radius="pill" variant="blue">
      {tech}
    </Badge>
  ))}
</div>
```

---

## Use Cases

### Status Indicators

- Active/Inactive status
- Draft/Published status
- Verified/Unverified status
- Online/Offline status

### Tags & Labels

- Technology stack
- Product categories
- Content tags
- User roles

### Counts

- Notification count
- Message count
- Item count
- Badge count

### Alerts

- Warning messages
- Error indicators
- Info badges
- Success confirmations

---

## Do's & Don'ts

### ✅ DO

- Use for short, concise information
- Use appropriate color for meaning
- Keep text to one or two words
- Use pill radius for tags
- Combine with icons when helpful
- Use for status indication

### ❌ DON'T

- Use for long text
- Rely on color alone for meaning
- Use interactive badges (non-clickable)
- Mix too many variants together
- Use with complex icons
- Change default padding excessively

---

## Integration Points

### In Tables

```tsx
<td>
  <Badge variant={status === "active" ? "green" : "gray"}>{status}</Badge>
</td>
```

### In Cards

```tsx
<Card>
  <Badge variant="blue" className="mb-2">
    New
  </Badge>
  <h3>Card Title</h3>
  <p>Card content...</p>
</Card>
```

### In Lists

```tsx
<li className="flex items-center justify-between">
  <span>Item name</span>
  <Badge variant="green">Verified</Badge>
</li>
```

### In User Profiles

```tsx
<div className="flex gap-2">
  <Badge variant="blue" radius="pill">
    Expert
  </Badge>
  <Badge variant="green" radius="pill">
    Verified
  </Badge>
</div>
```

---

## Browser Support

✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+  
✅ Mobile browsers

---

## Performance

- **Size**: Minimal (< 1KB)
- **Rendering**: Instant
- **No animation**: Static component
- **Responsive**: Yes

---

## Related Components

- [Button](/components/ui/button.tsx)
- [Card](/components/ui/card.tsx)
- [Table](/components/ui/table.tsx)

---

## Dependencies

- `react` - React library
- `tailwindcss` - Styling

---

**Last Updated**: January 23, 2026  
**Status**: ✅ Production Ready
