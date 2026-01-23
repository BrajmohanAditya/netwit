# Modal Integration Guide - Recommended Usage Across ADAPTUS DMS

## Overview

This guide shows recommended locations for implementing modals across the ADAPTUS DMS application, including specific use cases and implementation patterns.

---

## Dashboard Page

### Location

**File**: `app/(dashboard)/page.tsx`  
**Component**: Dashboard overview page

### Recommended Modals

#### 1. Quick Action Modal

**Trigger**: "New Item" button in KPI section  
**Purpose**: Quick entry for common actions (new invoice, new customer, new vehicle)  
**Size**: Default (600px)

```tsx
const {
  isOpen: quickActionOpen,
  open: openQuickAction,
  close: closeQuickAction,
} = useModal();

<Modal isOpen={quickActionOpen} onClose={closeQuickAction}>
  <ModalHeader title="Quick Action" onClose={closeQuickAction} />
  <ModalBody>
    <div className="space-y-2">
      <Button className="w-full">New Invoice</Button>
      <Button className="w-full">New Customer</Button>
      <Button className="w-full">New Vehicle</Button>
    </div>
  </ModalBody>
</Modal>;
```

---

## Customers Page

### Location

**File**: `app/(dashboard)/customers/page.tsx`

### Recommended Modals

#### 1. Create Customer Modal

**Trigger**: "Add Customer" button  
**Purpose**: Form for creating new customer  
**Size**: Large (900px)  
**Fields**: Name, Email, Phone, Address, Tax ID, Tags

```tsx
const { isOpen: createOpen, open: openCreate, close: closeCreate } = useModal();

<Modal isOpen={createOpen} onClose={closeCreate}>
  <ModalHeader title="Create New Customer" onClose={closeCreate} />
  <ModalBody>
    <form onSubmit={handleCreateSubmit} className="space-y-4">
      {/* Customer form fields */}
    </form>
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={closeCreate}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleCreateSubmit}>
      Create
    </Button>
  </ModalFooter>
</Modal>;
```

#### 2. Edit Customer Modal

**Trigger**: "Edit" button in customer row  
**Purpose**: Form for editing customer details  
**Size**: Large (900px)  
**Pre-fill**: Current customer data

```tsx
const { isOpen: editOpen, open: openEdit, close: closeEdit } = useModal();
const [selectedCustomer, setSelectedCustomer] = useState(null);

const handleEditClick = (customer) => {
  setSelectedCustomer(customer);
  openEdit();
};

<Modal isOpen={editOpen} onClose={closeEdit}>
  <ModalHeader
    title={`Edit Customer: ${selectedCustomer?.name}`}
    onClose={closeEdit}
  />
  <ModalBody>
    <form onSubmit={handleEditSubmit} className="space-y-4">
      {/* Pre-filled form fields */}
    </form>
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={closeEdit}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleEditSubmit}>
      Save Changes
    </Button>
  </ModalFooter>
</Modal>;
```

#### 3. Delete Customer Modal

**Trigger**: "Delete" button in customer row  
**Purpose**: Confirmation for customer deletion  
**Size**: Default (600px)  
**Warning**: Show associated invoices count

```tsx
const { isOpen: deleteOpen, open: openDelete, close: closeDelete } = useModal();
const [deleteCustomerId, setDeleteCustomerId] = useState(null);

const handleDeleteClick = (customerId) => {
  setDeleteCustomerId(customerId);
  openDelete();
};

<Modal isOpen={deleteOpen} onClose={closeDelete}>
  <ModalHeader title="Delete Customer" onClose={closeDelete} />
  <ModalBody>
    <p className="text-red-600 font-medium mb-2">
      This action cannot be undone.
    </p>
    <p className="text-gray-600">
      Are you sure you want to delete this customer? (
      {customer?.invoiceCount || 0} invoices will be affected)
    </p>
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={closeDelete}>
      Cancel
    </Button>
    <Button
      variant="destructive"
      onClick={() => {
        deleteCustomer(deleteCustomerId);
        closeDelete();
      }}
    >
      Delete Customer
    </Button>
  </ModalFooter>
</Modal>;
```

#### 4. Customer Details Modal

**Trigger**: Customer name/row click  
**Purpose**: View full customer details  
**Size**: Large (900px)  
**Content**: Contact info, tags, recent invoices, activity history

