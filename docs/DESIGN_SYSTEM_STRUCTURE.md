# Design System Structure & Component Locations

## 📁 Project Structure

```
adaptusdms/
├── components/
│   ├── ui/
│   │   ├── button.tsx                 ✅ 3.1 Button Component
│   │   ├── input.tsx                  ⏳ 3.2 Text Input
│   │   ├── select.tsx                 ⏳ 3.2 Dropdown/Select
│   │   ├── checkbox.tsx               ⏳ 3.2 Checkbox
│   │   ├── radio.tsx                  ⏳ 3.2 Radio Button
│   │   ├── switch.tsx                 ✅ 3.2 Toggle Switch
│   │   ├── calendar.tsx               ✅ 3.2 Date Picker
│   │   ├── file-upload.tsx            🆕 3.2 File Upload (TO CREATE)
│   │   ├── form.tsx                   React Hook Form wrapper
│   │   ├── label.tsx                  Form label
│   │   ├── card.tsx                   Card container
│   │   └── [other UI components]
│   ├── layout/
│   │   ├── main-layout.tsx
│   │   ├── sidebar.tsx
│   │   ├── navbar.tsx
│   │   └── ...
│   └── [feature components]
│
├── app/
│   ├── globals.css                    Design tokens (CSS variables)
│   ├── layout.tsx
│   └── (dashboard)/
│       ├── page.tsx                   Dashboard
│       ├── leads/
│       ├── invoices/
│       ├── customers/
│       ├── inventory/
│       └── ...
│
├── docs/
│   ├── BUTTON_COMPONENT.md            ✅ 3.1 Buttons Documentation
│   ├── FORM_INPUTS.md                 ✅ 3.2 Form Inputs Documentation
│   ├── DESIGN_SYSTEM_STRUCTURE.md     📄 This file
│   └── [other documentation]
│
├── tailwind.config.ts                 Design tokens config
├── package.json
└── ...
```

---

## 🎨 Design System Sections

### Section 1: Design System Fundamentals

**File:** `docs/DESIGN_SYSTEM.md` (Reference in conversation summary)

- **1.1 Color System:** 6 color categories (primary, secondary, success, warning, destructive, muted)
- **1.2 Typography:** 7 font sizes, 3 line heights, 3 text colors
- **1.3 Spacing:** 4px base unit with 7 scales
- **1.4 Shadows:** 5 elevation levels
- **1.5 Border Radius:** 5 scales (4px, 6px, 8px, 12px, 999px)
- **1.6 Animations:** 3 timing durations with cubic-bezier easing

**Implementation:** `tailwind.config.ts` + `app/globals.css`

---

### Section 2: Layout Structure

**File:** `docs/DESIGN_SYSTEM.md` (Reference in conversation summary)

- **2.1 Main Layout:** Responsive grid with sidebar + content
- **2.2 Sidebar Navigation:** 8 sections, 27 items, all states
- **2.3 Top Header/Navbar:** Breadcrumbs, search, notifications, user menu

**Implementation:**

- `components/layout/main-layout.tsx`
- `components/layout/sidebar.tsx`
- `components/layout/navbar.tsx` (+ subcomponents)

---

### Section 3: Component Library

#### **3.1 Buttons** ✅ COMPLETE

**File:** `docs/BUTTON_COMPONENT.md`

Components:

- Primary Button (Save, Create, Submit)
- Secondary Button (Cancel, Reset)
- Destructive Button (Delete, Remove)

Sizes: sm (32px), md (40px), lg (48px), icon

**Implementation:** `components/ui/button.tsx`

#### **3.2 Form Inputs** ⏳ IN PROGRESS

**File:** `docs/FORM_INPUTS.md`

Components:

- Text Input (40px height, exact padding/colors)
- Dropdown/Select (with chevron, dropdown panel)
- Checkbox (18×18px, 4px radius)
- Radio Button (18×18px, circle)
- Toggle Switch (44×24px, 200ms animation)
- Date Picker (calendar popup with navigation)
- File Upload (drag & drop zone, preview area)

