import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";

export interface Expense {
  _id: string;
  _creationTime: number;
  title: string;
  category: string;
  amount: number;
  date: string;
  vendor?: string;
  vehicle?: string;
  receipt?: string;
  description?: string;
  taxDeductible: boolean;
  created_at: string;
  updated_at: string;
}

export function useExpenses() {
  const convex = useConvex();

  return useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      return await convex.query(api.expenses.list) as Expense[];
    },
  });
}

export function useExpenseStats() {
  const convex = useConvex();

  return useQuery({
    queryKey: ["expenseStats"],
    queryFn: async () => {
      return await convex.query(api.expenses.getStats);
    },
  });
}

export function useCreateExpense() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: {
      title: string;
      category: string;
      amount: number;
      date: string;
      vendor?: string;
      vehicle?: string;
      receipt?: string;
      description?: string;
      taxDeductible: boolean;
    }) => {
      return await convex.mutation(api.expenses.create, expense);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenseStats"] });
    },
  });
}

export function useUpdateExpense() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: {
      id: string;
      title?: string;
      category?: string;
      amount?: number;
      date?: string;
      vendor?: string;
      vehicle?: string;
      receipt?: string;
      description?: string;
      taxDeductible?: boolean;
    }) => {
      const { id, ...updates } = expense;
      return await convex.mutation(api.expenses.update, {
        id: id as Id<"expenses">,
        ...updates,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenseStats"] });
    },
  });
}

export function useDeleteExpense() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await convex.mutation(api.expenses.deleteExpense, { id: id as Id<"expenses"> });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenseStats"] });
    },
  });
}
