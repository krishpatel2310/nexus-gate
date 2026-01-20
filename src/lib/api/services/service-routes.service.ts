import { apiClient } from "../client";
import type { ServiceRoute, CreateServiceRoutePayload, UpdateServiceRoutePayload } from "../types";

const BASE_URL = "/service-routes";

export const serviceRoutesService = {
  // POST /service-routes - Create a new service route
  create: async (payload: CreateServiceRoutePayload): Promise<ServiceRoute> => {
    return apiClient.post<ServiceRoute>(BASE_URL, payload);
  },

  // GET /service-routes - Get all service routes
  getAll: async (activeOnly: boolean = false): Promise<ServiceRoute[]> => {
    const query = activeOnly ? "?activeOnly=true" : "";
    return apiClient.get<ServiceRoute[]>(`${BASE_URL}${query}`);
  },

  // GET /service-routes/{id} - Get service route by ID
  getById: async (id: number): Promise<ServiceRoute> => {
    return apiClient.get<ServiceRoute>(`${BASE_URL}/${id}`);
  },

  // GET /service-routes/by-path?path={path} - Get service route by path
  getByPath: async (path: string): Promise<ServiceRoute> => {
    return apiClient.get<ServiceRoute>(`${BASE_URL}/by-path?path=${encodeURIComponent(path)}`);
  },

  // PUT /service-routes/{id} - Update a service route
  update: async (id: number, payload: UpdateServiceRoutePayload): Promise<ServiceRoute> => {
    return apiClient.put<ServiceRoute>(`${BASE_URL}/${id}`, payload);
  },

  // PATCH /service-routes/{id}/toggle - Toggle service route status
  toggle: async (id: number): Promise<ServiceRoute> => {
    return apiClient.patch<ServiceRoute>(`${BASE_URL}/${id}/toggle`);
  },

  // DELETE /service-routes/{id} - Delete a service route
  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`${BASE_URL}/${id}`);
  },
};
