# Table 3.4 - Quick Reference Guide

## File Locations

| Component      | Path                                | Usage                                            |
| -------------- | ----------------------------------- | ------------------------------------------------ |
| Base Table     | `/components/ui/table.tsx`          | Base HTML table elements                         |
| Data Table     | `/components/ui/data-table.tsx`     | Simple data table with search                    |
| Advanced Table | `/components/ui/advanced-table.tsx` | **NEW** - Full-featured table with all 3.4 specs |
| Checkbox       | `/components/ui/checkbox.tsx`       | Row selection control                            |

## When to Use Which Table

### DataTable (Simple cases)

```tsx
import { DataTable } from "@/components/ui/data-table";
// Use for: Basic list display, simple search
```

### AdvancedTable (Recommended for 3.4)

```tsx
import { AdvancedTable } from "@/components/ui/advanced-table";
// Use for: Complex data, sorting, pagination, filtering
```

## Implementation Checklist

- [x] Header styling: #F9FAFB background, 48px height, 12px uppercase semibold
- [x] Sticky header on scroll
- [x] Row height: 56px (comfortable) / 48px (compact mode)
- [x] Row borders: 1px solid #F3F4F6
- [x] Hover state: Background #F9FAFB
- [x] Selected state: Background #DBEAFE + blue left border
- [x] Sortable columns (click header)
- [x] Filterable (global search)
- [x] Column visibility toggle
- [x] Row selection with checkboxes
- [x] Pagination with page size selector
- [x] Display format: "Showing X–Y of Z"
- [x] Navigation: First, Previous, Next, Last buttons
- [x] Page indicators: 1 2 3 … 20

## Feature Flags

### Enable Row Selection

```tsx
<AdvancedTable
  enableRowSelection={true}
  onRowSelectionChange={(selected) => console.log(selected)}
/>
```

### Compact Mode (48px rows)

```tsx
<AdvancedTable compact={true} pageSize={20} />
```

### Custom Page Size

```tsx
<AdvancedTable
  pageSize={25} // Default is 10
/>
```

### Custom Empty State

```tsx
<AdvancedTable emptyState={<div>No data found</div>} />
```

## Code Examples

### Users Table with Selection

```tsx
import { AdvancedTable } from "@/components/ui/advanced-table";
import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 200,
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 250,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button onClick={() => editUser(row.original)}>Edit</Button>
    ),
  },
];

export function UsersTableView({ data }) {
  const [selected, setSelected] = useState([]);

  return (
    <AdvancedTable
      columns={columns}
      data={data}
      searchKey="name"
      enableRowSelection={true}
      onRowSelectionChange={setSelected}
      pageSize={15}
    />
  );
}
```

### Products Table (Compact)

```tsx
const columns = [
  { accessorKey: "name", header: "Product", size: 250 },
  { accessorKey: "sku", header: "SKU", size: 120 },
  { accessorKey: "price", header: "Price", size: 100 },
  { accessorKey: "stock", header: "Stock", size: 100 },
];

<AdvancedTable
  columns={columns}
  data={products}
  searchKey="name"
  compact={true}
  pageSize={30}
/>;
```

## Color Reference

| Element             | Color    | Hex     |
| ------------------- | -------- | ------- |
| Header Background   | Gray-50  | #F9FAFB |
| Header Text         | Gray-700 | #374151 |
| Row Border          | Gray-200 | #E5E7EB |
| Row Hover           | Gray-50  | #F9FAFB |
| Selected Background | Blue-50  | #EFF6FF |
| Selected Border     | Blue-500 | #3B82F6 |

## Tailwind Classes Used

```css
/* Header */
bg-gray-50
text-xs font-semibold uppercase
border-b border-gray-200
sticky top-0 z-10

/* Rows */
h-14                          /* comfortable (56px) */
h-12                          /* compact (48px) */
border-b border-gray-200
hover:bg-gray-50
transition-all duration-200

/* Selected Row */
bg-blue-50
border-l-4 border-l-blue-500

/* Pagination */
text-sm text-gray-600
flex items-center gap-2
```

## API Quick Reference

```tsx
// State management
const [sorting, setSorting] = useState<SortingState>([]);
const [filters, setFilters] = useState<ColumnFiltersState>([]);
const [search, setSearch] = useState("");

// Table instance
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
});

// Common operations
table.setPageIndex(0);
table.setPageSize(20);
table.toggleAllRowsSelected();
table.getState().pagination;
```

## Styling Customization

### Override Header Style

```tsx
<th className="bg-blue-100 text-blue-900">Custom Header</th>
```

### Override Row Style

```tsx
<tr className="data-[state=selected]:bg-purple-50">{/* content */}</tr>
```

### Override Pagination

```tsx
<Select>
  <SelectTrigger className="custom-class">
    <SelectValue />
  </SelectTrigger>
</Select>
```

## Performance Tips

1. **Pagination**: Use `pageSize` prop to limit DOM nodes
2. **Memoization**: Wrap column definitions in `useMemo`
3. **Large Datasets**: Keep data < 10k rows per page
4. **Callbacks**: Use `useCallback` for event handlers

## Browser Support

✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+

## Future Enhancements

- [ ] Column resizing drag handles
- [ ] Drag-to-reorder columns
- [ ] Export to CSV/Excel
- [ ] Advanced filter builder
- [ ] Column grouping
- [ ] Expandable rows
- [ ] Server-side pagination

## Related Documentation

- [Complete Advanced Table Doc](./ADVANCED_TABLE_3_4.md)
- [Design System Index](./DESIGN_SYSTEM_INDEX.md)
- [Component Placement Guide](./COMPONENT_PLACEMENT_GUIDE.md)

---

**Last Updated**: January 23, 2026  
**Status**: ✅ Production Ready
