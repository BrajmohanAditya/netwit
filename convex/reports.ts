import { v } from "convex/values";
import { query } from "./_generated/server";

export const getSalesSummary = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    salesperson: v.optional(v.string()),
    vehicleMake: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const invoices = await ctx.db.query("invoices").collect();
    const deals = await ctx.db.query("deals").collect();
    const vehicles = await ctx.db.query("vehicles").collect();
    const leads = await ctx.db.query("leads").collect();

    const startDate = args.startDate ? new Date(args.startDate) : new Date(0);
    const endDate = args.endDate ? new Date(args.endDate) : new Date();

    const filteredInvoices = invoices.filter((inv) => {
      const invDate = new Date(inv.invoice_date);
      return invDate >= startDate && invDate <= endDate;
    });

    const filteredDeals = deals.filter((deal) => {
      const dealDate = new Date(deal.created_at);
      return dealDate >= startDate && dealDate <= endDate;
    });

    const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalDeals = filteredDeals.length;
    const avgDeal = totalDeals > 0 ? totalRevenue / totalDeals : 0;

    const vehiclesSold = filteredDeals.filter((d) => d.status === "Closed" || d.status === "Paid Off");
    const vehiclesSoldCount = vehiclesSold.length;
    const vehiclesByMake: Record<string, number> = {};
    vehiclesSold.forEach((v) => {
      const vehicle = vehicles.find((veh) => veh.vin === v.vehicleId);
      if (vehicle) {
        vehiclesByMake[vehicle.make] = (vehiclesByMake[vehicle.make] || 0) + 1;
      }
    });

    const topMake = Object.entries(vehiclesByMake).sort((a, b) => b[1] - a[1])[0];

    return {
      totalRevenue,
      totalDeals,
      avgDeal,
      vehiclesSoldCount,
      topMake: topMake ? { make: topMake[0], count: topMake[1] } : null,
      invoiceCount: filteredInvoices.length,
      leadCount: leads.length,
    };
  },
});

export const getInventoryAging = query({
  args: {},
  handler: async (ctx) => {
    const vehicles = await ctx.db.query("vehicles").collect();
    const now = new Date();

    const agingData = vehicles.map((v) => {
      const createdDate = new Date(v.created_at);
      const daysOld = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      return {
        id: v._id,
        vin: v.vin,
        make: v.make,
        model: v.model,
        year: v.year,
        status: v.status,
        daysOld,
        price: v.price,
        cost: v.cost || 0,
      };
    });

    const agingBuckets = {
      "0-30": 0,
      "31-60": 0,
      "61-90": 0,
      "90+": 0,
    };

    agingData.forEach((v) => {
      if (v.daysOld <= 30) agingBuckets["0-30"]++;
      else if (v.daysOld <= 60) agingBuckets["31-60"]++;
      else if (v.daysOld <= 90) agingBuckets["61-90"]++;
      else agingBuckets["90+"]++;
    });

    const totalValue = vehicles
      .filter((v) => v.status === "Available" || v.status === "Active")
      .reduce((sum, v) => sum + v.price, 0);

    const totalCost = vehicles
      .filter((v) => v.status === "Available" || v.status === "Active")
      .reduce((sum, v) => sum + (v.cost || 0), 0);

    return {
      vehicles: agingData.sort((a, b) => b.daysOld - a.daysOld),
      agingBuckets,
      totalInventory: vehicles.length,
      totalValue,
      totalCost,
      potentialProfit: totalValue - totalCost,
    };
  },
});

export const getFinancialSummary = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const invoices = await ctx.db.query("invoices").collect();
    const expenses = await ctx.db.query("expenses").collect();
    const deals = await ctx.db.query("deals").collect();

    const startDate = args.startDate ? new Date(args.startDate) : new Date(0);
    const endDate = args.endDate ? new Date(args.endDate) : new Date();

    const filteredInvoices = invoices.filter((inv) => {
      const invDate = new Date(inv.invoice_date);
      return invDate >= startDate && invDate <= endDate;
    });

    const filteredExpenses = expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate >= startDate && expDate <= endDate;
    });

    const totalIncome = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    const expensesByCategory: Record<string, number> = {};
    filteredExpenses.forEach((exp) => {
      expensesByCategory[exp.category] = (expensesByCategory[exp.category] || 0) + exp.amount;
    });

    const totalVehicleCost = deals
      .filter((d) => d.status === "Closed" || d.status === "Paid Off")
      .reduce((sum, d) => sum + (d.value || 0), 0);

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      invoiceCount: filteredInvoices.length,
      expenseCount: filteredExpenses.length,
      expensesByCategory: Object.entries(expensesByCategory).map(([category, amount]) => ({
        category,
        amount,
      })),
      dealCount: deals.length,
      closedDeals: deals.filter((d) => d.status === "Closed" || d.status === "Paid Off").length,
    };
  },
});

export const getSalespersonPerformance = query({
  args: {},
  handler: async (ctx) => {
    const deals = await ctx.db.query("deals").collect();
    const leads = await ctx.db.query("leads").collect();
    const testDrives = await ctx.db.query("testDrives").collect();

    const salespersonStats: Record<string, {
      name: string;
      deals: number;
      revenue: number;
      leads: number;
      testDrives: number;
    }> = {};

    deals.forEach((deal) => {
      const name = deal.customer || "Unknown";
      if (!salespersonStats[name]) {
        salespersonStats[name] = { name, deals: 0, revenue: 0, leads: 0, testDrives: 0 };
      }
      salespersonStats[name].deals++;
      salespersonStats[name].revenue += deal.value || 0;
    });

    leads.forEach((lead) => {
      const name = lead.assigned_to || lead.name || "Unassigned";
      if (!salespersonStats[name]) {
        salespersonStats[name] = { name, deals: 0, revenue: 0, leads: 0, testDrives: 0 };
      }
      salespersonStats[name].leads++;
    });

    testDrives.forEach((td) => {
      const name = td.staffName || "Unknown";
      if (!salespersonStats[name]) {
        salespersonStats[name] = { name, deals: 0, revenue: 0, leads: 0, testDrives: 0 };
      }
      salespersonStats[name].testDrives++;
    });

    return Object.values(salespersonStats).sort((a, b) => b.revenue - a.revenue);
  },
});

export const getCustomerAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const customers = await ctx.db.query("customers").collect();
    const leads = await ctx.db.query("leads").collect();
    const invoices = await ctx.db.query("invoices").collect();
    const testDrives = await ctx.db.query("testDrives").collect();

    const customerStats = customers.map((customer) => {
      const customerLeads = leads.filter((l) => l.customer_id === customer._id);
      const customerInvoices = invoices.filter((inv) => inv.customer_id === customer._id);
      const customerTestDrives = testDrives.filter((td) => td.customerName === customer.name);

      const totalSpent = customerInvoices.reduce((sum, inv) => sum + inv.total, 0);
      const leadCount = customerLeads.length;
      const testDriveCount = customerTestDrives.length;

      return {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        totalSpent,
        leadCount,
        testDriveCount,
        status: customer.status || "Active",
      };
    });

    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c) => c.status !== "Inactive").length;
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const avgCustomerValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

    const leadsBySource: Record<string, number> = {};
    leads.forEach((lead) => {
      leadsBySource[lead.source] = (leadsBySource[lead.source] || 0) + 1;
    });

    return {
      customers: customerStats.sort((a, b) => b.totalSpent - a.totalSpent),
      totalCustomers,
      activeCustomers,
      totalRevenue,
      avgCustomerValue,
      leadsBySource: Object.entries(leadsBySource).map(([source, count]) => ({ source, count })),
    };
  },
});
