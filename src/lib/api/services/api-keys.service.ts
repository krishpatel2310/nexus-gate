import { apiClient } from "../client";
import { API_CONFIG } from "../config";
import type { APIKey, CreateAPIKeyPayload, UpdateAPIKeyPayload } from "../types";

const BASE_URL = `${API_CONFIG.CONFIG_SERVICE_URL}/api/keys`;

export const apiKeysService = {
  // POST /api/keys - Create a new API key
  create: async (payload: CreateAPIKeyPayload): Promise<APIKey> => {
    return apiClient.post<APIKey>(BASE_URL, payload);
  },

  // GET /api/keys - Get all API keys
  getAll: async (): Promise<APIKey[]> => {
    return apiClient.get<APIKey[]>(BASE_URL);
  },

  // GET /api/keys/user/{userId} - Get API keys by user ID
  getByUserId: async (userId: string): Promise<APIKey[]> => {
    return apiClient.get<APIKey[]>(`${BASE_URL}/user/${userId}`);
  },

  // GET /api/keys/{id} - Get API key by ID
  getById: async (id: string): Promise<APIKey> => {
    return apiClient.get<APIKey>(`${BASE_URL}/${id}`);
  },

  // GET /api/keys/validate - Validate an API key
  validate: async (key: string): Promise<{ valid: boolean; apiKey?: APIKey }> => {
    return apiClient.get<{ valid: boolean; apiKey?: APIKey }>(`${BASE_URL}/validate?key=${encodeURIComponent(key)}`);
  },

  // PUT /api/keys/{id} - Update an API key
  update: async (id: string, payload: UpdateAPIKeyPayload): Promise<APIKey> => {
    return apiClient.put<APIKey>(`${BASE_URL}/${id}`, payload);
  },

  // DELETE /api/keys/{id} - Delete an API key
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`${BASE_URL}/${id}`);
  },
};
