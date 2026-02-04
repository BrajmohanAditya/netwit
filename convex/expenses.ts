import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("expenses").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const expenseId = ctx.db.normalizeId("expenses", args.id);
    if (!expenseId) return null;
    return await ctx.db.get(expenseId);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    amount: v.number(),
    date: v.string(),
    vendor: v.optional(v.string()),
    vehicle: v.optional(v.string()),
    receipt: v.optional(v.string()),
    description: v.optional(v.string()),
    taxDeductible: v.boolean(),
  },
  handler: async (ctx, args) => {
    const expenseId = await ctx.db.insert("expenses", {
      ...args,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return expenseId;
  },
});

export const update = mutation({
  args: {
    id: v.id("expenses"),
    title: v.optional(v.string()),
    category: v.optional(v.string()),
    amount: v.optional(v.number()),
    date: v.optional(v.string()),
    vendor: v.optional(v.string()),
    vehicle: v.optional(v.string()),
    receipt: v.optional(v.string()),
    description: v.optional(v.string()),
    taxDeductible: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updated_at: new Date().toISOString(),
    });
  },
});

export const deleteExpense = mutation({
  args: { id: v.id("expenses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const expenses = await ctx.db.query("expenses").collect();
    
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    const thisMonthExpenses = expenses.filter((e) => {
      const date = new Date(e.date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });
    
    const thisYearExpenses = expenses.filter((e) => {
      const date = new Date(e.date);
      return date.getFullYear() === thisYear;
    });
    
    const thisMonthTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const thisYearTotal = thisYearExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    const monthsWithExpenses = new Set(
      expenses.map((e) => new Date(e.date).getMonth())
    ).size || 1;
    
    return {
      thisMonth: thisMonthTotal,
      thisYear: thisYearTotal,
      averageMonthly: thisYearTotal / monthsWithExpenses,
    };
  },
});