**Implementation:**

- `components/ui/input.tsx` (update needed)
- `components/ui/select.tsx` (update needed)
- `components/ui/checkbox.tsx` (update needed)
- `components/ui/radio.tsx` (create new)
- `components/ui/switch.tsx` (already exists)
- `components/ui/calendar.tsx` (already exists)
- `components/ui/file-upload.tsx` (create new)

#### **3.3 Modals & Dialogs** 🆕 PENDING

To be documented - dialog, alert dialog, confirmation modals

#### **3.4 Data Tables** 🆕 PENDING

To be documented - table structure, sorting, pagination

#### **3.5 Cards & Containers** 🆕 PENDING

To be documented - card variations, spacing, styling

---

## 📍 Component Files Quick Reference

### Form Components

| Component   | File                            | Exists? | Docs             |
| ----------- | ------------------------------- | ------- | ---------------- |
| Text Input  | `components/ui/input.tsx`       | ✅      | `FORM_INPUTS.md` |
| Select      | `components/ui/select.tsx`      | ✅      | `FORM_INPUTS.md` |
| Checkbox    | `components/ui/checkbox.tsx`    | ✅      | `FORM_INPUTS.md` |
| Radio       | `components/ui/radio.tsx`       | ✅      | `FORM_INPUTS.md` |
| Switch      | `components/ui/switch.tsx`      | ✅      | `FORM_INPUTS.md` |
| Calendar    | `components/ui/calendar.tsx`    | ✅      | `FORM_INPUTS.md` |
| File Upload | `components/ui/file-upload.tsx` | ❌      | `FORM_INPUTS.md` |

### Layout Components

| Component     | File                                  | Exists? |
| ------------- | ------------------------------------- | ------- |
| Main Layout   | `components/layout/main-layout.tsx`   | ✅      |
| Sidebar       | `components/layout/sidebar.tsx`       | ✅      |
| Navbar        | `components/layout/navbar.tsx`        | ✅      |
| Breadcrumbs   | `components/layout/breadcrumbs.tsx`   | ✅      |
| Search Bar    | `components/layout/search-bar.tsx`    | ✅      |
| Notifications | `components/layout/notifications.tsx` | ✅      |
| User Menu     | `components/layout/user-menu.tsx`     | ✅      |

### UI Components

| Component     | File                              | Exists? |
| ------------- | --------------------------------- | ------- |
| Button        | `components/ui/button.tsx`        | ✅      |
| Card          | `components/ui/card.tsx`          | ✅      |
| Badge         | `components/ui/badge.tsx`         | ✅      |
| Avatar        | `components/ui/avatar.tsx`        | ✅      |
| Dialog        | `components/ui/dialog.tsx`        | ✅      |
| Dropdown Menu | `components/ui/dropdown-menu.tsx` | ✅      |
| Popover       | `components/ui/popover.tsx`       | ✅      |
| Tabs          | `components/ui/tabs.tsx`          | ✅      |
| Table         | `components/ui/table.tsx`         | ✅      |
| Label         | `components/ui/label.tsx`         | ✅      |
| Form          | `components/ui/form.tsx`          | ✅      |

---

## 🔧 How to Update Components

### Step 1: Review Specification

- Go to `docs/FORM_INPUTS.md` for 3.2 specs
- Go to `docs/BUTTON_COMPONENT.md` for 3.1 specs

### Step 2: Update Component File

Example for updating `input.tsx`:

```tsx
// components/ui/input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // 3.2 Specifications:
          "flex h-10 w-full", // Height: 40px ✅
          "rounded-sm", // Radius: 6px ✅
          "border border-[#D1D5DB]", // Border: 1px solid #D1D5DB ✅
          "px-3 py-2", // Padding: 10px 12px ✅
          "text-sm", // Font: 14px ✅
          "bg-white", // Background: white ✅
          // States:
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-[#2563EB]", // Focus ring: blue
          "focus-visible:border-[#2563EB]", // Focus border: blue
          // Disabled:
          "disabled:bg-[#F3F4F6]",
          "disabled:cursor-not-allowed",
          "disabled:opacity-50",
          // Error state (apply via className prop):
          "aria-invalid:border-[#EF4444]",
          "aria-invalid:ring-[#EF4444]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
```

