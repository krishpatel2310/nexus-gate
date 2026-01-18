import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceRoutesService } from "@/lib/api";
import type { CreateServiceRoutePayload, UpdateServiceRoutePayload } from "@/lib/api";

export const serviceRouteKeys = {
  all: ["service-routes"] as const,
  detail: (id: string) => ["service-routes", id] as const,
  byPath: (path: string) => ["service-routes", "by-path", path] as const,
};

export function useServiceRoutes() {
  return useQuery({
    queryKey: serviceRouteKeys.all,
    queryFn: () => serviceRoutesService.getAll(),
  });
}

export function useServiceRoute(id: string) {
  return useQuery({
    queryKey: serviceRouteKeys.detail(id),
    queryFn: () => serviceRoutesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateServiceRoute() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreateServiceRoutePayload) => serviceRoutesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceRouteKeys.all });
    },
  });
}

export function useUpdateServiceRoute() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateServiceRoutePayload }) =>
      serviceRoutesService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: serviceRouteKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceRouteKeys.detail(id) });
    },
  });
}

export function useToggleServiceRoute() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => serviceRoutesService.toggle(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: serviceRouteKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceRouteKeys.detail(id) });
    },
  });
}

export function useDeleteServiceRoute() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => serviceRoutesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceRouteKeys.all });
    },
  });
}
