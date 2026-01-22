# Form Inputs Documentation (3.2)

## Overview

Form input components provide consistent styling and behavior across the dashboard. All components follow the design system specifications with precise measurements, colors, and interaction states.

---

## Text Input

### Specifications

- **Height:** 40px
- **Padding:** 10px (vertical) × 12px (horizontal)
- **Border:** 1px solid `#D1D5DB`
- **Border Radius:** 6px
- **Font Size:** 14px
- **Font Weight:** Regular (400)
- **Background:** White

### States

| State       | Border Color | Ring Color | Background | Notes                |
| ----------- | ------------ | ---------- | ---------- | -------------------- |
| Default     | `#D1D5DB`    | None       | White      | -                    |
| Focus       | `#2563EB`    | `#2563EB`  | White      | Ring: 2px offset 2px |
| Error       | `#EF4444`    | `#EF4444`  | White      | Ring: 2px offset 2px |
| Disabled    | `#D1D5DB`    | None       | `#F3F4F6`  | 50% opacity          |
| Placeholder | `#9CA3AF`    | -          | -          | Gray text            |

### Component File

**Location:** `components/ui/input.tsx`

### Usage Example

```tsx
import { Input } from "@/components/ui/input";

<Input
  type="text"
  placeholder="Enter your name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>;
```

### With Error State

```tsx
<div className="space-y-2">
  <label className="text-sm font-medium">Email</label>
  <Input
    type="email"
    className="border-destructive focus-visible:ring-destructive"
    placeholder="email@example.com"
  />
  <p className="text-xs text-destructive">Email is required</p>
</div>
```

---

## Dropdown/Select

### Specifications

- **Height:** 40px
- **Padding:** 10px (vertical) × 12px (horizontal)
- **Border:** 1px solid `#D1D5DB`
- **Border Radius:** 6px
- **Font Size:** 14px
- **Chevron Icon:** Right-aligned, `ChevronDown` icon
- **Background:** White

### Dropdown Panel

- **Max Height:** 300px (scrollable overflow)
- **Option Height:** 40px
- **Hover State:** `#F3F4F6` background
- **Selected State:** `#DBEAFE` background + checkmark icon
- **Border:** Same as input
- **Shadow:** `shadow-elevation-3`
- **Z-index:** 50

### States

| State             | Border Color | Background | Notes             |
| ----------------- | ------------ | ---------- | ----------------- |
| Default           | `#D1D5DB`    | White      | -                 |
| Focus             | `#2563EB`    | White      | Ring: 2px         |
| Hover (option)    | -            | `#F3F4F6`  | -                 |
| Selected (option) | -            | `#DBEAFE`  | Checkmark visible |
| Disabled          | `#D1D5DB`    | `#F3F4F6`  | 50% opacity       |

### Component File

**Location:** `components/ui/select.tsx`

### Usage Example

```tsx
import { Select } from "@/components/ui/select";

<Select
  value={selectedOption}
  onChange={(e) => setSelectedOption(e.target.value)}
>
  <option value="">Select an option</option>
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
</Select>;
```

### With Label and Error

```tsx
<div className="space-y-2">
  <label className="text-sm font-medium">Status</label>
  <Select defaultValue="">
    <option value="">Choose status</option>
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </Select>
  <p className="text-xs text-muted">Select a status for the item</p>
</div>
```

---

## Checkbox

### Specifications

- **Size:** 18px × 18px
- **Border:** 2px solid `#D1D5DB`
- **Border Radius:** 4px
- **Background (Unchecked):** White
- **Background (Checked):** `#2563EB`
- **Checkmark Color:** White

### States

| State           | Border    | Background | Checkmark |
| --------------- | --------- | ---------- | --------- |
| Unchecked       | `#D1D5DB` | White      | -         |
| Unchecked Hover | `#9CA3AF` | White      | -         |
| Checked         | `#2563EB` | `#2563EB`  | White     |
| Checked Hover   | `#1D4ED8` | `#1D4ED8`  | White     |
| Disabled        | `#D1D5DB` | `#F3F4F6`  | Gray      |

### Component File

**Location:** `components/ui/checkbox.tsx`

### Usage Example

```tsx
import { Checkbox } from "@/components/ui/checkbox";

<Checkbox
  id="terms"
  checked={agreed}
  onCheckedChange={setAgreed}
/>
<label htmlFor="terms">I agree to the terms</label>
```

### Group Example

```tsx
<div className="space-y-3">
  <label className="text-sm font-medium">Permissions</label>
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Checkbox id="read" />
      <label htmlFor="read" className="text-sm">
        Read
      </label>
    </div>
    <div className="flex items-center gap-2">
      <Checkbox id="write" />
      <label htmlFor="write" className="text-sm">
        Write
      </label>
    </div>
  </div>
</div>
```

---

## Radio Button

### Specifications

- **Size:** 18px × 18px (Circle)
- **Border:** 2px solid `#D1D5DB`
- **Border Radius:** 50% (full circle)
- **Background (Unchecked):** White
- **Background (Checked):** `#2563EB`
- **Inner Circle (Checked):** 6px diameter, white

