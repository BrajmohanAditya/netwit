# Component Placement & Integration Guide

## 📍 Where to Place Components

### Form Input Components Location

**Directory:** `components/ui/`

```
components/
├── ui/
│   ├── input.tsx              ← Text Input (3.2)
│   ├── select.tsx             ← Dropdown/Select (3.2)
│   ├── checkbox.tsx           ← Checkbox (3.2)
│   ├── radio.tsx              ← Radio Button (3.2)
│   ├── switch.tsx             ← Toggle Switch (3.2)
│   ├── calendar.tsx           ← Date Picker (3.2)
│   ├── file-upload.tsx        ← File Upload (3.2) - NEW
│   └── [other UI components]
```

---

## 3.2 Form Inputs: Where Each Component Is Used

### Text Input Component

**File:** `components/ui/input.tsx`

**Used in Pages:**

1. `app/(dashboard)/leads/page.tsx` - Lead search
2. `app/(dashboard)/customers/page.tsx` - Customer search
3. `app/(dashboard)/invoices/new/page.tsx` - Invoice form fields
4. `app/(dashboard)/settings/page.tsx` - Profile forms
5. All form dialogs for create/edit operations

**Common Usage Pattern:**

```tsx
// app/(dashboard)/leads/page.tsx
import { Input } from "@/components/ui/input";

<div className="space-y-2">
  <label className="text-sm font-medium">Lead Name</label>
  <Input
    placeholder="Enter lead name"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>;
```

---

### Dropdown/Select Component

**File:** `components/ui/select.tsx`

**Used in Pages:**

1. `app/(dashboard)/invoices/new/page.tsx` - Tax mode, customer selection
2. `app/(dashboard)/customers/page.tsx` - Status filters
3. `app/(dashboard)/leads/page.tsx` - Lead status filter
4. All filter bars and form dropdowns

**Common Usage Pattern:**

```tsx
// app/(dashboard)/invoices/new/page.tsx
import { Select } from "@/components/ui/select";

<div className="space-y-2">
  <label className="text-sm font-medium">Tax Mode</label>
  <Select value={taxMode} onChange={handleTaxChange}>
    <option value="">Select tax mode</option>
    <option value="gst+pst">GST + PST (5% + 7%)</option>
    <option value="hst">HST (13%)</option>
  </Select>
</div>;
```

---

### Checkbox Component

**File:** `components/ui/checkbox.tsx`

**Used in Pages:**

1. `app/(dashboard)/customers/page.tsx` - Customer selection (multi-select)
2. `app/(dashboard)/leads/page.tsx` - Bulk lead selection
3. Permission management pages
4. Settings pages for feature toggles

**Common Usage Pattern:**

```tsx
// Permission selection component
import { Checkbox } from "@/components/ui/checkbox";

<div className="space-y-2">
  <label className="text-sm font-medium">Permissions</label>
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Checkbox id="read" checked={permissions.read} onChange={...} />
      <label htmlFor="read" className="text-sm">Read</label>
    </div>
    <div className="flex items-center gap-2">
      <Checkbox id="write" checked={permissions.write} onChange={...} />
      <label htmlFor="write" className="text-sm">Write</label>
    </div>
  </div>
</div>
```

---

### Radio Button Component

**File:** `components/ui/radio.tsx`

**Used in Pages:**

1. `app/(dashboard)/settings/page.tsx` - Tax mode selection (single choice)
2. `app/(dashboard)/invoices/new/page.tsx` - Payment method selection
3. User preference selections
4. Single-choice filter groups

**Common Usage Pattern:**

```tsx
// Payment method selection
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

<RadioGroup value={method} onValueChange={setMethod}>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="cash" id="cash" />
    <label htmlFor="cash" className="text-sm">
      Cash
    </label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="card" id="card" />
    <label htmlFor="card" className="text-sm">
      Credit Card
    </label>
  </div>
</RadioGroup>;
```

---

### Toggle Switch Component

**File:** `components/ui/switch.tsx`

**Used in Pages:**

1. `app/(dashboard)/settings/page.tsx` - Feature toggles
2. User notification preferences
3. Business profile settings
4. Feature enable/disable switches

**Common Usage Pattern:**

```tsx
// Feature toggle
import { Switch } from "@/components/ui/switch";

<div className="flex items-center justify-between p-4 border-b">
  <div>
    <label className="text-sm font-medium">Enable Notifications</label>
    <p className="text-xs text-muted">Receive email notifications</p>
  </div>
  <Switch checked={enabled} onCheckedChange={setEnabled} />
</div>;
```

---

### Date Picker Component

**File:** `components/ui/calendar.tsx`

**Used in Pages:**

1. `app/(dashboard)/invoices/new/page.tsx` - Invoice date, due date
2. `app/(dashboard)/leads/page.tsx` - Date filters
3. `app/(dashboard)/test-drives/page.tsx` - Schedule date picker
4. Any date selection requirement

**Common Usage Pattern:**

```tsx
// Date selection with calendar
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

<Popover>
  <PopoverTrigger asChild>
    <Input
      type="text"
      readOnly
      placeholder="Select date"
      value={date ? format(date, "MMM dd, yyyy") : ""}
    />
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar mode="single" selected={date} onSelect={setDate} />
  </PopoverContent>
</Popover>;
```

