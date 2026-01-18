import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rateLimitsService } from "@/lib/api";
import type { CreateRateLimitPayload, UpdateRateLimitPayload } from "@/lib/api";

export const rateLimitKeys = {
  all: ["rate-limits"] as const,
  detail: (id: string) => ["rate-limits", id] as const,
  byApiKey: (apiKeyId: string) => ["rate-limits", "api-key", apiKeyId] as const,
  byServiceRoute: (routeId: string) => ["rate-limits", "service-route", routeId] as const,
};

export function useRateLimits() {
  return useQuery({
    queryKey: rateLimitKeys.all,
    queryFn: () => rateLimitsService.getAll(),
  });
}

export function useRateLimit(id: string) {
  return useQuery({
    queryKey: rateLimitKeys.detail(id),
    queryFn: () => rateLimitsService.getById(id),
    enabled: !!id,
  });
}

export function useRateLimitsByApiKey(apiKeyId: string) {
  return useQuery({
    queryKey: rateLimitKeys.byApiKey(apiKeyId),
    queryFn: () => rateLimitsService.getByApiKey(apiKeyId),
    enabled: !!apiKeyId,
  });
}

export function useRateLimitsByServiceRoute(routeId: string) {
  return useQuery({
    queryKey: rateLimitKeys.byServiceRoute(routeId),
    queryFn: () => rateLimitsService.getByServiceRoute(routeId),
    enabled: !!routeId,
  });
}

export function useCreateRateLimit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreateRateLimitPayload) => rateLimitsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rateLimitKeys.all });
    },
  });
}

export function useUpdateRateLimit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRateLimitPayload }) =>
      rateLimitsService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: rateLimitKeys.all });
      queryClient.invalidateQueries({ queryKey: rateLimitKeys.detail(id) });
    },
  });
}

export function useDeleteRateLimit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => rateLimitsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rateLimitKeys.all });
    },
  });
}

export function useToggleRateLimit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => rateLimitsService.toggle(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: rateLimitKeys.all });
      queryClient.invalidateQueries({ queryKey: rateLimitKeys.detail(id) });
    },
  });
}

export function useCheckRateLimit() {
  return useMutation({
    mutationFn: ({ apiKeyId, serviceRouteId }: { apiKeyId: string; serviceRouteId: string }) =>
      rateLimitsService.check(apiKeyId, serviceRouteId),
  });
}
