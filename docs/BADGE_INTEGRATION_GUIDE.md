# Badge Integration Guide - Recommended Usage Across ADAPTUS DMS

## Overview

This guide shows recommended locations for implementing badges across the ADAPTUS DMS application, including specific use cases and implementation patterns.

---

## Dashboard Page

### Location

**File**: `app/(dashboard)/page.tsx`

### Recommended Badges

#### 1. KPI Status Badges

**Trigger**: KPI cards  
**Purpose**: Show metric status (improving, stable, declining)  
**Example**:

```tsx
<Card>
  <div className="flex justify-between items-start">
    <div>
      <p className="text-gray-600">Revenue</p>
      <h3 className="text-2xl font-bold">$45,230</h3>
    </div>
    <Badge variant="green" radius="pill">
      ↑ 12%
    </Badge>
  </div>
</Card>
```

#### 2. System Status Badge

**Location**: Top-right corner  
**Purpose**: Quick system health check

```tsx
<Badge variant={systemHealthy ? "green" : "red"}>
  {systemHealthy ? "All Systems Up" : "Issues Detected"}
</Badge>
```

---

## Customers Page

### Location

**File**: `app/(dashboard)/customers/page.tsx`

### Recommended Badges

#### 1. Verification Status

**Column**: Status  
**Purpose**: Show customer verification status

```tsx
<Badge variant={customer.verified ? "green" : "gray"}>
  {customer.verified ? "Verified" : "Unverified"}
</Badge>
```

#### 2. Customer Type Badge

**Column**: Type  
**Purpose**: Distinguish customer categories

```tsx
const typeVariant = {
  individual: "gray",
  business: "blue",
  enterprise: "green",
}[customer.type];

<Badge variant={typeVariant}>{customer.type}</Badge>;
```

#### 3. Risk Level Badge

**Column**: Risk  
**Purpose**: Show credit/trust level

```tsx
const riskVariant = {
  low: "green",
  medium: "yellow",
  high: "red",
}[customer.riskLevel];

<Badge variant={riskVariant}>{customer.riskLevel}</Badge>;
```

#### 4. Activity Status

**Column**: Status  
**Purpose**: Show customer activity level

```tsx
<Badge variant={customer.isActive ? "blue" : "gray"}>
  {customer.isActive ? "Active" : "Inactive"}
</Badge>
```

---

## Invoices Page

### Location

**File**: `app/(dashboard)/invoices/page.tsx`

### Recommended Badges

#### 1. Invoice Status

**Column**: Status  
**Purpose**: Show invoice lifecycle

```tsx
const statusVariant = {
  draft: "gray",
  sent: "blue",
  viewed: "yellow",
  paid: "green",
  overdue: "red",
  cancelled: "gray",
}[invoice.status];

<Badge variant={statusVariant}>{invoice.status}</Badge>;
```

#### 2. Payment Status

**Column**: Payment  
**Purpose**: Indicate payment completion

```tsx
<Badge variant={invoice.paid ? "green" : "red"}>
  {invoice.paid ? "Paid" : "Unpaid"}
</Badge>
```

#### 3. Overdue Badge

**Column**: Overdue  
**Purpose**: Highlight overdue invoices

```tsx
{
  invoice.isOverdue && (
    <Badge variant="red" radius="pill">
      Overdue
    </Badge>
  );
}
```

#### 4. Type Badge

**Column**: Type  
**Purpose**: Show invoice category

```tsx
<Badge variant="blue" radius="pill">
  {invoice.type}
</Badge>
```

---

## Users Page

### Location

**File**: `app/(dashboard)/users/page.tsx`

### Recommended Badges

#### 1. User Role

**Column**: Role  
**Purpose**: Display user permission level

```tsx
const roleVariant = {
  admin: "red",
  manager: "blue",
  user: "gray",
  viewer: "gray",
}[user.role];

<Badge variant={roleVariant} radius="pill">
  {user.role}
</Badge>;
```

#### 2. Verification Status

