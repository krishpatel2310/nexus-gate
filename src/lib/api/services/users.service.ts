import { apiClient } from "../client";
import { API_CONFIG, setAuthToken } from "../config";
import type { User, AuthResponse, RegisterUserPayload, SignInPayload } from "../types";

const BASE_URL = `${API_CONFIG.CONFIG_SERVICE_URL}/api/users`;

export const usersService = {
  // GET /api/users - Get all users
  getAllUsers: async (): Promise<User[]> => {
    return apiClient.get<User[]>(BASE_URL);
  },

  // POST /api/users/register - Register a new user
  register: async (payload: RegisterUserPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(`${BASE_URL}/register`, payload);
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  // POST /api/users/signin - Sign in a user
  signIn: async (payload: SignInPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(`${BASE_URL}/signin`, payload);
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  // GET /api/users/me - Get current user
  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>(`${BASE_URL}/me`);
  },

  // GET /api/users/{id} - Get user by ID
  getUserById: async (id: string): Promise<User> => {
    return apiClient.get<User>(`${BASE_URL}/${id}`);
  },
};
