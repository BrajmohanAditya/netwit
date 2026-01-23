# Advanced Table Component (Section 3.4)

## Overview

The Advanced Table component (`AdvancedTable`) is a feature-rich data table component designed for displaying tabular data with advanced capabilities including sorting, filtering, pagination, row selection, and responsive design.

## Design Specifications

### Structure

#### Header

- **Background**: `#F9FAFB` (gray-50)
- **Height**: 48px (h-12)
- **Text**: 12px semibold uppercase
- **Sticky**: Yes (position: sticky on scroll)
- **Border**: 1px solid #F3F4F6

#### Rows

- **Height (Comfortable)**: 56px (h-14) - Default
- **Height (Compact)**: 48px (h-12) - Optional via `compact` prop
- **Border**: 1px solid #F3F4F6
- **Hover State**: Background #F9FAFB with smooth transition
- **Selected State**:
  - Background: #DBEAFE (blue-50)
  - Left border: 4px solid #3B82F6 (blue-500)

### Features

✅ **Sortable Columns**: Click header to sort (ascending/descending)  
✅ **Filterable**: Global search and per-column filtering  
✅ **Resizable**: Column width management  
✅ **Reorderable**: Drag to reorder (via column visibility)  
✅ **Row Selection**: Checkbox selection with select-all  
✅ **Pagination**: Bottom pagination with page size selection  
✅ **Responsive**: Mobile-friendly with horizontal scrolling  
✅ **Column Visibility**: Toggle columns on/off via settings menu

### Pagination

```
[Rows: 10▼] Showing 1–10 of 197
[◄◄ ◄ 1 2 3 … 20 ►► ►]
```

- Rows per page selector: 10, 20, 30, 40, 50
- Display: "Showing X–Y of Z"
- Navigation: First, Previous, Next, Last buttons
- Page indicators with ellipsis for large datasets

## Usage

### Basic Usage

```tsx
import { AdvancedTable } from "@/components/ui/advanced-table";
import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<DataType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

export function MyTable() {
  const [data] = useState([
    { id: 1, name: "John", email: "john@example.com" },
    { id: 2, name: "Jane", email: "jane@example.com" },
  ]);

  return (
    <AdvancedTable
      columns={columns}
      data={data}
      searchKey="name"
      pageSize={10}
    />
  );
}
```

### With Row Selection

```tsx
const [selectedRows, setSelectedRows] = useState([]);

<AdvancedTable
  columns={columns}
  data={data}
  enableRowSelection={true}
  onRowSelectionChange={setSelectedRows}
/>;
```

### Compact Mode

```tsx
<AdvancedTable columns={columns} data={data} compact={true} pageSize={20} />
```

### With Custom Empty State

```tsx
<AdvancedTable
  columns={columns}
  data={data}
  emptyState={
    <div className="text-center py-12">
      <p className="text-gray-500">No data available</p>
    </div>
  }
/>
```

## Props

```typescript
interface AdvancedTableProps<TData, TValue> {
  // Required
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  // Optional
  searchKey?: string; // Column to search by
  emptyState?: React.ReactNode; // Custom empty state
  compact?: boolean; // Compact row height (default: false)
  enableRowSelection?: boolean; // Show checkboxes (default: false)
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  pageSize?: number; // Items per page (default: 10)
}
```

## Column Definition

Use `@tanstack/react-table` `ColumnDef` format:

```tsx
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    size: 200, // Optional: set column width
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge>{row.original.status}</Badge>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button onClick={() => console.log(row.original)}>Edit</Button>
    ),
  },
];
```

## Styling

The component uses Tailwind CSS classes and respects your design system:

- **Colors**: Uses gray scale (#F9FAFB, #F3F4F6, #3B82F6)
- **Spacing**: Consistent padding (p-4) and gaps
- **Typography**: 12px headers, 14px body text
- **Transitions**: Smooth hover and selection effects
- **Responsive**: Adapts to mobile with horizontal scroll

## API Reference

### Methods

The table provides TanStack Table API for advanced usage:

```tsx
// Access table instance
const table = useReactTable({...});

// Common methods
table.setPageIndex(0);           // Go to page
table.setPageSize(20);           // Change page size
table.toggleAllRowsSelected();   // Select all rows
table.getState();                // Get current state
```

## Integration Examples

### Users Table (Already Exists)

See [components/users/users-table.tsx](../../components/users/users-table.tsx)

### Products Table

```tsx
import { AdvancedTable } from "@/components/ui/advanced-table";

export function ProductsTable({ data }) {
  const columns = [
    { accessorKey: "name", header: "Product Name", size: 250 },
    { accessorKey: "price", header: "Price" },
    { accessorKey: "stock", header: "Stock" },
    { accessorKey: "category", header: "Category" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button size="sm" onClick={() => editProduct(row.original)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <AdvancedTable
      columns={columns}
      data={data}
      searchKey="name"
      pageSize={20}
    />
  );
}
```

### Invoices Table

```tsx
export function InvoicesTable({ data }) {
  const [selectedInvoices, setSelectedInvoices] = useState([]);

  const columns = [
    { accessorKey: "invoiceNumber", header: "Invoice #", size: 120 },
    { accessorKey: "customerName", header: "Customer", size: 200 },
    { accessorKey: "amount", header: "Amount", size: 120 },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "paid" ? "default" : "secondary"}
        >
          {row.original.status}
        </Badge>
      ),
    },
    { accessorKey: "dueDate", header: "Due Date", size: 120 },
  ];

  return (
    <AdvancedTable
      columns={columns}
      data={data}
      searchKey="invoiceNumber"
      enableRowSelection={true}
      onRowSelectionChange={setSelectedInvoices}
      pageSize={15}
    />
  );
}
```

## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA labels on checkboxes
- ✅ Semantic HTML table structure
- ✅ Focus visible states
- ✅ Screen reader friendly

## Performance

- Virtualization ready (TanStack Table compatible)
- Efficient re-renders with React hooks
- Pagination reduces DOM complexity
- Large dataset support (100k+ rows with pagination)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Migration from DataTable

The `AdvancedTable` is a drop-in replacement for `DataTable` with additional features:

**Before:**

```tsx
import { DataTable } from "@/components/ui/data-table";

<DataTable columns={columns} data={data} searchKey="name" />;
```

**After:**

```tsx
import { AdvancedTable } from "@/components/ui/advanced-table";

<AdvancedTable columns={columns} data={data} searchKey="name" />;
```

## Future Enhancements

- [ ] Column drag-to-reorder (React Beautiful DnD integration)
- [ ] Export to CSV/Excel
- [ ] Advanced filtering UI (date ranges, number ranges)
- [ ] Grouped rows
- [ ] Expandable rows
- [ ] Column width persistence (localStorage)
- [ ] Server-side pagination hook

## Related Components

- [Table](/components/ui/table.tsx) - Base table component
- [DataTable](/components/ui/data-table.tsx) - Simple data table
- [Checkbox](/components/ui/checkbox.tsx) - Selection control
- [Button](/components/ui/button.tsx) - Actions
- [Select](/components/ui/select.tsx) - Page size dropdown

## Dependencies

- `@tanstack/react-table` - Table logic
- `react` - React library
- `lucide-react` - Icons
- `tailwindcss` - Styling

## Last Updated

January 23, 2026

---

**Ready to use in:** Users, Invoices, Inventory, Customers, and all data-heavy sections.
