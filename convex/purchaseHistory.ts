import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("purchaseHistory").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    date: v.string(),
    vehicle: v.string(),
    vin: v.string(),
    price: v.number(),
    seller: v.string(),
    sellerType: v.string(),
    acceptedBy: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("purchaseHistory", {
      ...args,
      created_at: now,
      updated_at: now,
    });
  },
});

export const deleteEntry = mutation({
  args: { id: v.id("purchaseHistory") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
