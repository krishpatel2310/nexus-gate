import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiKeysService } from "@/lib/api";
import type { CreateAPIKeyPayload, UpdateAPIKeyPayload } from "@/lib/api";

export const apiKeyKeys = {
  all: ["api-keys"] as const,
  detail: (id: string) => ["api-keys", id] as const,
  byUser: (userId: string) => ["api-keys", "user", userId] as const,
};

export function useAPIKeys() {
  return useQuery({
    queryKey: apiKeyKeys.all,
    queryFn: () => apiKeysService.getAll(),
  });
}

export function useAPIKey(id: string) {
  return useQuery({
    queryKey: apiKeyKeys.detail(id),
    queryFn: () => apiKeysService.getById(id),
    enabled: !!id,
  });
}

export function useAPIKeysByUser(userId: string) {
  return useQuery({
    queryKey: apiKeyKeys.byUser(userId),
    queryFn: () => apiKeysService.getByUserId(userId),
    enabled: !!userId,
  });
}

export function useCreateAPIKey() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreateAPIKeyPayload) => apiKeysService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.all });
    },
  });
}

export function useUpdateAPIKey() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAPIKeyPayload }) =>
      apiKeysService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.all });
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.detail(id) });
    },
  });
}

export function useDeleteAPIKey() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiKeysService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.all });
    },
  });
}

export function useValidateAPIKey() {
  return useMutation({
    mutationFn: (key: string) => apiKeysService.validate(key),
  });
}
