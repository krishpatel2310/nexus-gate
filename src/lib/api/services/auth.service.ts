import { apiClient } from "../client";
import { API_CONFIG, setAuthToken, removeAuthToken } from "../config";
import type { User, AuthResponse, SignInPayload, RegisterUserPayload } from "../types";

const BASE_URL = API_CONFIG.AUTH_SERVICE_URL;

export const authService = {
  // POST /auth/login - User login
  login: async (payload: SignInPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(`${BASE_URL}/auth/login`, payload);
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  // GET /auth/me - Get current authenticated user
  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>(`${BASE_URL}/auth/me`);
  },

  // POST /auth/validate - Validate a token
  validateToken: async (token: string): Promise<{ valid: boolean }> => {
    return apiClient.post<{ valid: boolean }>(`${BASE_URL}/auth/validate`, { token });
  },

  // POST /auth/refresh - Refresh authentication token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(`${BASE_URL}/auth/refresh`, { refreshToken });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  // POST /auth/introspect - Introspect token details
  introspectToken: async (token: string): Promise<{ active: boolean; user?: User }> => {
    return apiClient.post<{ active: boolean; user?: User }>(`${BASE_URL}/auth/introspect`, { token });
  },

  // Logout - Clear local token
  logout: (): void => {
    removeAuthToken();
  },
};
