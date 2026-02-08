import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createSession = mutation({
  args: {
    sessionId: v.string(),
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("sessions", {
      sessionId: args.sessionId,
      userId: args.userId,
      email: args.email,
      name: args.name,
      role: args.role,
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  },
});

export const getSession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .filter((q) => q.eq(q.field("sessionId"), args.sessionId))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }
    return session;
  },
});

export const deleteSession = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .filter((q) => q.eq(q.field("sessionId"), args.sessionId))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});

export const createUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.email || !args.password || !args.name || !args.role) {
      throw new Error("Missing required fields");
    }

    if (!args.email.includes("@")) {
      throw new Error("Invalid email format");
    }

    if (args.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("EMAIL_EXISTS");
    }

    const result = await ctx.db.insert("users", {
      email: args.email,
      password: args.password,
      name: args.name,
      role: args.role,
      status: "Active",
      created_at: new Date().toISOString(),
    });

    return result;
  },
});

export const validateUser = query({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user || user.password !== args.password) {
      return null;
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },
});

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const deleteAllUsers = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
      await ctx.db.delete(user._id);
    }
    return { deleted: users.length };
  },
});

export const deleteAllSessions = mutation({
  args: {},
  handler: async (ctx) => {
    const sessions = await ctx.db.query("sessions").collect();
    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }
    return { deleted: sessions.length };
  },
});