```tsx
const {
  isOpen: detailsOpen,
  open: openDetails,
  close: closeDetails,
} = useModal();
const [selectedCustomer, setSelectedCustomer] = useState(null);

<Modal isOpen={detailsOpen} onClose={closeDetails}>
  <ModalHeader title="Customer Details" onClose={closeDetails} />
  <ModalBody>
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">Contact Information</h3>
        <p>{selectedCustomer?.email}</p>
        <p>{selectedCustomer?.phone}</p>
      </div>
      <div>
        <h3 className="font-semibold">Recent Invoices</h3>
        {/* Invoice list */}
      </div>
    </div>
  </ModalBody>
  <ModalFooter>
    <Button onClick={closeDetails}>Close</Button>
  </ModalFooter>
</Modal>;
```

---

## Invoices Page

### Location

**File**: `app/(dashboard)/invoices/page.tsx`

### Recommended Modals

#### 1. Create Invoice Modal

**Trigger**: "New Invoice" button  
**Purpose**: Form for creating invoice  
**Size**: Large (900px)  
**Fields**: Customer, Line items, Tax, Notes, Due date

```tsx
const {
  isOpen: createInvoiceOpen,
  open: openCreateInvoice,
  close: closeCreateInvoice,
} = useModal();

<Modal isOpen={createInvoiceOpen} onClose={closeCreateInvoice}>
  <ModalHeader title="Create New Invoice" onClose={closeCreateInvoice} />
  <ModalBody>
    <form onSubmit={handleInvoiceSubmit} className="space-y-4">
      {/* Invoice form with line items */}
    </form>
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={closeCreateInvoice}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleInvoiceSubmit}>
      Create Invoice
    </Button>
  </ModalFooter>
</Modal>;
```

#### 2. Invoice Details Modal

**Trigger**: Invoice number click  
**Purpose**: Full invoice details, print, send, download  
**Size**: Large (900px)  
**Actions**: Download PDF, Send Email, Mark Paid, Edit

```tsx
<Modal isOpen={detailsInvoiceOpen} onClose={closeDetailsInvoice}>
  <ModalHeader
    title={`Invoice #${selectedInvoice?.number}`}
    onClose={closeDetailsInvoice}
  />
  <ModalBody>{/* Full invoice display */}</ModalBody>
  <ModalFooter>
    <Button variant="outline" onClick={downloadPDF}>
      Download PDF
    </Button>
    <Button variant="outline" onClick={sendEmail}>
      Send Email
    </Button>
    <Button variant="primary" onClick={markPaid}>
      Mark as Paid
    </Button>
  </ModalFooter>
</Modal>
```

#### 3. Send Invoice Modal

**Trigger**: "Send" button  
**Purpose**: Enter recipient email, preview  
**Size**: Default (600px)

```tsx
<Modal isOpen={sendInvoiceOpen} onClose={closeSendInvoice}>
  <ModalHeader title="Send Invoice" onClose={closeSendInvoice} />
  <ModalBody>
    <Input type="email" placeholder="Recipient email" />
    <Input as="textarea" placeholder="Message" />
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={closeSendInvoice}>
      Cancel
    </Button>
    <Button variant="primary" onClick={sendEmail}>
      Send
    </Button>
  </ModalFooter>
</Modal>
```

#### 4. Delete Invoice Modal

**Trigger**: "Delete" button  
**Purpose**: Confirmation  
**Size**: Default (600px)

```tsx
<Modal isOpen={deleteInvoiceOpen} onClose={closeDeleteInvoice}>
  <ModalHeader title="Delete Invoice" onClose={closeDeleteInvoice} />
  <ModalBody>
    <p className="text-red-600 font-medium">This action cannot be undone.</p>
    <p>Delete invoice #{selectedInvoice?.number}?</p>
  </ModalBody>
  <ModalFooter>
    <Button onClick={closeDeleteInvoice}>Cancel</Button>
    <Button
      variant="destructive"
      onClick={() => {
        deleteInvoice();
        closeDeleteInvoice();
      }}
    >
      Delete
    </Button>
  </ModalFooter>
</Modal>
```

---

## Users Page

### Location

**File**: `app/(dashboard)/users/page.tsx`

### Recommended Modals

#### 1. Create User Modal

**Trigger**: "Add User" button  
**Purpose**: Form for adding new user  
**Size**: Large (900px)  
**Fields**: Name, Email, Role, Permissions, Status

```tsx
const {
  isOpen: createUserOpen,
  open: openCreateUser,
  close: closeCreateUser,
} = useModal();