### States

| State           | Border    | Background | Inner Circle |
| --------------- | --------- | ---------- | ------------ |
| Unchecked       | `#D1D5DB` | White      | -            |
| Unchecked Hover | `#9CA3AF` | White      | -            |
| Checked         | `#2563EB` | `#2563EB`  | White (6px)  |
| Checked Hover   | `#1D4ED8` | `#1D4ED8`  | White (6px)  |
| Disabled        | `#D1D5DB` | `#F3F4F6`  | Gray         |

### Component File

**Location:** `components/ui/radio.tsx`

### Usage Example

```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

<RadioGroup value={selected} onValueChange={setSelected}>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="option1" id="opt1" />
    <label htmlFor="opt1">Option 1</label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="option2" id="opt2" />
    <label htmlFor="opt2">Option 2</label>
  </div>
</RadioGroup>;
```

---

## Toggle Switch

### Specifications

- **Width:** 44px
- **Height:** 24px
- **Background (Off):** `#D1D5DB`
- **Background (On):** `#2563EB`
- **Slider Size:** 20px × 20px
- **Slider Position (Off):** 2px left
- **Slider Position (On):** 22px left
- **Animation Duration:** 200ms
- **Border Radius:** 12px (pill shape)

### States

| State     | Background | Slider Position | Animation      |
| --------- | ---------- | --------------- | -------------- |
| Off       | `#D1D5DB`  | Left (2px)      | -              |
| Off Hover | `#BCC4D0`  | Left (2px)      | -              |
| On        | `#2563EB`  | Right (22px)    | 200ms ease     |
| On Hover  | `#1D4ED8`  | Right (22px)    | -              |
| Disabled  | `#E5E7EB`  | Current         | No interaction |

### Component File

**Location:** `components/ui/switch.tsx`

### Usage Example

```tsx
import { Switch } from "@/components/ui/switch";

<Switch checked={enabled} onCheckedChange={setEnabled} />;
```

### With Label

```tsx
<div className="flex items-center justify-between p-4">
  <label className="text-sm font-medium">Enable notifications</label>
  <Switch checked={notifications} onCheckedChange={setNotifications} />
</div>
```

---

## Date Picker

### Specifications

- **Input Component:** Text input (40px height)
- **Icon:** Calendar icon (right-aligned)
- **Popup Calendar:**
  - Background: White
  - Border: 1px solid `#D1D5DB`
  - Shadow: `shadow-elevation-4`
  - Border Radius: 6px
  - Z-index: 50

### Calendar Grid

- **Columns:** 7 (Sunday-Saturday)
- **Row Height:** 40px
- **Cell Size:** 40px × 40px
- **Month/Year Navigation:** Up/down arrows
- **Today Indicator:** Blue circle background
- **Selected Date:** Blue background + white text
- **Other Month Dates:** Gray text (30% opacity)

### States

| Element       | Default          | Hover        | Selected     |
| ------------- | ---------------- | ------------ | ------------ |
| Today         | `#2563EB` circle | Darker ring  | N/A          |
| Date          | Gray/black       | `#F3F4F6` bg | `#2563EB` bg |
| Navigation    | Black text       | `#2563EB`    | -            |
| Disabled Date | Gray text        | No change    | Can't select |

### Component File

**Location:** `components/ui/calendar.tsx`

### Usage Example

```tsx
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";

<Popover>
  <PopoverTrigger asChild>
    <Input
      type="text"
      readOnly
      value={date ? format(date, "MMM dd, yyyy") : ""}
      placeholder="Select a date"
      icon={<CalendarIcon className="w-4 h-4" />}
    />
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar mode="single" selected={date} onSelect={setDate} />
  </PopoverContent>
</Popover>;
```

---

## File Upload

### Specifications

- **Container:** Full-width dropzone
- **Border:** 2px dotted `#D1D5DB`
- **Border Radius:** 8px
- **Background:** `#F9FAFB`
- **Min Height:** 120px
- **Padding:** 24px

### Dropzone States

| State     | Background | Border               | Cursor      |
| --------- | ---------- | -------------------- | ----------- |
| Default   | `#F9FAFB`  | 2px dotted `#D1D5DB` | pointer     |
| Hover     | `#F3F4F6`  | 2px dotted `#2563EB` | pointer     |
| Drag Over | `#EFF6FF`  | 2px solid `#2563EB`  | copy        |
| Disabled  | `#F3F4F6`  | 2px dotted `#D1D5DB` | not-allowed |

### Dropzone Content

- **Icon:** Upload icon (48px), centered, `#9CA3AF`
- **Primary Text:** "Drag & drop here" or "Click to upload"
- **Secondary Text:** "Supported formats: PDF, DOC, JPG, PNG (Max 10MB)"
- **Text Color:** `#6B7280`
- **Font Size:** 14px

### Preview Area

- **Layout:** Grid (3-4 columns responsive)
- **Thumbnail Size:** 100px × 100px
- **Thumbnail Border:** 1px solid `#E5E7EB`
- **Thumbnail Radius:** 6px
- **Remove Button:** X icon, top-right corner, `#EF4444` on hover

