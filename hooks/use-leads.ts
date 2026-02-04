import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';

export function useLeads() {
  const convex = useConvex();

  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      return await convex.query(api.leads.get);
    }
  });
}

export function useCreateLead() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lead: {
      name: string;
      email?: string;
      phone?: string;
      company?: string;
      source: string;
      sourceDetails?: string;
      status: string;
      vehicleInterest?: string;
      notes?: string;
      assignedTo?: string;
    }) => {
      return await convex.mutation(api.leads.create, lead);
    },
    onMutate: async (newLead) => {
      await queryClient.cancelQueries({ queryKey: ['leads'] });

      const previousLeads = queryClient.getQueryData(['leads']) || [];
      queryClient.setQueryData(['leads'], (old: any) => [newLead, ...old]);

      return { previousLeads };
    },
    onError: (err, newLead, context) => {
      queryClient.setQueryData(['leads'], context?.previousLeads);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });
}

export function useDeleteLead() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await convex.mutation(api.leads.deleteLead, { id });
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['leads'] });

      const previousLeads = queryClient.getQueryData(['leads']);
      queryClient.setQueryData(['leads'], (old: any) =>
        old.filter((lead: any) => lead._id !== id)
      );

      return { previousLeads };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['leads'], context?.previousLeads);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });
}