<Modal isOpen={createUserOpen} onClose={closeCreateUser}>
  <ModalHeader title="Create New User" onClose={closeCreateUser} />
  <ModalBody>
    <form className="space-y-4">{/* User form */}</form>
  </ModalBody>
  <ModalFooter>
    <Button onClick={closeCreateUser}>Cancel</Button>
    <Button onClick={createUser}>Create User</Button>
  </ModalFooter>
</Modal>;
```

#### 2. Edit Permissions Modal

**Trigger**: "Permissions" button in user row  
**Purpose**: Manage user permissions  
**Size**: Large (900px)  
**Content**: Permission checkboxes for modules

```tsx
<Modal isOpen={permissionsOpen} onClose={closePermissions}>
  <ModalHeader title="User Permissions" onClose={closePermissions} />
  <ModalBody>
    <div className="space-y-3">{/* Permission checkboxes */}</div>
  </ModalBody>
  <ModalFooter>
    <Button onClick={closePermissions}>Cancel</Button>
    <Button onClick={updatePermissions}>Save Permissions</Button>
  </ModalFooter>
</Modal>
```

#### 3. Reset Password Modal

**Trigger**: "Reset Password" button  
**Purpose**: Send password reset  
**Size**: Default (600px)

```tsx
<Modal isOpen={resetPasswordOpen} onClose={closeResetPassword}>
  <ModalHeader title="Reset Password" onClose={closeResetPassword} />
  <ModalBody>
    <p>Send password reset link to {selectedUser?.email}?</p>
  </ModalBody>
  <ModalFooter>
    <Button onClick={closeResetPassword}>Cancel</Button>
    <Button onClick={sendResetLink}>Send Reset Link</Button>
  </ModalFooter>
</Modal>
```

#### 4. Delete User Modal

**Trigger**: "Delete" button  
**Purpose**: Confirmation  
**Size**: Default (600px)

```tsx
<Modal isOpen={deleteUserOpen} onClose={closeDeleteUser}>
  <ModalHeader title="Delete User" onClose={closeDeleteUser} />
  <ModalBody>
    <p className="text-red-600 font-medium">This action cannot be undone.</p>
    <p>Delete user {selectedUser?.name}?</p>
  </ModalBody>
  <ModalFooter>
    <Button onClick={closeDeleteUser}>Cancel</Button>
    <Button
      variant="destructive"
      onClick={() => {
        deleteUser();
        closeDeleteUser();
      }}
    >
      Delete User
    </Button>
  </ModalFooter>
</Modal>
```

---

## Inventory Page

### Location

**File**: `app/(dashboard)/inventory/page.tsx`

### Recommended Modals

#### 1. Add Vehicle Modal

**Trigger**: "Add Vehicle" button  
**Purpose**: Form for adding vehicle  
**Size**: Large (900px)  
**Fields**: VIN, Make, Model, Year, Color, Status, Notes

```tsx
const {
  isOpen: addVehicleOpen,
  open: openAddVehicle,
  close: closeAddVehicle,
} = useModal();

<Modal isOpen={addVehicleOpen} onClose={closeAddVehicle}>
  <ModalHeader title="Add New Vehicle" onClose={closeAddVehicle} />
  <ModalBody>
    <form className="space-y-4">{/* Vehicle form */}</form>
  </ModalBody>
  <ModalFooter>
    <Button onClick={closeAddVehicle}>Cancel</Button>
    <Button onClick={addVehicle}>Add Vehicle</Button>
  </ModalFooter>
</Modal>;
```

#### 2. Edit Vehicle Modal

**Trigger**: Vehicle card edit button  
**Purpose**: Edit vehicle details  
**Size**: Large (900px)

```tsx
<Modal isOpen={editVehicleOpen} onClose={closeEditVehicle}>
  <ModalHeader
    title={`Edit: ${selectedVehicle?.make} ${selectedVehicle?.model}`}
    onClose={closeEditVehicle}
  />
  <ModalBody>
    <form className="space-y-4">{/* Vehicle form pre-filled */}</form>
  </ModalBody>
  <ModalFooter>
    <Button onClick={closeEditVehicle}>Cancel</Button>
    <Button onClick={saveVehicle}>Save Changes</Button>
  </ModalFooter>
