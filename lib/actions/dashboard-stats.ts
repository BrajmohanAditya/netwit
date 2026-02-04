export async function getFinancialTransactions() {
  return [];
}

export async function getInventoryStats() {
  return [
    { status: 'Active', count: 0 },
    { status: 'Sold', count: 0 },
    { status: 'Inactive', count: 0 },
  ];
}

export async function getRevenueData() {
  return [
    { month: 'Jan', revenue: 0 },
    { month: 'Feb', revenue: 0 },
    { month: 'Mar', revenue: 0 },
    { month: 'Apr', revenue: 0 },
    { month: 'May', revenue: 0 },
    { month: 'Jun', revenue: 0 },
  ];
}

export async function getRecentLeads(limit: number = 5) {
  return [];
}
