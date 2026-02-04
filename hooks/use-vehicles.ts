import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';

export function useVehicles() {
  const convex = useConvex();

  return useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      return await convex.query(api.vehicles.get);
    }
  });
}

export function useCreateVehicle() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicle: {
      stockNo: string;
      vin: string;
      year: number;
      make: string;
      model: string;
      trim?: string;
      status: string;
      price: number;
      cost?: number;
      mileage: number;
      color: string;
      images: string[];
      features: string[];
      description?: string;
    }) => {
      return await convex.mutation(api.vehicles.create, vehicle);
    },
    onMutate: async (newVehicle) => {
      await queryClient.cancelQueries({ queryKey: ['vehicles'] });

      const previousVehicles = queryClient.getQueryData(['vehicles']) || [];
      queryClient.setQueryData(['vehicles'], (old: any) => [newVehicle, ...old]);

      return { previousVehicles };
    },
    onError: (err, newVehicle, context) => {
      queryClient.setQueryData(['vehicles'], context?.previousVehicles);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    }
  });
}

export function useUpdateVehicle() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, vehicle }: { id: string; vehicle: any }) => {
      return await convex.mutation(api.vehicles.update, { id, ...vehicle });
    },
    onMutate: async ({ id, vehicle }) => {
      await queryClient.cancelQueries({ queryKey: ['vehicles'] });

      const previousVehicles = queryClient.getQueryData(['vehicles']);
      queryClient.setQueryData(['vehicles'], (old: any) =>
        old.map((v: any) => v._id === id ? { ...v, ...vehicle } : v)
      );

      return { previousVehicles };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['vehicles'], context?.previousVehicles);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    }
  });
}

export function useDeleteVehicle() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await convex.mutation(api.vehicles.deleteVehicle, { id });
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['vehicles'] });

      const previousVehicles = queryClient.getQueryData(['vehicles']);
      queryClient.setQueryData(['vehicles'], (old: any) =>
        old.filter((v: any) => v._id !== id)
      );

      return { previousVehicles };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['vehicles'], context?.previousVehicles);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    }
  });
}
