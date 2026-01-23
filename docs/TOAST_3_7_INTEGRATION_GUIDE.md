# Section 3.7: Toast Notifications - Integration Guide

**50+ Toast Locations Across ADAPTUS DMS**

---

## 📋 Setup Instructions

### 1. Wrap Your Root Layout

```tsx
// app/layout.tsx
import { ToastProvider } from "@/components/ui/toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
```

### 2. Use in Any Component

```tsx
import { useToast } from "@/components/ui/toast";

export function MyComponent() {
  const { addToast } = useToast();

  return (
    <button
      onClick={() =>
        addToast({
          type: "success",
          title: "Success",
          message: "Action completed",
        })
      }
    >
      Click Me
    </button>
  );
}
```

---

## 🎯 Dashboard Integration (8 locations)

### 1. Save KPI Configuration

```tsx
const handleSaveKPI = async (config) => {
  try {
    await saveKPIConfig(config);
    addToast({
      type: "success",
      title: "Configuration Saved",
      message: "KPI settings have been updated successfully",
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Save Failed",
      message: "Failed to save KPI configuration",
      duration: 7000,
    });
  }
};
```

### 2. System Status Update

```tsx
const handleSystemAlert = (alert) => {
  const typeMap = {
    healthy: "success",
    warning: "warning",
    error: "error",
  };

  addToast({
    type: typeMap[alert.status],
    title: "System Alert",
    message: alert.message,
    duration: 10000,
  });
};
```

### 3. Refresh Data

```tsx
const handleRefreshMetrics = async () => {
  try {
    await refreshData();
    addToast({
      type: "info",
      title: "Data Refreshed",
      message: "Dashboard metrics updated",
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Refresh Failed",
      message: "Could not refresh data",
    });
  }
};
```

### 4. Export Dashboard

```tsx
const handleExportDashboard = async (format) => {
  try {
    await exportData(format);
    addToast({
      type: "success",
      title: "Export Complete",
      message: `Dashboard exported as ${format.toUpperCase()}`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Export Failed",
      message: "Could not export dashboard",
    });
  }
};
```

### 5. Report Generated

```tsx
const handleGenerateReport = async () => {
  try {
    const report = await generateReport();
    addToast({
      type: "success",
      title: "Report Ready",
      message: "Your report is ready to download",
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Report Generation Failed",
      message: error.message,
    });
  }
};
```

### 6. Theme Changed

```tsx
const handleThemeChange = (theme) => {
  addToast({
    type: "info",
    title: "Theme Changed",
    message: `Switched to ${theme} theme`,
  });
};
```

### 7. Language Changed

```tsx
const handleLanguageChange = (lang) => {
  addToast({
    type: "info",
    title: "Language Updated",
    message: `Language changed to ${lang}`,
  });
};
```

### 8. Auto-save Indicator

```tsx
const handleAutoSave = async (data) => {
  try {
    await save(data);
    addToast({
      type: "success",
      title: "Auto-saved",
      message: "Your changes have been automatically saved",
      duration: 3000, // Quick notification
    });
  } catch (error) {
    addToast({
      type: "warning",
      title: "Auto-save Failed",
      message: "Please save manually",
    });
  }
};
```

---

## 👥 Customers Section Integration (12 locations)

### 1. Customer Created

```tsx
const handleCreateCustomer = async (formData) => {
  try {
    const customer = await createCustomer(formData);
    addToast({
      type: "success",
      title: "Customer Added",
      message: `${customer.name} has been added to customers`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Creation Failed",
      message: error.message,
      duration: 7000,
    });
  }
};
```

### 2. Customer Updated

```tsx
const handleUpdateCustomer = async (id, data) => {
  try {
    await updateCustomer(id, data);
    addToast({
      type: "success",
      title: "Customer Updated",
      message: "Customer information has been updated",
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Update Failed",
      message: "Could not update customer",
    });
  }
};
```

### 3. Customer Deleted