**Column**: Verified  
**Purpose**: Show email/identity verification

```tsx
<Badge variant={user.emailVerified ? "green" : "yellow"}>
  {user.emailVerified ? "Verified" : "Pending"}
</Badge>
```

#### 3. Account Status

**Column**: Status  
**Purpose**: Active, suspended, inactive

```tsx
const statusVariant = {
  active: "green",
  suspended: "red",
  inactive: "gray",
}[user.status];

<Badge variant={statusVariant}>{user.status}</Badge>;
```

#### 4. Online Status

**Column**: Online  
**Purpose**: Real-time user availability

```tsx
<Badge variant={user.isOnline ? "green" : "gray"}>
  {user.isOnline ? "Online" : "Offline"}
</Badge>
```

---

## Inventory Page

### Location

**File**: `app/(dashboard)/inventory/page.tsx`

### Recommended Badges

#### 1. Condition Badge

**Column**: Condition  
**Purpose**: Vehicle condition status

```tsx
const conditionVariant = {
  excellent: "green",
  good: "blue",
  fair: "yellow",
  poor: "red",
}[vehicle.condition];

<Badge variant={conditionVariant}>{vehicle.condition}</Badge>;
```

#### 2. Availability Badge

**Column**: Available  
**Purpose**: In stock or reserved

```tsx
<Badge variant={vehicle.available ? "green" : "gray"}>
  {vehicle.available ? "Available" : "Reserved"}
</Badge>
```

#### 3. Feature Tags

**Column**: Features  
**Purpose**: Quick feature overview

```tsx
<div className="flex gap-1">
  {vehicle.features.map((feature) => (
    <Badge key={feature} variant="blue" radius="pill" className="text-xs">
      {feature}
    </Badge>
  ))}
</div>
```

#### 4. Inspection Status

**Column**: Inspection  
**Purpose**: Inspection required/completed

```tsx
<Badge variant={vehicle.inspected ? "green" : "yellow"}>
  {vehicle.inspected ? "Inspected" : "Pending"}
</Badge>
```

---

## Settings Page

### Location

**File**: `app/(dashboard)/settings/page.tsx`

### Recommended Badges

#### 1. Feature Flag Status

**Column**: Status  
**Purpose**: Feature enabled/disabled

```tsx
<Badge variant={featureEnabled ? "green" : "gray"}>
  {featureEnabled ? "Enabled" : "Disabled"}
</Badge>
```

#### 2. API Status

**Column**: Status  
**Purpose**: API connection status

```tsx
<Badge variant={apiConnected ? "green" : "red"}>
  {apiConnected ? "Connected" : "Disconnected"}
</Badge>
```

#### 3. Configuration Status

**Column**: Status  
**Purpose**: Configuration complete/pending

```tsx
<Badge variant={isConfigured ? "green" : "yellow"}>
  {isConfigured ? "Configured" : "Setup Required"}
</Badge>
```

---

## System Health Page

### Location

**File**: `app/(dashboard)/system-health/page.tsx`

### Recommended Badges

#### 1. Service Status

**Column**: Status  
**Purpose**: Service running/down

```tsx
<Badge variant={service.running ? "green" : "red"}>
  {service.running ? "Running" : "Down"}
</Badge>
```

#### 2. Error Severity

**Column**: Severity  
**Purpose**: Indicate error severity

```tsx
const severityVariant = {
  low: "yellow",
  medium: "yellow",
  high: "red",
  critical: "red",
}[error.severity];

<Badge variant={severityVariant}>{error.severity}</Badge>;
```

#### 3. Performance Metric

**Column**: Performance  
**Purpose**: Performance status

```tsx
const performanceVariant = {
  optimal: "green",
  good: "blue",
  fair: "yellow",
  poor: "red",
}[metric.status];

<Badge variant={performanceVariant}>{metric.status}</Badge>;
```

---

## CRM Page

### Location

**File**: `app/(dashboard)/crm/page.tsx`

### Recommended Badges

#### 1. Lead Status

**Column**: Status  
**Purpose**: Lead lifecycle stage

