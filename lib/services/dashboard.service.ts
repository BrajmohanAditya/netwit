import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export interface DashboardMetrics {
  todaysLeads: number;
  leadsChange: number;
  newInventory: number;
  newInventoryChange: number;
  totalInventory: number;
  activeDeals: number;
  activeDealsChange: number;
  pipelineValue: number;
  testDrivesToday: number;
  testDrivesWeek: number;
  dealsClosedMonth: number;
  dealsClosedMonthChange: number;
  revenueMonth: number;
}

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const monthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  )
    .toISOString()
    .split("T")[0];
  const lastMonthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 1,
    1,
  )
    .toISOString()
    .split("T")[0];
  const lastMonthEnd = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    0,
  )
    .toISOString()
    .split("T")[0];
  const weekStart = new Date(Date.now() - 7 * 86400000)
    .toISOString()
    .split("T")[0];
  const lastWeekStart = new Date(Date.now() - 14 * 86400000)
    .toISOString()
    .split("T")[0];
  const lastWeekEnd = new Date(Date.now() - 7 * 86400000)
    .toISOString()
    .split("T")[0];
  const lastPeriodStart = new Date(Date.now() - 14 * 86400000)
    .toISOString()
    .split("T")[0];
  const lastPeriodEnd = new Date(Date.now() - 7 * 86400000)
    .toISOString()
    .split("T")[0];

  try {
    // Get today's leads
    const { data: todayLeads } = await supabase
      .from("leads")
      .select("id")
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`);

    // Get yesterday's leads for comparison
    const { data: yesterdayLeads } = await supabase
      .from("leads")
      .select("id")
      .gte("created_at", `${yesterday}T00:00:00`)
      .lte("created_at", `${yesterday}T23:59:59`);

    // Get new inventory this week
    const { data: newVehicles } = await supabase
      .from("vehicles")
      .select("id")
      .gte("created_at", `${weekStart}T00:00:00`);

    // Get new inventory last week for comparison
    const { data: lastWeekVehicles } = await supabase
      .from("vehicles")
      .select("id")
      .gte("created_at", `${lastWeekStart}T00:00:00`)
      .lte("created_at", `${lastWeekEnd}T23:59:59`);

    // Get total inventory
    const { data: totalVehicles } = await supabase
      .from("vehicles")
      .select("id")
      .eq("status", "active");

    // Get active deals (current period)
    const { data: activeDealsData } = await supabase
      .from("deals")
      .select("id, expected_value")
      .eq("status", "in_progress");

    // Get active deals from previous period for comparison
    const { data: lastPeriodDealsData } = await supabase
      .from("deals")
      .select("id, expected_value")
      .eq("status", "in_progress")
      .gte("created_at", `${lastPeriodStart}T00:00:00`)
      .lte("created_at", `${lastPeriodEnd}T23:59:59`);

    // Get test drives today
    const { data: testDrivesToday } = await supabase
      .from("test_drives")
      .select("id")
      .gte("scheduled_date", `${today}T00:00:00`)
      .lte("scheduled_date", `${today}T23:59:59`);

    // Get test drives this week
    const { data: testDrivesWeek } = await supabase
      .from("test_drives")
      .select("id")
      .gte("scheduled_date", `${weekStart}T00:00:00`);

    // Get deals closed this month
    const { data: dealsClosedData } = await supabase
      .from("deals")
      .select("id, final_value")
      .eq("status", "closed")
      .gte("closed_date", monthStart);

    // Get deals closed last month for comparison
    const { data: lastMonthDealsData } = await supabase
      .from("deals")
      .select("id, final_value")
      .eq("status", "closed")
      .gte("closed_date", lastMonthStart)
      .lte("closed_date", lastMonthEnd);

    const todaysLeadsCount = todayLeads?.length || 0;
    const yesterdaysLeadsCount = yesterdayLeads?.length || 0;
    const leadsChange =
      yesterdaysLeadsCount > 0
        ? Math.round(
            ((todaysLeadsCount - yesterdaysLeadsCount) / yesterdaysLeadsCount) *
              100,
          )
        : 0;

    const newInventoryCount = newVehicles?.length || 0;
    const lastWeekInventoryCount = lastWeekVehicles?.length || 0;
    const newInventoryChange =
      lastWeekInventoryCount > 0
        ? Math.round(
            ((newInventoryCount - lastWeekInventoryCount) /
              lastWeekInventoryCount) *
              100,
          )
        : 0;

    const activeDealsCount = activeDealsData?.length || 0;
    const lastPeriodDealsCount = lastPeriodDealsData?.length || 0;
    const activeDealsChange =
      lastPeriodDealsCount > 0
        ? Math.round(
            ((activeDealsCount - lastPeriodDealsCount) / lastPeriodDealsCount) *
              100,
          )
        : 0;

    const pipelineValue =
      activeDealsData?.reduce(
        (sum, deal) => sum + (deal.expected_value || 0),
        0,
      ) || 0;

    const dealsClosedMonthCount = dealsClosedData?.length || 0;
    const lastMonthDealsCount = lastMonthDealsData?.length || 0;
    const dealsClosedMonthChange =
      lastMonthDealsCount > 0
        ? Math.round(
            ((dealsClosedMonthCount - lastMonthDealsCount) /
              lastMonthDealsCount) *
              100,
          )
        : 0;

    const revenueMonth =
      dealsClosedData?.reduce(
        (sum, deal) => sum + (deal.final_value || 0),
        0,
      ) || 0;

    return {
      todaysLeads: todaysLeadsCount,
      leadsChange: leadsChange,
      newInventory: newInventoryCount,
      newInventoryChange: newInventoryChange,
      totalInventory: totalVehicles?.length || 0,
      activeDeals: activeDealsCount,
      activeDealsChange: activeDealsChange,
      pipelineValue: pipelineValue,
      testDrivesToday: testDrivesToday?.length || 0,
      testDrivesWeek: testDrivesWeek?.length || 0,
      dealsClosedMonth: dealsClosedMonthCount,
      dealsClosedMonthChange: dealsClosedMonthChange,
      revenueMonth: revenueMonth,
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    throw error;
  }
}