### Preview Item

```
┌─────────────┐
│  Thumbnail  │
│   Preview   │
├─────────────┤
│  Filename   │
│  123 KB     │
│      ×      │ (remove)
└─────────────┘
```

### Component File

**Location:** `components/ui/file-upload.tsx` (custom component)

### Usage Example

```tsx
import { FileUpload } from "@/components/ui/file-upload";

<FileUpload
  accept=".pdf,.doc,.docx,.jpg,.png"
  maxSize={10 * 1024 * 1024} // 10MB
  maxFiles={5}
  onChange={(files) => handleFilesUpload(files)}
  onRemove={(index) => handleRemoveFile(index)}
/>;
```

### Advanced Example

```tsx
<FileUpload
  accept="image/*"
  maxSize={5 * 1024 * 1024}
  onUpload={async (files) => {
    for (const file of files) {
      await uploadToSupabase(file);
    }
  }}
/>
```

---

## Form Layout Best Practices

### Single Column Form

```tsx
<form className="space-y-4">
  <div className="space-y-2">
    <label className="text-sm font-medium">Full Name</label>
    <Input placeholder="John Doe" />
  </div>

  <div className="space-y-2">
    <label className="text-sm font-medium">Email</label>
    <Input type="email" placeholder="john@example.com" />
  </div>

  <div className="flex gap-3">
    <Button variant="primary" size="md">
      Save
    </Button>
    <Button variant="secondary" size="md">
      Cancel
    </Button>
  </div>
</form>
```

### Two Column Form

```tsx
<form className="grid grid-cols-2 gap-4">
  <div className="space-y-2">
    <label className="text-sm font-medium">First Name</label>
    <Input placeholder="John" />
  </div>

  <div className="space-y-2">
    <label className="text-sm font-medium">Last Name</label>
    <Input placeholder="Doe" />
  </div>
</form>
```

### Field Group with Help Text

```tsx
<div className="space-y-2">
  <label className="text-sm font-medium">Password</label>
  <Input type="password" placeholder="••••••••" />
  <p className="text-xs text-muted">
    Must be at least 8 characters with uppercase and numbers
  </p>
</div>
```

---

## Form Validation Pattern

### Error Display

```tsx
<div className="space-y-2">
  <label className="text-sm font-medium">Email</label>
  <Input
    type="email"
    className={errors.email ? "border-destructive" : ""}
    placeholder="email@example.com"
    {...register("email")}
  />
  {errors.email && (
    <p className="text-xs text-destructive">{errors.email.message}</p>
  )}
</div>
```

---

## Accessibility Features

- ✅ All inputs have associated `<label>` elements
- ✅ Form controls have proper `id` and `htmlFor` attributes
- ✅ Focus states clearly visible
- ✅ Error messages linked to inputs via `aria-describedby`
- ✅ Disabled state clearly indicated
- ✅ Color not the only indicator (icons/text used too)
- ✅ Keyboard navigation fully supported
- ✅ Screen reader friendly

---

## Component Files Reference

| Component       | File                            | Status            |
| --------------- | ------------------------------- | ----------------- |
| Text Input      | `components/ui/input.tsx`       | ✅ Exists         |
| Select/Dropdown | `components/ui/select.tsx`      | ✅ Exists         |
| Checkbox        | `components/ui/checkbox.tsx`    | ⏳ Update pending |
| Radio           | `components/ui/radio.tsx`       | ⏳ Update pending |
| Toggle Switch   | `components/ui/switch.tsx`      | ✅ Exists         |
| Date Picker     | `components/ui/calendar.tsx`    | ✅ Exists         |
| File Upload     | `components/ui/file-upload.tsx` | 🆕 Create new     |

---

## Implementation Locations

### Where to Use These Components

1. **Dashboard Pages:** All data input forms
2. **Create/Edit Modals:** Lead, customer, vehicle forms
3. **Settings Pages:** User preferences, business profile
4. **Data Tables:** Inline editing, filters
5. **Search/Filter:** Global search, advanced filters
6. **Admin Panel:** User management, configuration

---

## Related Documentation

- [Button Component (3.1)](./BUTTON_COMPONENT.md)
- [Design System Overview](./DESIGN_SYSTEM.md)
- [Color Specifications](./DESIGN_SYSTEM.md#section-1)
- [Typography System](./DESIGN_SYSTEM.md#section-1-2)

---

## Version History

| Version | Date         | Changes                                 |
| ------- | ------------ | --------------------------------------- |
| 1.0     | Jan 23, 2026 | Initial form inputs design system (3.2) |

---

## Next Steps

1. ✅ Review this documentation
2. ⏳ Update `input.tsx` with exact 3.2 specifications
3. ⏳ Update `select.tsx` with dropdown panel and chevron
4. ⏳ Create `file-upload.tsx` component
5. ⏳ Update existing form pages to use new styles
6. ⏳ Test across all form pages
7. ⏳ Update validation error styling
