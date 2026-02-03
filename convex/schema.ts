import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  vehicles: defineTable({
    stockNo: v.string(),
    make: v.string(),
    model: v.string(),
    year: v.number(),
    trim: v.optional(v.string()),
    vin: v.string(),
    status: v.string(), // "Available", "Sold", "Pending"
    price: v.number(),
    cost: v.optional(v.number()),
    mileage: v.number(),
    color: v.string(),
    images: v.array(v.string()),
    features: v.array(v.string()),
    description: v.optional(v.string()),
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_stockNo", ["stockNo"])
    .index("by_status", ["status"]),

  leads: defineTable({
    customer_id: v.optional(v.string()),
    name: v.string(), // Extracted from mock usage
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    source: v.string(),
    source_details: v.optional(v.string()),
    status: v.string(),
    interest_vehicle_id: v.optional(v.id("vehicles")),
    assigned_to: v.optional(v.string()), // user ID
    notes: v.optional(v.string()),
    lead_creation_date: v.string(),
    last_engagement: v.string(),
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_assigned_to", ["assigned_to"]),

  invoices: defineTable({
    invoiceNumber: v.string(),
    customerName: v.string(),
    customerEmail: v.string(),
    amount: v.number(),
    status: v.string(), // "Paid", "Pending", "Overdue"
    date: v.string(),
    dueDate: v.string(),
    items: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        price: v.number(),
      }),
    ),
    created_at: v.string(),
  })
    .index("by_invoiceNumber", ["invoiceNumber"])
    .index("by_status", ["status"]),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.string(), // "Admin", "Sales", etc.
    avatar: v.optional(v.string()),
    status: v.string(), // "Active", "Inactive"
    created_at: v.string(),
  }).index("by_email", ["email"]),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
    priority: v.string(),
    status: v.string(),
    dueDate: v.optional(v.string()),
    created_at: v.string(),
  }).index("by_assignedTo", ["assignedTo"]),

  testDrives: defineTable({
    customerName: v.string(),
    vehicleName: v.string(),
    date: v.string(),
    time: v.string(),
    staffName: v.string(),
    status: v.string(),
    interest: v.number(),
    nextSteps: v.optional(v.string()),

    // Additional info from modal
    leadId: v.optional(v.string()),
    duration: v.optional(v.string()),
    route: v.optional(v.string()),
    licenseNumber: v.optional(v.string()),
    licenseIssued: v.optional(v.string()),
    licenseExpires: v.optional(v.string()),
    insuranceVerified: v.optional(v.boolean()),
    comments: v.optional(v.string()),
    staffNotes: v.optional(v.string()),

    created_at: v.string(),
    updated_at: v.string(),
  }).index("by_status", ["status"]),

  deals: defineTable({
    title: v.string(),
    value: v.number(),
    customer: v.string(),
    status: v.string(),
    dealNumber: v.optional(v.string()),
    vehicleId: v.optional(v.string()),
    customerId: v.optional(v.string()),
    notes: v.optional(v.string()),
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_dealNumber", ["dealNumber"]),

  followUps: defineTable({
    customer: v.string(),
    lead: v.string(),
    dueDate: v.string(),
    time: v.string(),
    channel: v.string(),
    assignedTo: v.string(),
    status: v.string(),
    priority: v.string(),
    notes: v.string(),
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_assignedTo", ["assignedTo"]),

  calendarEvents: defineTable({
    title: v.string(),
    type: v.string(), // "test-drive", "appointment", "call", "follow-up", "invoice"
    customer: v.optional(v.string()),
    vehicle: v.optional(v.string()),
    date: v.string(),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    location: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
    description: v.optional(v.string()),
    reminders: v.optional(
      v.object({
        email: v.boolean(),
        sms: v.boolean(),
      }),
    ),
    created_at: v.string(),
    updated_at: v.string(),
  }).index("by_date", ["date"]),

  purchaseHistory: defineTable({
    date: v.string(),
    vehicle: v.string(),
    vin: v.string(),
    price: v.number(),
    seller: v.string(),
    sellerType: v.string(),
    acceptedBy: v.string(),
    status: v.string(),
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_date", ["date"]),

  customers: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    province: v.optional(v.string()),
    postal_code: v.optional(v.string()),
    notes: v.optional(v.string()),
    type: v.optional(v.string()),
    status: v.optional(v.string()),
    lastContact: v.optional(v.string()),
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_email", ["email"]),

  quotations: defineTable({
    quoteNumber: v.string(),
    customer: v.string(),
    customerEmail: v.optional(v.string()),
    vehicle: v.string(),
    date: v.string(),
    expiryDate: v.string(),
    amount: v.number(),
    status: v.string(),
    notes: v.optional(v.string()),
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_quoteNumber", ["quoteNumber"])
    .index("by_status", ["status"]),
});
