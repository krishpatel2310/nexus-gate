// API Base URLs - Configure these based on your backend deployment
export const API_CONFIG = {
  CONFIG_SERVICE_URL: import.meta.env.VITE_CONFIG_SERVICE_URL || "http://localhost:8080",
  AUTH_SERVICE_URL: import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost:8081",
  LOAD_TESTER_URL: import.meta.env.VITE_LOAD_TESTER_URL || "http://localhost:8082",
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