```tsx
const handleDeleteCustomer = async (id, name) => {
  try {
    await deleteCustomer(id);
    addToast({
      type: "success",
      title: "Customer Deleted",
      message: `${name} has been removed from customers`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Deletion Failed",
      message: "Could not delete customer",
    });
  }
};
```

### 4. Customer Verified

```tsx
const handleVerifyCustomer = async (id, name) => {
  try {
    await verifyCustomer(id);
    addToast({
      type: "success",
      title: "Verified",
      message: `${name} has been verified`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Verification Failed",
      message: "Could not verify customer",
    });
  }
};
```

### 5. Customer Type Changed

```tsx
const handleChangeCustomerType = async (id, type) => {
  try {
    await updateCustomerType(id, type);
    addToast({
      type: "info",
      title: "Type Updated",
      message: `Customer type changed to ${type}`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Update Failed",
      message: "Could not change customer type",
    });
  }
};
```

### 6. Risk Level Updated

```tsx
const handleRiskLevelChange = async (id, level) => {
  try {
    await updateRiskLevel(id, level);
    addToast({
      type: type === "high" ? "warning" : "success",
      title: "Risk Level Updated",
      message: `Customer risk level set to ${level}`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Update Failed",
      message: "Could not update risk level",
    });
  }
};
```

### 7. Bulk Import Customers

```tsx
const handleImportCustomers = async (file) => {
  try {
    const result = await importCustomers(file);
    addToast({
      type: "success",
      title: "Import Complete",
      message: `${result.count} customers imported successfully`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Import Failed",
      message: error.message,
      duration: 8000,
    });
  }
};
```

### 8. Export Customers

```tsx
const handleExportCustomers = async () => {
  try {
    await exportCustomers();
    addToast({
      type: "success",
      title: "Export Complete",
      message: "Customer list exported successfully",
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Export Failed",
      message: "Could not export customer list",
    });
  }
};
```

### 9. Contact Added

```tsx
const handleAddContact = async (customerId, contact) => {
  try {
    await addContact(customerId, contact);
    addToast({
      type: "success",
      title: "Contact Added",
      message: `${contact.name} has been added`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Failed to Add Contact",
      message: error.message,
    });
  }
};
```

### 10. Contact Deleted

```tsx
const handleDeleteContact = async (customerId, contactId) => {
  try {
    await deleteContact(customerId, contactId);
    addToast({
      type: "success",
      title: "Contact Removed",
      message: "Contact has been deleted",
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Deletion Failed",
      message: "Could not delete contact",
    });
  }
};
```

### 11. Email Sent to Customer

```tsx
const handleSendEmail = async (customerId, email) => {
  try {
    await sendEmail(customerId, email);
    addToast({
      type: "success",
      title: "Email Sent",
      message: `Email sent to ${email.recipient}`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Send Failed",
      message: "Could not send email",
    });
  }
};
```

### 12. Activity Log Cleared

```tsx
const handleClearActivityLog = async (customerId) => {
  try {
    await clearLog(customerId);
    addToast({
      type: "success",
      title: "Activity Log Cleared",
      message: "Customer activity history has been cleared",
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Clear Failed",
      message: "Could not clear activity log",
    });
  }
};
```

---

## 💰 Invoices Section Integration (12 locations)

### 1. Invoice Created