---

### File Upload Component

**File:** `components/ui/file-upload.tsx` (TO CREATE)

**Used in Pages:**

1. `app/(dashboard)/customers/page.tsx` - Customer documents
2. `app/(dashboard)/leads/page.tsx` - Lead attachments
3. `app/(dashboard)/invoices/new/page.tsx` - Invoice attachments
4. User profile settings - Avatar upload
5. Any document upload requirement

**Common Usage Pattern:**

```tsx
// Document upload with preview
import { FileUpload } from "@/components/ui/file-upload";

<FileUpload
  accept=".pdf,.doc,.docx,.jpg,.png"
  maxSize={10 * 1024 * 1024} // 10MB
  maxFiles={5}
  onChange={(files) => {
    files.forEach((file) => uploadFile(file));
  }}
/>;
```

---

## 📋 Form Component Integration Examples

### Complete Lead Creation Form

```tsx
// app/(dashboard)/leads/new.tsx
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

export function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "",
    followUp: false,
    source: "website",
  });

  return (
    <form className="space-y-4">
      {/* Text Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Lead Name</label>
        <Input
          placeholder="Enter lead name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      {/* Text Input - Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          placeholder="email@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      {/* Dropdown */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="">Select status</option>
          <option value="new">New Lead</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
        </Select>
      </div>

      {/* Radio Button Group */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Lead Source</label>
        <RadioGroup
          value={formData.source}
          onValueChange={(val) => setFormData({ ...formData, source: val })}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="website" id="web" />
            <label htmlFor="web" className="text-sm">
              Website
            </label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="referral" id="ref" />
            <label htmlFor="ref" className="text-sm">
              Referral
            </label>
          </div>
        </RadioGroup>
      </div>

      {/* Checkbox */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="followup"
          checked={formData.followUp}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, followUp: checked })
          }
        />
        <label htmlFor="followup" className="text-sm">
          Schedule follow-up
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button variant="primary" size="md" type="submit">
          Create Lead
        </Button>
        <Button variant="secondary" size="md" type="button">
          Cancel
        </Button>
      </div>
    </form>
  );
}
```

---

## 🔄 Form Component in Context

### Using Form with React Hook Form

```tsx
// Invoice form with all 3.2 components
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";

export function InvoiceForm() {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Customer Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Customer</label>
        <Controller
          control={control}
          name="customer"
          render={({ field }) => (
            <Select {...field}>
              <option value="">Select customer</option>
              <option value="cust1">Customer 1</option>
            </Select>
          )}
        />
      </div>

      {/* Invoice Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Invoice Date</label>
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Input type="text" placeholder="Select date" readOnly />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar onSelect={field.onChange} />
              </PopoverContent>
            </Popover>
          )}
        />
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Attachments</label>
        <Controller
          control={control}
          name="attachments"
          render={({ field }) => (
            <FileUpload onChange={(files) => field.onChange(files)} />
          )}
        />
      </div>

      {/* Submit */}
      <Button variant="primary" size="md" type="submit">
        Create Invoice
      </Button>
    </form>
  );
}
```

---

## ✅ Component Checklist for Each Page

### Dashboard Page

- [ ] Text Input - search
- [ ] Select - filters
- [ ] Date Picker - date filters

### Leads Page

- [ ] Text Input - search
- [ ] Select - status filter
- [ ] Date Picker - date range
- [ ] Checkbox - bulk select
- [ ] File Upload - attachments

### Invoices Page

- [ ] Text Input - search
- [ ] Select - customer, tax mode
- [ ] Date Picker - invoice date
- [ ] Radio - payment method
- [ ] File Upload - documents
- [ ] Toggle Switch - auto-bill

### Customers Page

- [ ] Text Input - search, form fields
- [ ] Select - customer type
- [ ] Checkbox - bulk actions
- [ ] Date Picker - birth date
- [ ] File Upload - company logo

### Settings Page

- [ ] Text Input - profile info
- [ ] Select - preferences
- [ ] Radio - tax mode choice
- [ ] Toggle Switch - notifications
- [ ] File Upload - documents

---

## 🎯 Next Steps for Implementation

1. **Review Documentation**
   - Read `FORM_INPUTS.md` for all 3.2 specs
   - Check exact colors, heights, padding

2. **Update Components**
   - Update `input.tsx` with exact specifications
   - Update `select.tsx` with dropdown panel
   - Create `file-upload.tsx` component
   - Verify checkbox, radio, switch, calendar

3. **Test in Forms**
   - Test in invoice form
   - Test in customer form
   - Test validation error states

4. **Apply Across Dashboard**
   - Update all existing form pages
   - Apply consistent styling
   - Test accessibility

---

## 📚 Related Files

- [FORM_INPUTS.md](./FORM_INPUTS.md) - Complete 3.2 specifications
- [BUTTON_COMPONENT.md](./BUTTON_COMPONENT.md) - 3.1 Button specs
- [DESIGN_SYSTEM_STRUCTURE.md](./DESIGN_SYSTEM_STRUCTURE.md) - Component structure

---

**Last Updated:** January 23, 2026
**Status:** Implementation Guide Ready
