import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export interface DashboardMetrics {
  todaysLeads: number;
  leadsChange: number;
  newInventory: number;
  totalInventory: number;
  activeDeals: number;
  pipelineValue: number;
  testDrivesToday: number;
  testDrivesWeek: number;
  dealsClosedMonth: number;
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
  const weekStart = new Date(Date.now() - 7 * 86400000)
    .toISOString()
    .split("T")[0];

  try {
    // Get today's leads
    const { data: todayLeads, error: leadsError } = await supabase
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

    // Get total inventory
    const { data: totalVehicles } = await supabase
      .from("vehicles")
      .select("id")
      .eq("status", "active");

    // Get active deals
    const { data: activeDealsData } = await supabase
      .from("deals")
      .select("id, expected_value")
      .eq("status", "in_progress");

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

    const todaysLeadsCount = todayLeads?.length || 0;
    const yesterdaysLeadsCount = yesterdayLeads?.length || 0;
    const leadsChange =
      yesterdaysLeadsCount > 0
        ? Math.round(
            ((todaysLeadsCount - yesterdaysLeadsCount) / yesterdaysLeadsCount) *
              100,
          )
        : 0;

    const pipelineValue =
      activeDealsData?.reduce(
        (sum, deal) => sum + (deal.expected_value || 0),
        0,
      ) || 0;
    const revenueMonth =
      dealsClosedData?.reduce(
        (sum, deal) => sum + (deal.final_value || 0),
        0,
      ) || 0;

    return {
      todaysLeads: todaysLeadsCount,
      leadsChange: leadsChange,
      newInventory: newVehicles?.length || 0,
      totalInventory: totalVehicles?.length || 0,
      activeDeals: activeDealsData?.length || 0,
      pipelineValue: pipelineValue,
      testDrivesToday: testDrivesToday?.length || 0,
      testDrivesWeek: testDrivesWeek?.length || 0,
      dealsClosedMonth: dealsClosedData?.length || 0,
      revenueMonth: revenueMonth,
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    throw error;
  }
}
