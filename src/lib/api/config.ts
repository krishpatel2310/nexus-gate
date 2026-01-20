// API Base URL - Config Service on port 8082
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8082",
};

// Helper to get auth token from storage
export const getAuthToken = (): string | null => {
  return localStorage.getItem("nexusgate_token");
};

// Helper to set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem("nexusgate_token", token);
};

// Helper to remove auth token
export const removeAuthToken = (): void => {
  localStorage.removeItem("nexusgate_token");
};

// Helper to get current user from storage
export const getCurrentUserFromStorage = (): {
  userId: number;
  email: string;
  fullName: string;
  role: string;
} | null => {
  const userStr = localStorage.getItem("nexusgate_user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Helper to set current user
export const setCurrentUser = (user: {
  userId: number;
  email: string;
  fullName: string;
  role: string;
}): void => {
  localStorage.setItem("nexusgate_user", JSON.stringify(user));
};

// Helper to remove current user
export const removeCurrentUser = (): void => {
  localStorage.removeItem("nexusgate_user");
};

// Default headers for API requests
export const getDefaultHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
};
