import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Social Posts
export const listSocialPosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("socialPosts").order("desc").collect();
  },
});

export const createSocialPost = mutation({
  args: {
    vehicleId: v.optional(v.string()),
    vehicleName: v.optional(v.string()),
    platform: v.string(),
    status: v.string(),
    caption: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    scheduledDate: v.optional(v.string()),
    engagement: v.optional(v.object({
      likes: v.number(),
      shares: v.number(),
      comments: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const postId = await ctx.db.insert("socialPosts", {
      ...args,
      created_at: new Date().toISOString(),
    });
    return postId;
  },
});

export const updateSocialPost = mutation({
  args: {
    id: v.id("socialPosts"),
    status: v.optional(v.string()),
    engagement: v.optional(v.object({
      likes: v.number(),
      shares: v.number(),
      comments: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const getSocialStats = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("socialPosts").collect();
    const published = posts.filter(p => p.status === "Published");
    const totalLikes = published.reduce((sum, p) => sum + (p.engagement?.likes || 0), 0);
    const totalShares = published.reduce((sum, p) => sum + (p.engagement?.shares || 0), 0);
    return {
      totalPosts: posts.length,
      publishedPosts: published.length,
      avgLikes: published.length > 0 ? Math.round(totalLikes / published.length) : 0,
      avgShares: published.length > 0 ? Math.round(totalShares / published.length) : 0,
    };
  },
});

// Campaigns
export const listCampaigns = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("campaigns").order("desc").collect();
  },
});

export const createCampaign = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    status: v.string(),
    audience: v.optional(v.string()),
    content: v.optional(v.string()),
    scheduledDate: v.optional(v.string()),
    sent: v.optional(v.number()),
    opened: v.optional(v.number()),
    clicked: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("campaigns", {
      ...args,
      created_at: new Date().toISOString(),
    });
    return id;
  },
});

export const updateCampaign = mutation({
  args: {
    id: v.id("campaigns"),
    status: v.optional(v.string()),
    sent: v.optional(v.number()),
    opened: v.optional(v.number()),
    clicked: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deleteCampaign = mutation({
  args: { id: v.id("campaigns") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getCampaignStats = query({
  args: {},
  handler: async (ctx) => {
    const campaigns = await ctx.db.query("campaigns").collect();
    const active = campaigns.filter(c => c.status === "Active").length;
    const emailsSent = campaigns
      .filter(c => c.type === "Email" && c.sent)
      .reduce((sum, c) => sum + (c.sent || 0), 0);
    const opened = campaigns
      .filter(c => c.type === "Email" && c.opened)
      .reduce((sum, c) => sum + (c.opened || 0), 0);
    const emailsWithOpens = campaigns.filter(c => c.type === "Email" && c.opened && c.sent).length;
    const conversions = campaigns
      .filter(c => c.status === "Completed")
      .length;
    
    return {
      activeCampaigns: active,
      emailsSent,
      avgOpenRate: emailsWithOpens > 0 ? Math.round((opened / campaigns.filter(c => c.sent).reduce((sum, c) => sum + (c.sent || 0), 0)) * 100) : 0,
      conversions,
    };
  },
});

// Tickets
export const listTickets = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tickets").order("desc").collect();
  },
});

export const createTicket = mutation({
  args: {
    subject: v.string(),
    customer: v.string(),
    priority: v.string(),
    status: v.string(),
    description: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tickets = await ctx.db.query("tickets").collect();
    const nextNumber = (tickets.length || 0) + 1;
    const ticketId = `T-${nextNumber.toString().padStart(3, "0")}`;
    
    const id = await ctx.db.insert("tickets", {
      ...args,
      ticketId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return { id, ticketId };
  },
});

export const updateTicket = mutation({
  args: {
    id: v.id("tickets"),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
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

export const getTicketStats = query({
  args: {},
  handler: async (ctx) => {
    const tickets = await ctx.db.query("tickets").collect();
    return {
      open: tickets.filter(t => t.status === "Open").length,
      inProgress: tickets.filter(t => t.status === "In Progress").length,
      resolved: tickets.filter(t => t.status === "Resolved" || t.status === "Closed").length,
      total: tickets.length,
    };
  },
});

// Business Profile Settings
export const getBusinessSettings = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("businessSettings").collect();
    return settings[0] || null;
  },
});

export const saveBusinessSettings = mutation({
  args: {
    id: v.optional(v.id("businessSettings")),
    name: v.optional(v.string()),
    website: v.optional(v.string()),
    license: v.optional(v.string()),
    gst: v.optional(v.string()),
    pst: v.optional(v.string()),
    phone: v.optional(v.string()),
    fax: v.optional(v.string()),
    email: v.optional(v.string()),
    street: v.optional(v.string()),
    city: v.optional(v.string()),
    province: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    country: v.optional(v.string()),
    ownerName: v.optional(v.string()),
    ownerPhone: v.optional(v.string()),
    ownerEmail: v.optional(v.string()),
    downPayment: v.optional(v.number()),
    duration: v.optional(v.number()),
    salesTax: v.optional(v.number()),
    interestRate: v.optional(v.number()),
    frequency: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    fixedCosts: v.optional(v.array(v.object({
      name: v.string(),
      price: v.number(),
      tax: v.boolean(),
    }))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const timestamp = new Date().toISOString();
    
    if (id) {
      await ctx.db.patch(id, { ...updates, updated_at: timestamp });
      return id;
    } else {
      const newId = await ctx.db.insert("businessSettings", { ...updates, created_at: timestamp, updated_at: timestamp });
      return newId;
    }
  },
});

// Users
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.string(),
    avatar: v.optional(v.string()),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("users", {
      ...args,
      created_at: new Date().toISOString(),
    });
    return id;
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.string()),
    avatar: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Tasks
export const listTasks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
    priority: v.string(),
    status: v.string(),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("tasks", {
      ...args,
      created_at: new Date().toISOString(),
    });
    return id;
  },
});

export const updateTask = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
    priority: v.optional(v.string()),
    status: v.optional(v.string()),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
