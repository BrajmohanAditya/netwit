import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("followUps").collect();
  },
});

export const create = mutation({
  args: {
    customer: v.string(),
    lead: v.string(),
    dueDate: v.string(),
    time: v.string(),
    channel: v.string(),
    assignedTo: v.string(),
    status: v.string(),
    priority: v.string(),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("followUps", {
      ...args,
      created_at: now,
      updated_at: now,
    });
  },
});

export const deleteFollowUp = mutation({
  args: { id: v.id("followUps") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateStatus = mutation({
  args: { id: v.id("followUps"), status: v.string() },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    await ctx.db.patch(args.id, {
      status: args.status,
      updated_at: now,
    });
  },
});
