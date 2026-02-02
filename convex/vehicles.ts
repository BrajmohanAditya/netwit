import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("vehicles").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    stockNo: v.string(),
    vin: v.string(),
    year: v.number(),
    make: v.string(),
    model: v.string(),
    trim: v.optional(v.string()),
    status: v.string(),
    price: v.number(),
    cost: v.optional(v.number()),
    mileage: v.number(),
    color: v.string(),
    images: v.array(v.string()),
    features: v.array(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("vehicles", {
      stockNo: args.stockNo,
      vin: args.vin,
      year: args.year,
      make: args.make,
      model: args.model,
      trim: args.trim,
      status: args.status,
      price: args.price,
      cost: args.cost,
      mileage: args.mileage,
      color: args.color,
      images: args.images,
      features: args.features,
      description: args.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  },
});

export const deleteVehicle = mutation({
  args: { id: v.union(v.id("vehicles"), v.string()) },
  handler: async (ctx, args) => {
    const vehicleId =
      typeof args.id === "string"
        ? ctx.db.normalizeId("vehicles", args.id)
        : args.id;

    if (!vehicleId) {
      throw new Error("Invalid vehicle id");
    }

    await ctx.db.delete(vehicleId);
  },
});

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const vehicleId = ctx.db.normalizeId("vehicles", args.id);
    if (!vehicleId) return null;
    return await ctx.db.get(vehicleId);
  },
});

export const update = mutation({
  args: {
    id: v.id("vehicles"),
    stockNo: v.optional(v.string()),
    vin: v.optional(v.string()),
    year: v.optional(v.number()),
    make: v.optional(v.string()),
    model: v.optional(v.string()),
    trim: v.optional(v.string()),
    status: v.optional(v.string()),
    price: v.optional(v.number()),
    cost: v.optional(v.number()),
    mileage: v.optional(v.number()),
    color: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    features: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updated_at: new Date().toISOString(),
    });
  },
});