</Modal>
```

#### 3. Delete Vehicle Modal

**Trigger**: Vehicle card delete button  
**Purpose**: Confirmation  
**Size**: Default (600px)

```tsx
<Modal isOpen={deleteVehicleOpen} onClose={closeDeleteVehicle}>
  <ModalHeader title="Delete Vehicle" onClose={closeDeleteVehicle} />
  <ModalBody>
    <p className="text-red-600 font-medium">This action cannot be undone.</p>
    <p>
      Delete {selectedVehicle?.make} {selectedVehicle?.model} (
      {selectedVehicle?.vin})?
    </p>
  </ModalBody>
  <ModalFooter>
    <Button onClick={closeDeleteVehicle}>Cancel</Button>
    <Button
      variant="destructive"
      onClick={() => {
        deleteVehicle();
        closeDeleteVehicle();
      }}
    >
      Delete Vehicle
    </Button>
  </ModalFooter>
</Modal>
```

---

## Settings Page

### Location

**File**: `app/(dashboard)/settings/page.tsx`

### Recommended Modals

#### 1. API Key Modal

**Trigger**: "View" button next to API key  
**Purpose**: Display/copy API key  
**Size**: Default (600px)

```tsx
<Modal isOpen={apiKeyOpen} onClose={closeApiKey}>
  <ModalHeader title="API Key" onClose={closeApiKey} />
  <ModalBody>
    <Input type="password" value={apiKey} readOnly />
  </ModalBody>
  <ModalFooter>
    <Button onClick={copyToClipboard}>Copy Key</Button>
    <Button onClick={closeApiKey}>Done</Button>
  </ModalFooter>
</Modal>
```

#### 2. Generate New Key Modal

**Trigger**: "Generate" button  
**Purpose**: Confirm new key generation  
**Size**: Default (600px)

```tsx
<Modal isOpen={generateKeyOpen} onClose={closeGenerateKey}>
  <ModalHeader title="Generate New API Key" onClose={closeGenerateKey} />
  <ModalBody>
    <p className="text-amber-600">
      Generating a new key will invalidate the current one.
    </p>
    <p className="text-gray-600">
      Make sure to update any applications using the old key.
    </p>
  </ModalBody>
  <ModalFooter>
    <Button onClick={closeGenerateKey}>Cancel</Button>
    <Button variant="primary" onClick={generateKey}>
      Generate New Key
    </Button>
  </ModalFooter>
</Modal>
```

#### 3. Webhook Settings Modal

**Trigger**: "Configure" button  
**Purpose**: Setup webhooks  
**Size**: Large (900px)

```tsx
<Modal isOpen={webhookOpen} onClose={closeWebhook}>
  <ModalHeader title="Webhook Settings" onClose={closeWebhook} />
  <ModalBody>
    <form className="space-y-4">{/* Webhook configuration */}</form>
  </ModalBody>
  <ModalFooter>
    <Button onClick={closeWebhook}>Cancel</Button>
    <Button onClick={saveWebhooks}>Save Settings</Button>
  </ModalFooter>
</Modal>
```

---

## System Health Page

### Location

**File**: `app/(dashboard)/system-health/page.tsx`

### Recommended Modals

#### 1. Error Details Modal

**Trigger**: Error list item click  
**Purpose**: View error details and stack trace  
**Size**: Large (900px)

```tsx
<Modal isOpen={errorDetailsOpen} onClose={closeErrorDetails}>
  <ModalHeader title="Error Details" onClose={closeErrorDetails} />
  <ModalBody>
    <div className="space-y-3">
      <div>
        <h4 className="font-semibold">Error Message</h4>
        <code className="text-sm">{selectedError?.message}</code>
      </div>
      <div>
        <h4 className="font-semibold">Stack Trace</h4>
        <pre className="text-xs overflow-auto">{selectedError?.stackTrace}</pre>
      </div>
    </div>
  </ModalBody>
  <ModalFooter>
    <Button onClick={closeErrorDetails}>Close</Button>
  </ModalFooter>
</Modal>
```

#### 2. Logs Modal

**Trigger**: "View Logs" button  
**Purpose**: Display system logs  
**Size**: Large (900px)

```tsx
<Modal isOpen={logsOpen} onClose={closeLogs}>
  <ModalHeader title="System Logs" onClose={closeLogs} />
  <ModalBody>{/* Log list with filtering */}</ModalBody>
  <ModalFooter>
    <Button onClick={downloadLogs}>Download Logs</Button>
    <Button onClick={closeLogs}>Close</Button>
  </ModalFooter>
