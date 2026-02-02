import { z } from 'zod';

const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

export const leadSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  phone: z.string().regex(phoneRegex, "Invalid phone number format").optional().or(z.literal("")),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  company: z.string().optional(),
  source: z.enum(['Craigslist', 'Kijiji', 'Text Us', 'Website', 'Referral', 'Other']),
  status: z.enum(['Not Started', 'In Progress', 'Qualified', 'Closed', 'Lost', 'Won']).default('Not Started'),
  vehicle_interest_id: z.string().optional(),
  assigned_to: z.string().optional(), // Allow empty string or undefined
  notes: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;
