import { apiClient } from "../client";
import type { APIKey, CreateAPIKeyPayload, UpdateAPIKeyPayload } from "../types";

const BASE_URL = "/api/keys";

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
  getByUserId: async (userId: number): Promise<APIKey[]> => {
    return apiClient.get<APIKey[]>(`${BASE_URL}/user/${userId}`);
  },

  // GET /api/keys/{id} - Get API key by ID
  getById: async (id: number): Promise<APIKey> => {
    return apiClient.get<APIKey>(`${BASE_URL}/${id}`);
  },

  // GET /api/keys/validate?keyValue={keyValue} - Validate an API key
  validate: async (keyValue: string): Promise<APIKey> => {
    return apiClient.get<APIKey>(`${BASE_URL}/validate?keyValue=${encodeURIComponent(keyValue)}`);
  },

  // PUT /api/keys/{id} - Update an API key
  update: async (id: number, payload: UpdateAPIKeyPayload): Promise<APIKey> => {
    return apiClient.put<APIKey>(`${BASE_URL}/${id}`, payload);
  },

  // DELETE /api/keys/{id} - Delete (revoke) an API key
  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`${BASE_URL}/${id}`);
  },
};
