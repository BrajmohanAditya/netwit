import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";

export function useTasks() {
  const convex = useConvex();

  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      return await convex.query(api.marketing.listTasks) as Array<{
        _id: string;
        _creationTime: number;
        title: string;
        description?: string;
        assignedTo?: string;
        priority: string;
        status: string;
        dueDate?: string;
        created_at: string;
      }>;
    },
  });
}

export function useCreateTask() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: {
      title: string;
      description?: string;
      assignedTo?: string;
      priority: string;
      status: string;
      dueDate?: string;
    }) => {
      return await convex.mutation(api.marketing.createTask, task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: {
      id: string;
      title?: string;
      description?: string;
      assignedTo?: string;
      priority?: string;
      status?: string;
      dueDate?: string;
    }) => {
      return await convex.mutation(api.marketing.updateTask, task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTask() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await convex.mutation(api.marketing.deleteTask, { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