### Step 3: Test Component

```tsx
// Test in a component:
<div className="space-y-2">
  <label>Email</label>
  <Input placeholder="email@example.com" />
</div>
```

### Step 4: Update Documentation

- Add notes to `FORM_INPUTS.md`
- Update version history
- Add usage examples

---

## 📝 Design Tokens Reference

### Colors Used in Components

```css
/* Text Input & Dropdowns */
--border-color: #d1d5db (default border) --focus-color: #2563eb
  (focus ring/border) --error-color: #ef4444 (error state)
  --disabled-bg: #f3f4f6 (disabled background) --placeholder-color: #9ca3af
  (placeholder text) /* Checkbox & Radio */ --checked-bg: #2563eb
  (checked background) --unchecked-border: #d1d5db (unchecked border)
  --hover-border: #9ca3af (hover border) /* Toggle Switch */
  --switch-off-bg: #d1d5db (off background) --switch-on-bg: #2563eb
  (on background) --switch-duration: 200ms (animation) /* File Upload */
  --dropzone-border: #d1d5db (default border) --dropzone-bg: #f9fafb
  (default background) --dropzone-hover-bg: #f3f4f6 (hover background)
  --dropzone-active-border: #2563eb (drag active);
```

---

## 🎯 Implementation Checklist

### Phase 1: Documentation ✅

- [x] Create `BUTTON_COMPONENT.md` (3.1)
- [x] Create `FORM_INPUTS.md` (3.2)
- [x] Create `DESIGN_SYSTEM_STRUCTURE.md` (this file)

### Phase 2: Button Component ✅

- [x] Update `components/ui/button.tsx`
- [x] Apply to navbar (user menu, notifications)
- [x] Apply to page headers (create, save buttons)
- [x] Apply to dashboard pages (leads, invoices, test drives)

### Phase 3: Form Inputs ⏳

- [ ] Update `components/ui/input.tsx` with exact specs
- [ ] Update `components/ui/select.tsx` with dropdown panel
- [ ] Update `components/ui/checkbox.tsx` with specs
- [ ] Update `components/ui/radio.tsx` with specs
- [ ] Verify `components/ui/switch.tsx` matches specs
- [ ] Verify `components/ui/calendar.tsx` matches specs
- [ ] Create `components/ui/file-upload.tsx`
- [ ] Apply to all forms across dashboard
- [ ] Test validation error styling

### Phase 4: Additional Components 🆕

- [ ] Document modals & dialogs (3.3)
- [ ] Document data tables (3.4)
- [ ] Document cards & containers (3.5)
- [ ] Create remaining component files
- [ ] Apply across dashboard

---

## 🔗 How to Use This Structure

### For Developers

1. Check the component exists in `components/ui/`
2. Review documentation in `docs/`
3. Copy usage example from docs
4. Apply to your component/page

### For Designers

1. Review color specs in each doc
2. Check exact measurements (px, dimensions)
3. Verify hover/focus/error states
4. Confirm animations and transitions

### For Project Managers

1. Track completion via checklist
2. Each section has clear status (✅ ⏳ 🆕 ❌)
3. Prioritize by phase
4. Update version history when complete

---

## 📞 Questions & Support

- **Component not found?** Check if file exists in quick reference
- **Specs unclear?** Review the detailed documentation
- **Need example?** Look for usage examples in each doc
- **Implementation help?** Follow the "How to Update Components" guide

---

## Version History

| Version | Date         | Changes                         |
| ------- | ------------ | ------------------------------- |
| 1.0     | Jan 23, 2026 | Initial structure documentation |

---

**Last Updated:** January 23, 2026
**Status:** Active Development
**Phase:** 2-3 (Buttons complete, Form Inputs in progress)
