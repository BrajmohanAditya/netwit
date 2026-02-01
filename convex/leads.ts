
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("leads").order("desc").collect();
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        company: v.optional(v.string()),
        source: v.string(),
        sourceDetails: v.optional(v.string()),
        status: v.string(),
        vehicleInterest: v.optional(v.string()),
        notes: v.optional(v.string()),
        assignedTo: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const leadId = await ctx.db.insert("leads", {
            name: args.name,
            email: args.email,
            phone: args.phone,
            company: args.company,
            source: args.source,
            source_details: args.sourceDetails,
            status: args.status,
            // interest_vehicle_id: args.vehicleInterest, // complex mapping, leaving distinct for now or handling ID lookup later
            assigned_to: args.assignedTo,
            notes: args.notes,
            lead_creation_date: new Date().toISOString(),
            last_engagement: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
        return leadId;
    },
});

export const updateStatus = mutation({
    args: { id: v.id("leads"), status: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: args.status, updated_at: new Date().toISOString() });
    },
});
