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

export function getEmptyMetrics(): DashboardMetrics {
  return {
    todaysLeads: 0,
    leadsChange: 0,
    newInventory: 0,
    newInventoryChange: 0,
    totalInventory: 0,
    activeDeals: 0,
    activeDealsChange: 0,
    pipelineValue: 0,
    testDrivesToday: 0,
    testDrivesWeek: 0,
    dealsClosedMonth: 0,
    dealsClosedMonthChange: 0,
    revenueMonth: 0,
  };
}

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  return getEmptyMetrics();
}
