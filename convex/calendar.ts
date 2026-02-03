import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    // In a real app, you might want args for startDate/endDate range
    return await ctx.db.query("calendarEvents").collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    type: v.string(),
    customer: v.optional(v.string()),
    vehicle: v.optional(v.string()),
    date: v.string(),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    location: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
    description: v.optional(v.string()),
    remindEmail: v.boolean(),
    remindSms: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const { remindEmail, remindSms, ...rest } = args;

    return await ctx.db.insert("calendarEvents", {
      ...rest,
      reminders: {
        email: remindEmail,
        sms: remindSms,
      },
      created_at: now,
      updated_at: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("calendarEvents"),
    title: v.optional(v.string()),
    type: v.optional(v.string()),
    customer: v.optional(v.string()),
    vehicle: v.optional(v.string()),
    date: v.optional(v.string()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    location: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
    description: v.optional(v.string()),
    remindEmail: v.optional(v.boolean()),
    remindSms: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, remindEmail, remindSms, ...rest } = args;
    const now = new Date().toISOString();

    const updates: any = {
      ...rest,
      updated_at: now,
    };

    if (remindEmail !== undefined || remindSms !== undefined) {
      // Fetch current to merge reminders if needed, but for now simple overwrite
      // assuming we pass both or handle partials carefully.
      // To be safe let's just create the object if either is passed,
      // relying on frontend to pass current state or defaults.
      // Or cleaner: just update specific fields if the specific arg is present.
      // Simpler implementation for this demo:
      // We can't easily patch a nested object partially without reading first or full replacement.
      // Let's read the existing record first.
      const existing = await ctx.db.get(id);
      if (existing) {
        const currentReminders = existing.reminders || {
          email: false,
          sms: false,
        };
        updates.reminders = {
          email: remindEmail ?? currentReminders.email,
          sms: remindSms ?? currentReminders.sms,
        };
      }
    }

    await ctx.db.patch(id, updates);
  },
});

export const deleteEvent = mutation({
  args: { id: v.id("calendarEvents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
