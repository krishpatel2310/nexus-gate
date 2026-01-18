// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RegisterUserPayload {
  email: string;
  password: string;
  name?: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  refreshToken?: string;
}

// API Key types
export interface APIKey {
  id: string;
  name: string;
  key?: string;
  prefix: string;
  userId: string;
  status: "active" | "revoked" | "expired";
  usage: number;
  limit: number;
  createdAt: string;
  expiresAt: string | null;
}

export interface CreateAPIKeyPayload {
  name: string;
  limit?: number;
  expiresAt?: string;
}

export interface UpdateAPIKeyPayload {
  name?: string;
  limit?: number;
  status?: "active" | "revoked";
}

// Service Route types
export interface ServiceRoute {
  id: string;
  name: string;
  path: string;
  targetUrl: string;
  method: string;
  status: "active" | "inactive";
  healthStatus: "healthy" | "degraded" | "down";
  p95Latency: number;
  errorRate: number;
  requestsPerHour: number;
  rateLimitUsage: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateServiceRoutePayload {
  name: string;
  path: string;
  targetUrl: string;
  method?: string;
}

export interface UpdateServiceRoutePayload {
  name?: string;
  path?: string;
  targetUrl?: string;
  method?: string;
  status?: "active" | "inactive";
}

// Rate Limit types
export interface RateLimit {
  id: string;
  name?: string;
  apiKeyId?: string;
  serviceRouteId?: string;
  requests: number;
  timeWindow: "second" | "minute" | "hour";
  algorithm: "token-bucket" | "fixed-window" | "sliding-window" | "leaky-bucket";
  burstEnabled: boolean;
  burstSize: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt?: string;
}

export interface CreateRateLimitPayload {
  apiKeyId?: string;
  serviceRouteId?: string;
  requests: number;
  timeWindow: "second" | "minute" | "hour";
  algorithm: string;
  burstEnabled?: boolean;
  burstSize?: number;
}

export interface UpdateRateLimitPayload {
  requests?: number;
  timeWindow?: "second" | "minute" | "hour";
  algorithm?: string;
  burstEnabled?: boolean;
  burstSize?: number;
}

export interface RateLimitCheckResult {
  allowed: boolean;
  remaining: number;
  resetAt: string;
  limit: number;
}

// Load Test types
export interface LoadTestConfig {
  targetUrl: string;
  duration: number;
  concurrency: number;
  requestsPerSecond: number;
}

export interface LoadTestStatus {
  testId: string;
  status: "running" | "completed" | "stopped" | "failed";
  progress: number;
  startedAt: string;
  endedAt?: string;
}

export interface LoadTestResults {
  testId: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgLatency: number;
  p95Latency: number;
  p99Latency: number;
  requestsPerSecond: number;
  errorRate: number;
  duration: number;
}

// Log/Violation types
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

// Overview/Metrics types
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

// API Response wrapper
export interface APIResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