</Modal>
```

---

## CRM Page

### Location

**File**: `app/(dashboard)/crm/page.tsx`

### Recommended Modals

#### 1. New Lead Modal

**Trigger**: "Add Lead" button  
**Purpose**: Create new sales lead  
**Size**: Large (900px)  
**Fields**: Contact, Company, Status, Value, Notes

```tsx
<Modal isOpen={newLeadOpen} onClose={closeNewLead}>
  <ModalHeader title="New Lead" onClose={closeNewLead} />
  <ModalBody>
    <form className="space-y-4">{/* Lead form */}</form>
  </ModalBody>
  <ModalFooter>
    <Button onClick={closeNewLead}>Cancel</Button>
    <Button onClick={createLead}>Create Lead</Button>
  </ModalFooter>
</Modal>
```

#### 2. Update Lead Status Modal

**Trigger**: Status dropdown / "Update Status"  
**Purpose**: Change lead status with notes  
**Size**: Default (600px)

```tsx
<Modal isOpen={updateStatusOpen} onClose={closeUpdateStatus}>
  <ModalHeader title="Update Lead Status" onClose={closeUpdateStatus} />
  <ModalBody>
    <Select>
      <option>Prospect</option>
      <option>Qualified</option>
      <option>Proposal</option>
      <option>Negotiation</option>
      <option>Won</option>
      <option>Lost</option>
    </Select>
    <Input placeholder="Status notes (optional)" />
  </ModalBody>
  <ModalFooter>
    <Button onClick={closeUpdateStatus}>Cancel</Button>
    <Button onClick={updateStatus}>Update</Button>
  </ModalFooter>
</Modal>
```

---

## Implementation Checklist

Use this checklist to track modal implementation across the app:

### Dashboard

- [ ] Quick Action Modal

### Customers Page

- [ ] Create Customer Modal
- [ ] Edit Customer Modal
- [ ] Delete Customer Modal
- [ ] Customer Details Modal

### Invoices Page

- [ ] Create Invoice Modal
- [ ] Invoice Details Modal
- [ ] Send Invoice Modal
- [ ] Delete Invoice Modal

### Users Page

- [ ] Create User Modal
- [ ] Edit Permissions Modal
- [ ] Reset Password Modal
- [ ] Delete User Modal

### Inventory Page

- [ ] Add Vehicle Modal
- [ ] Edit Vehicle Modal
- [ ] Delete Vehicle Modal

### Settings Page

- [ ] API Key Modal
- [ ] Generate New Key Modal
- [ ] Webhook Settings Modal

### System Health Page

- [ ] Error Details Modal
- [ ] Logs Modal

### CRM Page

- [ ] New Lead Modal
- [ ] Update Lead Status Modal

---

## Best Practices

### State Management

```tsx
// ✅ Good: Use separate useModal for each modal
const createModal = useModal();
const editModal = useModal();
const deleteModal = useModal();

// ❌ Avoid: Single boolean state (hard to manage)
const [showModal, setShowModal] = useState(false);
```

### Data Selection

```tsx
// ✅ Good: Store selected item before opening
const [selectedItem, setSelectedItem] = useState(null);
const handleEdit = (item) => {
  setSelectedItem(item);
  openEdit();
};

// ❌ Avoid: Passing data as prop before modal opens
<ModalButton item={clickedItem} />;
```

### Error Handling

```tsx
// ✅ Good: Show errors in modal
const [error, setError] = useState(null);
const handleSubmit = async () => {
  try {
    await submitForm();
    closeModal();
  } catch (err) {
    setError(err.message);
  }
};

// ❌ Avoid: Close modal immediately after error
```

### Loading States

```tsx
// ✅ Good: Disable buttons while loading
const [isLoading, setIsLoading] = useState(false);
<ModalFooter>
  <Button disabled={isLoading}>Submit</Button>
</ModalFooter>;

// ❌ Avoid: No feedback while loading
```

---

## Migration Priority

1. **High Priority** (Do First)
   - Delete confirmations (critical)
   - Forms for CRUD operations
   - Inline alerts/errors

2. **Medium Priority** (Do Next)
   - Details/preview modals
   - Settings modals
   - Advanced actions

3. **Low Priority** (Nice to Have)
   - Help/info modals
   - Tutorials
   - Tips & tricks

---

## Summary

**Total Recommended Modals**: 25+  
**Status**: Ready for implementation  
**Component**: `/components/ui/modal.tsx`  
**Documentation**: `/docs/MODAL_3_5.md`

Start with high-priority modals (delete confirmations and forms), then expand to other pages.

---

**Version**: 1.0  
**Status**: ✅ Ready for Implementation  
**Last Updated**: January 23, 2026