```tsx
const handleCreateInvoice = async (formData) => {
  try {
    const invoice = await createInvoice(formData);
    addToast({
      type: "success",
      title: "Invoice Created",
      message: `Invoice #${invoice.number} has been created`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Creation Failed",
      message: error.message,
      duration: 7000,
    });
  }
};
```

### 2. Invoice Sent

```tsx
const handleSendInvoice = async (invoiceId) => {
  try {
    await sendInvoice(invoiceId);
    addToast({
      type: "success",
      title: "Invoice Sent",
      message: "Invoice has been sent to customer",
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Send Failed",
      message: "Could not send invoice",
    });
  }
};
```

### 3. Payment Received

```tsx
const handlePaymentReceived = async (invoiceId, amount) => {
  try {
    await recordPayment(invoiceId, amount);
    addToast({
      type: "success",
      title: "Payment Recorded",
      message: `Payment of $${amount} has been recorded`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Payment Failed",
      message: "Could not record payment",
    });
  }
};
```

### 4. Overdue Reminder

```tsx
const handleSendReminder = async (invoiceId) => {
  try {
    await sendOverdueReminder(invoiceId);
    addToast({
      type: "info",
      title: "Reminder Sent",
      message: "Payment reminder has been sent",
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Send Failed",
      message: "Could not send reminder",
    });
  }
};
```

### 5. Invoice Status Changed

```tsx
const handleStatusChange = async (invoiceId, status) => {
  try {
    await updateInvoiceStatus(invoiceId, status);
    addToast({
      type: "info",
      title: "Status Updated",
      message: `Invoice status changed to ${status}`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Update Failed",
      message: "Could not update invoice status",
    });
  }
};
```

### 6. Invoice Void/Cancel

```tsx
const handleVoidInvoice = async (invoiceId) => {
  try {
    await voidInvoice(invoiceId);
    addToast({
      type: "warning",
      title: "Invoice Voided",
      message: "Invoice has been marked as void",
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Void Failed",
      message: "Could not void invoice",
    });
  }
};
```

### 7. Invoice Duplicated

```tsx
const handleDuplicateInvoice = async (invoiceId) => {
  try {
    const newInvoice = await duplicateInvoice(invoiceId);
    addToast({
      type: "success",
      title: "Invoice Duplicated",
      message: `New invoice #${newInvoice.number} created`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Duplication Failed",
      message: "Could not duplicate invoice",
    });
  }
};
```

### 8. PDF Generated

```tsx
const handleGeneratePDF = async (invoiceId) => {
  try {
    await generatePDF(invoiceId);
    addToast({
      type: "success",
      title: "PDF Generated",
      message: "Invoice PDF is ready to download",
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Generation Failed",
      message: "Could not generate PDF",
    });
  }
};
```

### 9. Bulk Email

```tsx
const handleBulkEmail = async (invoices) => {
  try {
    const result = await sendBulkEmails(invoices);
    addToast({
      type: "success",
      title: "Emails Sent",
      message: `${result.count} invoices emailed successfully`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Send Failed",
      message: "Could not send emails",
    });
  }
};
```

### 10. Partial Payment

```tsx
const handlePartialPayment = async (invoiceId, amount) => {
  try {
    await recordPartialPayment(invoiceId, amount);
    addToast({
      type: "success",
      title: "Partial Payment Recorded",
      message: `${amount} received. Balance: ${balance}`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Payment Failed",
      message: "Could not record partial payment",
    });
  }
};
```

### 11. Invoice Notes Updated

```tsx
const handleUpdateNotes = async (invoiceId, notes) => {
  try {
    await updateInvoiceNotes(invoiceId, notes);
    addToast({
      type: "success",
      title: "Notes Updated",
      message: "Invoice notes have been saved",
      duration: 3000,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Update Failed",
      message: "Could not update notes",
    });
  }
};
```

### 12. Invoice Deleted

```tsx
const handleDeleteInvoice = async (invoiceId, number) => {
  try {
    await deleteInvoice(invoiceId);
    addToast({
      type: "success",
      title: "Invoice Deleted",
      message: `Invoice #${number} has been deleted`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Deletion Failed",
      message: "Could not delete invoice",
    });
  }
};
```

---

## 👤 Users Section Integration (10 locations)

### 1. User Created

```tsx
const handleCreateUser = async (formData) => {
  try {
    const user = await createUser(formData);
    addToast({
      type: "success",
      title: "User Added",
      message: `${user.name} has been added as a user`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Creation Failed",
      message: error.message,
    });
  }
};
```

### 2. User Updated

```tsx
const handleUpdateUser = async (id, data) => {
  try {
    await updateUser(id, data);
    addToast({
      type: "success",
      title: "User Updated",
      message: "User information has been updated",
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Update Failed",
      message: "Could not update user",
    });
  }
};
```

### 3. User Deleted

```tsx
const handleDeleteUser = async (id, name) => {
  try {
    await deleteUser(id);
    addToast({
      type: "success",
      title: "User Deleted",
      message: `${name} has been removed from users`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Deletion Failed",
      message: "Could not delete user",
    });
  }
};
```

### 4. Role Changed

```tsx
const handleChangeRole = async (id, role) => {
  try {
    await updateUserRole(id, role);
    addToast({
      type: "info",
      title: "Role Updated",
      message: `User role changed to ${role}`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Update Failed",
      message: "Could not change user role",
    });
  }
};
```

### 5. Password Reset Sent

```tsx
const handleResetPassword = async (id, email) => {
  try {
    await sendPasswordReset(id);
    addToast({
      type: "success",
      title: "Reset Email Sent",
      message: `Password reset link sent to ${email}`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Send Failed",
      message: "Could not send reset email",
    });
  }
};
```

### 6. User Verified

```tsx
const handleVerifyUser = async (id, name) => {
  try {
    await verifyUser(id);
    addToast({
      type: "success",
      title: "User Verified",
      message: `${name} has been verified`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Verification Failed",
      message: "Could not verify user",
    });
  }
};
```

### 7. Account Status Changed

```tsx
const handleChangeAccountStatus = async (id, status) => {
  try {
    await updateAccountStatus(id, status);
    const message =
      status === "active" ? "Account activated" : "Account deactivated";
    addToast({
      type: "info",
      title: "Status Changed",
      message,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Update Failed",
      message: "Could not change account status",
    });
  }
};
```

### 8. Permissions Changed

```tsx
const handleChangePermissions = async (id, permissions) => {
  try {
    await updatePermissions(id, permissions);
    addToast({
      type: "success",
      title: "Permissions Updated",
      message: "User permissions have been updated",
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Update Failed",
      message: "Could not update permissions",
    });
  }
};
```

### 9. Session Terminated

```tsx
const handleTerminateSession = async (id, name) => {
  try {
    await terminateSession(id);
    addToast({
      type: "info",
      title: "Session Terminated",
      message: `${name}'s session has been ended`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Termination Failed",
      message: "Could not terminate session",
    });
  }
};
```

### 10. Bulk User Import

```tsx
const handleBulkImport = async (file) => {
  try {
    const result = await importUsers(file);
    addToast({
      type: "success",
      title: "Import Complete",
      message: `${result.count} users imported successfully`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Import Failed",
      message: error.message,
    });
  }
};
```

---

## 📦 Inventory Section Integration (10 locations)

### 1. Item Created

```tsx
const handleCreateItem = async (formData) => {
  try {
    const item = await createItem(formData);
    addToast({
      type: "success",
      title: "Item Added",
      message: `${item.name} has been added to inventory`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Creation Failed",
      message: error.message,
    });
  }
};
```

### 2. Stock Adjusted

```tsx
const handleAdjustStock = async (itemId, quantity, reason) => {
  try {
    await adjustStock(itemId, quantity, reason);
    addToast({
      type: "success",
      title: "Stock Adjusted",
      message: `Stock ${quantity > 0 ? "increased" : "decreased"} by ${Math.abs(quantity)} units`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Adjustment Failed",
      message: "Could not adjust stock",
    });
  }
};
```

### 3. Low Stock Warning

```tsx
const handleLowStockAlert = (item) => {
  addToast({
    type: "warning",
    title: "Low Stock Alert",
    message: `${item.name} stock is below minimum level`,
    duration: 10000,
  });
};
```

### 4. Reorder Created

```tsx
const handleCreateReorder = async (itemId, quantity) => {
  try {
    const reorder = await createReorder(itemId, quantity);
    addToast({
      type: "success",
      title: "Reorder Created",
      message: `Purchase order created for ${quantity} units`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Reorder Failed",
      message: "Could not create purchase order",
    });
  }
};
```

### 5. Item Condition Updated

```tsx
const handleUpdateCondition = async (itemId, condition) => {
  try {
    await updateCondition(itemId, condition);
    addToast({
      type: "info",
      title: "Condition Updated",
      message: `Item condition set to ${condition}`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Update Failed",
      message: "Could not update item condition",
    });
  }
};
```

### 6. Item Inspection Completed

```tsx
const handleCompleteInspection = async (itemId, result) => {
  try {
    await completeInspection(itemId, result);
    addToast({
      type: result === "pass" ? "success" : "warning",
      title: "Inspection Complete",
      message: `Item inspection ${result === "pass" ? "passed" : "needs attention"}`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Inspection Failed",
      message: "Could not complete inspection",
    });
  }
};
```

### 7. Item Deleted

```tsx
const handleDeleteItem = async (itemId, name) => {
  try {
    await deleteItem(itemId);
    addToast({
      type: "success",
      title: "Item Deleted",
      message: `${name} has been removed from inventory`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Deletion Failed",
      message: "Could not delete item",
    });
  }
};
```

### 8. Inventory Exported

```tsx
const handleExportInventory = async () => {
  try {
    await exportInventory();
    addToast({
      type: "success",
      title: "Export Complete",
      message: "Inventory list exported successfully",
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Export Failed",
      message: "Could not export inventory",
    });
  }
};
```

### 9. Bulk Stock Update

```tsx
const handleBulkStockUpdate = async (items) => {
  try {
    const result = await updateBulkStock(items);
    addToast({
      type: "success",
      title: "Bulk Update Complete",
      message: `${result.count} items updated`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Update Failed",
      message: "Could not update stock",
    });
  }
};
```

### 10. Transfer Completed

```tsx
const handleCompleteTransfer = async (transferId, fromLocation, toLocation) => {
  try {
    await completeTransfer(transferId);
    addToast({
      type: "success",
      title: "Transfer Complete",
      message: `Items transferred from ${fromLocation} to ${toLocation}`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Transfer Failed",
      message: "Could not complete transfer",
    });
  }
};
```

---

## ⚙️ Settings Section Integration (8 locations)

### 1. Configuration Saved

```tsx
const handleSaveSettings = async (settings) => {
  try {
    await saveSettings(settings);
    addToast({
      type: "success",
      title: "Settings Saved",
      message: "Your settings have been saved successfully",
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Save Failed",
      message: "Could not save settings",
    });
  }
};
```

### 2. Feature Toggle

```tsx
const handleToggleFeature = async (feature, enabled) => {
  try {
    await toggleFeature(feature, enabled);
    addToast({
      type: "info",
      title: "Feature Updated",
      message: `${feature} has been ${enabled ? "enabled" : "disabled"}`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Toggle Failed",
      message: "Could not toggle feature",
    });
  }
};
```

### 3. API Key Generated

```tsx
const handleGenerateAPIKey = async () => {
  try {
    const key = await generateAPIKey();
    addToast({
      type: "success",
      title: "API Key Generated",
      message: "New API key created and copied to clipboard",
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Generation Failed",
      message: "Could not generate API key",
    });
  }
};
```

### 4. API Key Revoked

```tsx
const handleRevokeAPIKey = async (keyId) => {
  try {
    await revokeAPIKey(keyId);
    addToast({
      type: "warning",
      title: "API Key Revoked",
      message: "The API key has been revoked and is no longer valid",
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Revoke Failed",
      message: "Could not revoke API key",
    });
  }
};
```

### 5. Email Configuration Tested

```tsx
const handleTestEmail = async (config) => {
  try {
    await testEmailConfig(config);
    addToast({
      type: "success",
      title: "Email Test Successful",
      message: "Email configuration is working correctly",
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Email Test Failed",
      message: "Email configuration test failed",
    });
  }
};
```

### 6. Backup Created

```tsx
const handleCreateBackup = async () => {
  try {
    await createBackup();
    addToast({
      type: "success",
      title: "Backup Complete",
      message: "System backup has been created successfully",
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Backup Failed",
      message: "Could not create backup",
    });
  }
};
```

### 7. Backup Restored

```tsx
const handleRestoreBackup = async (backupId) => {
  try {
    await restoreBackup(backupId);
    addToast({
      type: "success",
      title: "Restore Complete",
      message: "System has been restored from backup",
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Restore Failed",
      message: "Could not restore from backup",
    });
  }
};
```

### 8. Notification Preferences Updated

```tsx
const handleUpdateNotifications = async (prefs) => {
  try {
    await updateNotificationPreferences(prefs);
    addToast({
      type: "success",
      title: "Preferences Updated",
      message: "Notification preferences have been saved",
      duration: 3000,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Update Failed",
      message: "Could not update preferences",
    });
  }
};
```

---

## 🔧 System Health Integration (6 locations)

### 1. Service Down Alert

```tsx
const handleServiceAlert = (service) => {
  addToast({
    type: "error",
    title: "Service Alert",
    message: `${service.name} service is currently offline`,
    duration: 10000,
  });
};
```

### 2. Service Recovered

```tsx
const handleServiceRecovered = (service) => {
  addToast({
    type: "success",
    title: "Service Recovered",
    message: `${service.name} service is back online`,
  });
};
```

### 3. High CPU Warning

```tsx
const handleHighCPUAlert = (percentage) => {
  addToast({
    type: "warning",
    title: "High CPU Usage",
    message: `CPU usage is at ${percentage}%`,
    duration: 10000,
  });
};
```

### 4. Disk Space Warning

```tsx
const handleLowDiskSpace = (percentage) => {
  addToast({
    type: "warning",
    title: "Low Disk Space",
    message: `Only ${percentage}% disk space remaining`,
    duration: 10000,
  });
};
```

### 5. Database Connection Lost

```tsx
const handleDatabaseError = () => {
  addToast({
    type: "error",
    title: "Database Error",
    message: "Lost connection to database. Attempting to reconnect...",
    duration: 15000,
  });
};
```

### 6. System Maintenance Scheduled

```tsx
const handleMaintenanceNotice = (startTime, duration) => {
  addToast({
    type: "warning",
    title: "Maintenance Scheduled",
    message: `System maintenance ${startTime} for ${duration} minutes`,
    duration: 15000,
  });
};
```

---

## 💼 CRM Integration (8 locations)

### 1. Lead Created

```tsx
const handleCreateLead = async (leadData) => {
  try {
    const lead = await createLead(leadData);
    addToast({
      type: "success",
      title: "Lead Added",
      message: `${lead.name} has been added as a new lead`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Creation Failed",
      message: error.message,
    });
  }
};
```

### 2. Lead Converted

```tsx
const handleConvertLead = async (leadId, name) => {
  try {
    const customer = await convertLead(leadId);
    addToast({
      type: "success",
      title: "Lead Converted",
      message: `${name} has been converted to a customer`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Conversion Failed",
      message: "Could not convert lead",
    });
  }
};
```

### 3. Lead Status Updated

```tsx
const handleUpdateLeadStatus = async (leadId, status) => {
  try {
    await updateLeadStatus(leadId, status);
    addToast({
      type: "info",
      title: "Status Updated",
      message: `Lead status changed to ${status}`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Update Failed",
      message: "Could not update lead status",
    });
  }
};
```

### 4. Priority Changed

```tsx
const handleChangePriority = async (leadId, priority) => {
  try {
    await updatePriority(leadId, priority);
    addToast({
      type: "info",
      title: "Priority Updated",
      message: `Lead priority set to ${priority}`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Update Failed",
      message: "Could not change priority",
    });
  }
};
```

### 5. Task Created

```tsx
const handleCreateTask = async (task) => {
  try {
    await createTask(task);
    addToast({
      type: "success",
      title: "Task Created",
      message: `Task "${task.title}" has been created`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Creation Failed",
      message: "Could not create task",
    });
  }
};
```

### 6. Task Completed

```tsx
const handleCompleteTask = async (taskId, title) => {
  try {
    await completeTask(taskId);
    addToast({
      type: "success",
      title: "Task Completed",
      message: `"${title}" has been marked as complete`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Update Failed",
      message: "Could not complete task",
    });
  }
};
```

### 7. Note Added

```tsx
const handleAddNote = async (leadId) => {
  try {
    await addNote(leadId);
    addToast({
      type: "success",
      title: "Note Added",
      message: "Your note has been saved",
      duration: 3000,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Failed to Add Note",
      message: "Could not save note",
    });
  }
};
```

### 8. Lead Deleted

```tsx
const handleDeleteLead = async (leadId, name) => {
  try {
    await deleteLead(leadId);
    addToast({
      type: "success",
      title: "Lead Deleted",
      message: `${name} has been removed from leads`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Deletion Failed",
      message: "Could not delete lead",
    });
  }
};
```

---

## 💸 Financials Integration (6 locations)

### 1. Transaction Recorded

```tsx
const handleRecordTransaction = async (transaction) => {
  try {
    await recordTransaction(transaction);
    addToast({
      type: "success",
      title: "Transaction Recorded",
      message: `${transaction.type} transaction of $${transaction.amount} recorded`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Recording Failed",
      message: "Could not record transaction",
    });
  }
};
```

### 2. Reconciliation Completed

```tsx
const handleCompleteReconciliation = async (reconciliationId) => {
  try {
    const result = await completeReconciliation(reconciliationId);
    addToast({
      type: "success",
      title: "Reconciliation Complete",
      message: `$${result.total} reconciled successfully`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Reconciliation Failed",
      message: "Could not complete reconciliation",
      duration: 8000,
    });
  }
};
```

### 3. Report Generated

```tsx
const handleGenerateReport = async (reportType) => {
  try {
    await generateFinancialReport(reportType);
    addToast({
      type: "success",
      title: "Report Generated",
      message: `${reportType} report is ready to download`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Generation Failed",
      message: "Could not generate report",
    });
  }
};
```

### 4. Budget Updated

```tsx
const handleUpdateBudget = async (department, amount) => {
  try {
    await updateBudget(department, amount);
    addToast({
      type: "success",
      title: "Budget Updated",
      message: `${department} budget set to $${amount}`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Update Failed",
      message: "Could not update budget",
    });
  }
};
```

### 5. Budget Limit Warning

```tsx
const handleBudgetAlert = (department, percentage) => {
  addToast({
    type: "warning",
    title: "Budget Alert",
    message: `${department} has reached ${percentage}% of budget`,
    duration: 10000,
  });
};
```

### 6. Expense Approved

```tsx
const handleApproveExpense = async (expenseId, amount) => {
  try {
    await approveExpense(expenseId);
    addToast({
      type: "success",
      title: "Expense Approved",
      message: `Expense of $${amount} has been approved`,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Approval Failed",
      message: "Could not approve expense",
    });
  }
};
```

---

## 📊 Summary

**Total Integration Locations:** 50+
**App Sections Covered:** 9 (Dashboard, Customers, Invoices, Users, Inventory, Settings, System Health, CRM, Financials)
**Toast Types Used:** 4 (Success, Error, Warning, Info)
**Documentation Files:** 3 (TOAST_3_7.md, TOAST_3_7_QUICK_REFERENCE.md, TOAST_3_7_INTEGRATION_GUIDE.md)

---

**Status:** ✅ Ready for implementation
**Integration Timeline:** 2-3 weeks for full app coverage