```tsx
const statusVariant = {
  prospect: "gray",
  qualified: "blue",
  proposal: "yellow",
  negotiation: "yellow",
  won: "green",
  lost: "red",
}[lead.status];

<Badge variant={statusVariant}>{lead.status}</Badge>;
```

#### 2. Priority Badge

**Column**: Priority  
**Purpose**: Lead importance

```tsx
const priorityVariant = {
  low: "gray",
  medium: "blue",
  high: "yellow",
  critical: "red",
}[lead.priority];

<Badge variant={priorityVariant}>{lead.priority}</Badge>;
```

#### 3. Source Badge

**Column**: Source  
**Purpose**: Lead acquisition source

```tsx
<Badge variant="blue" radius="pill">
  {lead.source}
</Badge>
```

---

## Financials Page

### Location

**File**: `app/(dashboard)/financials/page.tsx`

### Recommended Badges

#### 1. Transaction Type

**Column**: Type  
**Purpose**: Income/Expense/Transfer

```tsx
const typeVariant = {
  income: "green",
  expense: "red",
  transfer: "blue",
}[transaction.type];

<Badge variant={typeVariant}>{transaction.type}</Badge>;
```

#### 2. Reconciliation Status

**Column**: Status  
**Purpose**: Reconciled/Pending

```tsx
<Badge variant={transaction.reconciled ? "green" : "yellow"}>
  {transaction.reconciled ? "Reconciled" : "Pending"}
</Badge>
```

---

## Implementation Checklist

Use this to track badge implementation:

### Customers Page

- [ ] Verification status
- [ ] Customer type
- [ ] Risk level
- [ ] Activity status

### Invoices Page

- [ ] Invoice status
- [ ] Payment status
- [ ] Overdue indicator
- [ ] Invoice type

### Users Page

- [ ] User role
- [ ] Verification status
- [ ] Account status
- [ ] Online status

### Inventory Page

- [ ] Condition badge
- [ ] Availability badge
- [ ] Feature tags
- [ ] Inspection status

### Settings Page

- [ ] Feature flags
- [ ] API status
- [ ] Configuration status

### System Health Page

- [ ] Service status
- [ ] Error severity
- [ ] Performance metric

### CRM Page

- [ ] Lead status
- [ ] Priority badge
- [ ] Source badge

### Financials Page

- [ ] Transaction type
- [ ] Reconciliation status

### Dashboard

- [ ] KPI status
- [ ] System status

---

## Best Practices

### Color Selection

✅ Use colors meaningfully (not randomly)
✅ Map colors consistently (green = good, red = bad)
✅ Never rely on color alone
✅ Provide text alternative

### Usage Patterns

✅ Use in tables for status columns
✅ Use in cards for quick indicators
✅ Use pill radius for tags
✅ Group similar badges together
✅ Keep text short and clear

### Accessibility

✅ Sufficient contrast ratio
✅ Readable font size (12px minimum)
✅ Never color-only information
✅ Semantic meaning clear

---

## Implementation Timeline

### Week 1: Core Pages

- Dashboard status badges
- Customers page badges
- Invoices page badges

### Week 2: User & Inventory

- Users page badges
- Inventory page badges
- Complete basic badges

### Week 3: Advanced Features

- Settings page badges
- System Health badges
- CRM page badges

### Week 4: Refinement

- Audit all badges
- Fine-tune colors
- Team review
- Production deployment

---

## Summary

**Total Recommended Badge Locations**: 20+

**Status**: Ready for implementation

**Component**: `/components/ui/badge.tsx`

**Documentation**:

- [BADGE_3_6.md](./BADGE_3_6.md)
- [BADGE_3_6_QUICK_REFERENCE.md](./BADGE_3_6_QUICK_REFERENCE.md)
- [SECTION_3_6_COMPLETE.md](./SECTION_3_6_COMPLETE.md)

---

**Version**: 1.0  
**Status**: ✅ Ready for Implementation  
**Last Updated**: January 23, 2026
