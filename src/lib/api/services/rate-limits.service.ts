import { apiClient } from "../client";
import type { RateLimit, CreateRateLimitPayload, UpdateRateLimitPayload, RateLimitCheckResult } from "../types";

const BASE_URL = "/rate-limits";

export const rateLimitsService = {
  // POST /rate-limits - Create a new rate limit
  create: async (payload: CreateRateLimitPayload): Promise<RateLimit> => {
    return apiClient.post<RateLimit>(BASE_URL, payload);
  },

  // GET /rate-limits - Get all rate limits
  getAll: async (): Promise<RateLimit[]> => {
    return apiClient.get<RateLimit[]>(BASE_URL);
  },

  // GET /rate-limits/{id} - Get rate limit by ID
  getById: async (id: number): Promise<RateLimit> => {
    return apiClient.get<RateLimit>(`${BASE_URL}/${id}`);
  },

  // GET /rate-limits/by-api-key/{apiKeyId} - Get rate limits by API key
  getByApiKey: async (apiKeyId: number): Promise<RateLimit[]> => {
    return apiClient.get<RateLimit[]>(`${BASE_URL}/by-api-key/${apiKeyId}`);
  },

  // GET /rate-limits/by-service-route/{serviceRouteId} - Get rate limits by service route
  getByServiceRoute: async (serviceRouteId: number): Promise<RateLimit[]> => {
    return apiClient.get<RateLimit[]>(`${BASE_URL}/by-service-route/${serviceRouteId}`);
  },

  // GET /rate-limits/check?apiKeyId={apiKeyId}&serviceRouteId={serviceRouteId} - Check effective rate limit
  check: async (apiKeyId: number, serviceRouteId: number): Promise<RateLimitCheckResult> => {
    return apiClient.get<RateLimitCheckResult>(
      `${BASE_URL}/check?apiKeyId=${apiKeyId}&serviceRouteId=${serviceRouteId}`
    );
  },

  // PUT /rate-limits/{id} - Update a rate limit
  update: async (id: number, payload: UpdateRateLimitPayload): Promise<RateLimit> => {
    return apiClient.put<RateLimit>(`${BASE_URL}/${id}`, payload);
  },

  // DELETE /rate-limits/{id} - Delete a rate limit
  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`${BASE_URL}/${id}`);
  },

  // PATCH /rate-limits/{id}/toggle - Toggle rate limit status
  toggle: async (id: number): Promise<RateLimit> => {
    return apiClient.patch<RateLimit>(`${BASE_URL}/${id}/toggle`);
  },
};
