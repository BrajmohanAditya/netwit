import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

export const get = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("deals")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    }
    return await ctx.db.query("deals").collect();
  },
});

export const getByIdOrNumber = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    let direct: Id<"deals"> | null = null;
    try {
      const doc = await ctx.db.get(args.id as Id<"deals">);
      if (doc) return doc;
    } catch {
      // Ignore invalid id formats and fall back to dealNumber.
      direct = null;
    }

    const match = await ctx.db
      .query("deals")
      .withIndex("by_dealNumber", (q) => q.eq("dealNumber", args.id))
      .first();

    return match ?? null;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    value: v.number(),
    customer: v.string(),
    status: v.string(),
    dealNumber: v.optional(v.string()),
    vehicleId: v.optional(v.string()),
    customerId: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("deals", {
      ...args,
      created_at: now,
      updated_at: now,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("deals"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    await ctx.db.patch(args.id, {
      status: args.status,
      updated_at: now,
    });
  },
});

export const deleteDeal = mutation({
  args: { id: v.id("deals") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
