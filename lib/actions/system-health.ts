'use server';

export interface SystemHealthStatus {
  inventory: 'OK' | 'ERROR';
  crm: 'OK' | 'ERROR';
  finance: 'OK' | 'ERROR';
  latency: string;
  orphanLeads: number;
  orphanTestDrives: number;
  corruptedRecords: number;
  errors?: {
    inventory?: string;
    crm?: string;
    finance?: string;
  };
}

export async function checkDatabaseIntegrity(): Promise<SystemHealthStatus> {
  return {
    inventory: 'OK',
    crm: 'OK',
    finance: 'OK',
    latency: '0ms',
    orphanLeads: 0,
    orphanTestDrives: 0,
    corruptedRecords: 0,
  };
}

export async function getTableCounts() {
  return {
    vehicles: 0,
    leads: 0,
    invoices: 0,
    users: 0,
    test_drives: 0,
    sales_deals: 0,
  };
}
