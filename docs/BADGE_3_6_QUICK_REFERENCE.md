# Badge Component - Quick Reference (Section 3.6)

## TL;DR

The Badge component displays status, tags, and counts in a lightweight, reusable format.

---

## Quick Start (30 seconds)

```tsx
import { Badge } from '@/components/ui/badge';

// Default gray badge
<Badge>Default</Badge>

// Color variants
<Badge variant="blue">New</Badge>
<Badge variant="green">Active</Badge>
<Badge variant="yellow">Warning</Badge>
<Badge variant="red">Error</Badge>

// Pill shape
<Badge radius="pill">Rounded</Badge>
```

---

## Component API

### Badge Props

```tsx
<Badge
  variant="gray|blue|green|yellow|red" // Color variant
  radius="default|pill" // Shape
  className="..." // Additional styles
>
  {children}
</Badge>
```

---

## Color Reference

| Variant    | Usage             | Appearance        |
| ---------- | ----------------- | ----------------- |
| **gray**   | Neutral, inactive | Gray background   |
| **blue**   | Info, active, new | Blue background   |
| **green**  | Success, verified | Green background  |
| **yellow** | Warning, pending  | Yellow background |
| **red**    | Error, critical   | Red background    |

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
const variant = {
  low: "gray",
  medium: "blue",
  high: "yellow",
  critical: "red",
}[priority];

<Badge variant={variant}>{priority}</Badge>;
```

### Tag List

```tsx
<div className="flex gap-2">
  {tags.map((tag) => (
    <Badge key={tag} radius="pill" variant="blue">
      {tag}
    </Badge>
  ))}
</div>
```

### Count Badge

```tsx
<div className="relative">
  <button>Notifications</button>
  <Badge variant="red" className="absolute -top-2 -right-2">
    {count}
  </Badge>
</div>
```

### Icon + Badge

```tsx
<div className="flex items-center gap-2">
  <CheckCircle size={14} />
  <Badge variant="green">Verified</Badge>
</div>
```

---

## Dimensions

```
Height: 24px
Padding: 6px 10px
Radius: 4px (default) or 999px (pill)
Font: 12px medium
```

---

## Styling

### Default

```tsx
<Badge>Default badge</Badge>
```

### Pill

```tsx
<Badge radius="pill">Pill badge</Badge>
```

### Custom Class

```tsx
<Badge className="font-bold text-sm">Custom</Badge>
```

---

## Variants Visual

```
Gray:   [□] Neutral status
Blue:   [□] Info/Active
Green:  [□] Success
Yellow: [□] Warning
Red:    [□] Error
```

---

## Do's & Don'ts

### ✅ DO

- Use for short text (1-2 words)
- Use appropriate color for meaning
- Use pill for tags
- Combine with icons

### ❌ DON'T

- Use for long content
- Rely on color only
- Make interactive
- Overuse colors

---

## Integration Examples

### In Table

```tsx
<Badge variant={status === "active" ? "green" : "gray"}>{status}</Badge>
```

### In Card

```tsx
<Card>
  <Badge variant="blue">New</Badge>
  <h3>Title</h3>
</Card>
```

### In List

```tsx
<li className="flex justify-between">
  <span>Item</span>
  <Badge variant="green">Active</Badge>
</li>
```

---

## Design Tokens

### Colors (Hex)

| Variant | Background | Text    |
| ------- | ---------- | ------- |
| Gray    | #F3F4F6    | #374151 |
| Blue    | #DBEAFE    | #1E40AF |
| Green   | #D1FAE5    | #065F46 |
| Yellow  | #FEF3C7    | #92400E |
| Red     | #FEE2E2    | #991B1B |

### Sizes

- Height: 24px
- Padding X: 10px
- Padding Y: 6px
- Font: 12px

---

## Troubleshooting

### Badge not visible?

```tsx
// Check: variant is spelled correctly
<Badge variant="blue">✓</Badge>

// Check: children is present
<Badge>Content</Badge>
```

### Text too small?

```tsx
// Use custom className
<Badge className="text-sm">Larger text</Badge>
```

### Need custom colors?

```tsx
<Badge className="bg-purple-100 text-purple-900">Custom</Badge>
```

---

## Accessibility

✅ Good contrast ratio (WCAG AA)  
✅ Never color-only information  
✅ Readable font size (12px min)  
✅ Semantic meaning clear

---

## File Location

**Component**: `/components/ui/badge.tsx`  
**Full Docs**: `/docs/BADGE_3_6.md`  
**Quick Ref**: `/docs/BADGE_3_6_QUICK_REFERENCE.md` (this file)

---

## Next Steps

1. **Use the component**: Import and add to your page
2. **Choose variant**: Select appropriate color
3. **Customize**: Add className if needed
4. **Test**: Verify on mobile and desktop

---

**Version**: 1.0  
**Status**: ✅ Ready to Use  
**Last Updated**: January 23, 2026
