'use server';

export async function sendLeadSms(leadId: string, message: string) {
  return { success: false, error: 'SMS service requires Convex integration' };
}
