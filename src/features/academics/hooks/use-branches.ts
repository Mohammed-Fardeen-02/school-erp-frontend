import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BranchesApi } from '../api/branches.api';
import type { SaveBranchPayload, BranchQueryFilters } from '../types/branches.types';

export function useBranches(filters: BranchQueryFilters = {}) {
  return useQuery({
    queryKey: ['branches', filters],
    queryFn: () => BranchesApi.list(filters),
  });
}

export function useBranch(id?: string) {
  return useQuery({
    queryKey: ['branches', id],
    queryFn: () => (id ? BranchesApi.getById(id) : null),
    enabled: Boolean(id),
  });
}

export function useSaveBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, id }: { payload: SaveBranchPayload; id?: string }) =>
      BranchesApi.save(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'campuses'] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });
}

export function useSetMainBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => BranchesApi.setMainBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'campuses'] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });
}

export function useToggleBranchStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      BranchesApi.toggleStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'campuses'] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });
}

export function useDeleteBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => BranchesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'campuses'] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });
}

