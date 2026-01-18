import { getDefaultHeaders } from "./config";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
}

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "APIError";
  }
}

async function apiRequest<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: {
      ...getDefaultHeaders(),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    let data: unknown;
    
    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new APIError(
        (data as { message?: string })?.message || `HTTP error ${response.status}`,
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Network or other errors
    throw new APIError(
      error instanceof Error ? error.message : "Network error",
      0
    );
  }
}

export const apiClient = {
  get: <T>(url: string, headers?: HeadersInit) =>
    apiRequest<T>(url, { method: "GET", headers }),

  post: <T>(url: string, body?: unknown, headers?: HeadersInit) =>
    apiRequest<T>(url, { method: "POST", body, headers }),

  put: <T>(url: string, body?: unknown, headers?: HeadersInit) =>
    apiRequest<T>(url, { method: "PUT", body, headers }),

  patch: <T>(url: string, body?: unknown, headers?: HeadersInit) =>
    apiRequest<T>(url, { method: "PATCH", body, headers }),

  delete: <T>(url: string, headers?: HeadersInit) =>
    apiRequest<T>(url, { method: "DELETE", headers }),
};

export { APIError };
