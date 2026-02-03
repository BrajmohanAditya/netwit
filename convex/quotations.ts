import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("quotations").collect();
  },
});

export const create = mutation({
  args: {
    quoteNumber: v.string(),
    customer: v.string(),
    customerEmail: v.optional(v.string()),
    vehicle: v.string(),
    date: v.string(),
    expiryDate: v.string(),
    amount: v.number(),
    status: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("quotations", {
      ...args,
      created_at: now,
      updated_at: now,
    });
  },
});
