import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";

export function useSocialPosts() {
  const convex = useConvex();

  return useQuery({
    queryKey: ["socialPosts"],
    queryFn: async () => {
      const result = await convex.query(api.marketing.listSocialPosts);
      return result as Array<{
        _id: string;
        _creationTime: number;
        vehicleId?: string;
        vehicleName?: string;
        platform: string;
        status: string;
        caption?: string;
        imageUrl?: string;
        scheduledDate?: string;
        engagement?: { likes: number; shares: number; comments: number };
        created_at: string;
      }>;
    },
  });
}

export function useSocialStats() {
  const convex = useConvex();

  return useQuery({
    queryKey: ["socialStats"],
    queryFn: async () => {
      return await convex.query(api.marketing.getSocialStats) as {
        totalPosts: number;
        publishedPosts: number;
        avgLikes: number;
        avgShares: number;
      };
    },
  });
}

export function useCreateSocialPost() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: {
      vehicleId?: string;
      vehicleName?: string;
      platform: string;
      status: string;
      caption?: string;
      imageUrl?: string;
      scheduledDate?: string;
    }) => {
      return await convex.mutation(api.marketing.createSocialPost, post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialPosts"] });
      queryClient.invalidateQueries({ queryKey: ["socialStats"] });
    },
  });
}

export function useCampaigns() {
  const convex = useConvex();

  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      return await convex.query(api.marketing.listCampaigns) as Array<{
        _id: string;
        _creationTime: number;
        name: string;
        type: string;
        status: string;
        audience?: string;
        sent?: number;
        opened?: number;
        clicked?: number;
        created_at: string;
      }>;
    },
  });
}

export function useCampaignStats() {
  const convex = useConvex();

  return useQuery({
    queryKey: ["campaignStats"],
    queryFn: async () => {
      return await convex.query(api.marketing.getCampaignStats) as {
        activeCampaigns: number;
        emailsSent: number;
        avgOpenRate: number;
        conversions: number;
      };
    },
  });
}

export function useCreateCampaign() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaign: {
      name: string;
      type: string;
      status: string;
      audience?: string;
      content?: string;
      scheduledDate?: string;
    }) => {
      return await convex.mutation(api.marketing.createCampaign, campaign);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaignStats"] });
    },
  });
}

export function useDeleteCampaign() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await convex.mutation(api.marketing.deleteCampaign, { id: id as Id<"campaigns"> });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaignStats"] });
    },
  });
}

export function useTickets() {
  const convex = useConvex();

  return useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      return await convex.query(api.marketing.listTickets) as Array<{
        _id: string;
        _creationTime: number;
        ticketId: string;
        subject: string;
        customer: string;
        priority: string;
        status: string;
        description?: string;
        assignedTo?: string;
        created_at: string;
        updated_at: string;
      }>;
    },
  });
}

export function useTicketStats() {
  const convex = useConvex();

  return useQuery({
    queryKey: ["ticketStats"],
    queryFn: async () => {
      return await convex.query(api.marketing.getTicketStats) as {
        open: number;
        inProgress: number;
        resolved: number;
        total: number;
      };
    },
  });
}

export function useCreateTicket() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ticket: {
      subject: string;
      customer: string;
      priority: string;
      status: string;
      description?: string;
      assignedTo?: string;
    }) => {
      return await convex.mutation(api.marketing.createTicket, ticket);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticketStats"] });
    },
  });
}

export function useBusinessSettings() {
  const convex = useConvex();

  return useQuery({
    queryKey: ["businessSettings"],
    queryFn: async () => {
      return await convex.query(api.marketing.getBusinessSettings) as {
        _id?: string;
        name?: string;
        website?: string;
        license?: string;
        gst?: string;
        pst?: string;
        phone?: string;
        fax?: string;
        email?: string;
        street?: string;
        city?: string;
        province?: string;
        postalCode?: string;
        country?: string;
        ownerName?: string;
        ownerPhone?: string;
        ownerEmail?: string;
        downPayment?: number;
        duration?: number;
        salesTax?: number;
        interestRate?: number;
        frequency?: string;
        logoUrl?: string;
        fixedCosts?: Array<{ name: string; price: number; tax: boolean }>;
      } | null;
    },
  });
}

export function useSaveBusinessSettings() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: {
      id?: string;
      name?: string;
      website?: string;
      license?: string;
      gst?: string;
      pst?: string;
      phone?: string;
      fax?: string;
      email?: string;
      street?: string;
      city?: string;
      province?: string;
      postalCode?: string;
      country?: string;
      ownerName?: string;
      ownerPhone?: string;
      ownerEmail?: string;
      downPayment?: number;
      duration?: number;
      salesTax?: number;
      interestRate?: number;
      frequency?: string;
      logoUrl?: string;
      fixedCosts?: Array<{ name: string; price: number; tax: boolean }>;
    }) => {
      return await convex.mutation(api.marketing.saveBusinessSettings, settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businessSettings"] });
    },
  });
}
