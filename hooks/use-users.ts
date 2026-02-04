import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";

export function useUsers() {
  const convex = useConvex();

  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await convex.query(api.marketing.listUsers) as Array<{
        _id: string;
        _creationTime: number;
        name: string;
        email: string;
        role: string;
        avatar?: string;
        status: string;
        created_at: string;
      }>;
    },
  });
}

export function useCreateUser() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: {
      name: string;
      email: string;
      role: string;
      avatar?: string;
      status: string;
    }) => {
      return await convex.mutation(api.marketing.createUser, user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUser() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: {
      id: string;
      name?: string;
      email?: string;
      role?: string;
      avatar?: string;
      status?: string;
    }) => {
      return await convex.mutation(api.marketing.updateUser, user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await convex.mutation(api.marketing.deleteUser, { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
