import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("testDrives").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    customerName: v.string(),
    vehicleName: v.string(),
    date: v.string(),
    time: v.string(),
    staffName: v.string(),
    status: v.string(),
    interest: v.number(),
    nextSteps: v.optional(v.string()),
    leadId: v.optional(v.string()),
    duration: v.optional(v.string()),
    route: v.optional(v.string()),
    licenseNumber: v.optional(v.string()),
    licenseIssued: v.optional(v.string()),
    licenseExpires: v.optional(v.string()),
    insuranceVerified: v.optional(v.boolean()),
    comments: v.optional(v.string()),
    staffNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("testDrives", {
      ...args,
      created_at: now,
      updated_at: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("testDrives"),
    customerName: v.optional(v.string()),
    vehicleName: v.optional(v.string()),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    staffName: v.optional(v.string()),
    status: v.optional(v.string()),
    interest: v.optional(v.number()),
    nextSteps: v.optional(v.string()),
    leadId: v.optional(v.string()),
    duration: v.optional(v.string()),
    route: v.optional(v.string()),
    licenseNumber: v.optional(v.string()),
    licenseIssued: v.optional(v.string()),
    licenseExpires: v.optional(v.string()),
    insuranceVerified: v.optional(v.boolean()),
    comments: v.optional(v.string()),
    staffNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const now = new Date().toISOString();
    await ctx.db.patch(id, {
      ...updates,
      updated_at: now,
    });
  },
});

export const requestTestDrive = mutation({
  args: {
    customerName: v.string(),
    vehicleName: v.string(),
    date: v.string(),
    time: v.string(),
    staffName: v.string(),
    contactMethod: v.string(), // e.g. "phone", "email"
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    // Default values for a requested test drive
    return await ctx.db.insert("testDrives", {
      customerName: args.customerName,
      vehicleName: args.vehicleName,
      date: args.date,
      time: args.time,
      staffName: args.staffName,
      status: "Requested",
      interest: 0,
      nextSteps: "Review Request",
      created_at: now,
      updated_at: now,
    });
  },
});

export const deleteDrive = mutation({
  args: { id: v.id("testDrives") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
