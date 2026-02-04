import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const invoices = await ctx.db.query("invoices").collect();
    return invoices.sort((a, b) =>
      (b.invoice_date || "").localeCompare(a.invoice_date || ""),
    );
  },
});

export const create = mutation({
  args: {
    invoice_number: v.string(),
    invoice_date: v.string(),
    due_date: v.string(),
    customer_id: v.optional(v.union(v.id("customers"), v.null())),
    customer_name: v.optional(v.string()),
    package_name: v.optional(v.string()),
    payment_amount: v.number(),
    tax_rate: v.number(),
    tax_amount: v.number(),
    total: v.number(),
    status: v.string(),
    notes: v.optional(v.string()),
    line_items: v.optional(
      v.array(
        v.object({
          description: v.string(),
          amount: v.number(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("invoices", {
      ...args,
      created_at: now,
      updated_at: now,
    });
  },
});

export const markPaid = mutation({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    await ctx.db.patch(args.id, { status: "Paid", updated_at: now });
  },
});
