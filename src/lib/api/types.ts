// User types - matching backend exactly
export interface User {
  id: number;
  email: string;
  fullName: string;
  role: "ADMIN" | "USER";
  createdAt: string;
}

export interface RegisterUserPayload {
  email: string;
  password: string;
  fullName: string;
  role?: "ADMIN" | "USER";
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInResponse {
  userId: number;
  email: string;
  fullName: string;
  role: string;
  message: string;
}

// API Key types - matching backend exactly
export interface APIKey {
  id: number;
  keyValue: string;
  keyName: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  createdByUserId: number;
  isActive: boolean;
  expiresAt: string | null;
  lastUsedAt: string | null;
  createdAt: string;
  notes: string | null;
}

export interface CreateAPIKeyPayload {
  keyName: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  createdByUserId: number;
  expiresAt?: string;
  notes?: string;
}

export interface UpdateAPIKeyPayload {
  keyName?: string;
  clientName?: string;
  clientEmail?: string;
  clientCompany?: string;
  createdByUserId?: number;
  expiresAt?: string;
  notes?: string;
}

// Service Route types - matching backend exactly
export interface ServiceRoute {
  id: number;
  serviceName: string;
  serviceDescription: string;
  publicPath: string;
  targetUrl: string;
  allowedMethods: string[];
  rateLimitPerMinute: number;
  rateLimitPerHour: number;
  isActive: boolean;
  createdByUserId: number;
  createdAt: string;
  updatedAt: string;
  notes: string | null;
}

export interface CreateServiceRoutePayload {
  serviceName: string;
  serviceDescription: string;
  publicPath: string;
  targetUrl: string;
  allowedMethods: string[];
  rateLimitPerMinute: number;
  rateLimitPerHour: number;
  createdByUserId: number;
  notes?: string;
}

export interface UpdateServiceRoutePayload {
  serviceName?: string;
  serviceDescription?: string;
  publicPath?: string;
  targetUrl?: string;
  allowedMethods?: string[];
  rateLimitPerMinute?: number;
  rateLimitPerHour?: number;
  createdByUserId?: number;
  notes?: string;
}

// Rate Limit types - matching backend exactly
export interface RateLimit {
  id: number;
  apiKeyId: number | null;
  serviceRouteId: number | null;
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  notes: string | null;
}

export interface CreateRateLimitPayload {
  apiKeyId?: number | null;
  serviceRouteId?: number | null;
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  notes?: string;
}

export interface UpdateRateLimitPayload {
  apiKeyId?: number | null;
  serviceRouteId?: number | null;
  requestsPerMinute?: number;
  requestsPerHour?: number;
  requestsPerDay?: number;
  notes?: string;
}

export interface RateLimitCheckResult {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  source: "SPECIFIC" | "ROUTE_DEFAULT" | "KEY_GLOBAL" | "SYSTEM_DEFAULT";
  rateLimitId: number | null;
  apiKeyId: number | null;
  serviceRouteId: number | null;
  notes: string | null;
}

// Log/Violation types (mock data)
export interface LogEntry {
  id: string;
  timestamp: string;
  apiName: string;
  endpoint: string;
  violationType: "rate_limit" | "auth_failure" | "timeout" | "circuit_break";
  source: string;
  statusCode: number;
  details: string;
  requestId?: string;
}

// Overview/Metrics types (mock data)
export interface SystemMetrics {
  requestsPerSecond: number;
  p95Latency: number;
  errorRate: number;
  rateLimitViolations: number;
  circuitBreakerState: "closed" | "open" | "half-open";
}

export interface TrafficDataPoint {
  time: string;
  requests: number;
  errors: number;
}

// API Response wrapper for errors
export interface APIErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
