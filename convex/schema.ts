
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
            })
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
    }).index("by_assignedTo", ["assignedTo"])
});
