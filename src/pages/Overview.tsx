import { Activity, Zap, AlertTriangle, Shield, Clock } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TrafficChart } from "@/components/dashboard/TrafficChart";
import { APIHealthCard } from "@/components/dashboard/APIHealthCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Mock API data
const apis = [
  {
    name: "User Service",
    endpoint: "/api/v1/users",
    status: "healthy" as const,
    p95Latency: 45,
    errorRate: 0.2,
    rateLimitUsage: 34,
  },
  {
    name: "Payment Gateway",
    endpoint: "/api/v1/payments",
    status: "healthy" as const,
    p95Latency: 128,
    errorRate: 0.8,
    rateLimitUsage: 67,
  },
  {
    name: "Auth Service",
    endpoint: "/api/v1/auth",
    status: "degraded" as const,
    p95Latency: 523,
    errorRate: 3.2,
    rateLimitUsage: 89,
  },
  {
    name: "Notification Hub",
    endpoint: "/api/v1/notifications",
    status: "healthy" as const,
    p95Latency: 67,
    errorRate: 0.1,
    rateLimitUsage: 45,
  },
  {
    name: "Search Engine",
    endpoint: "/api/v1/search",
    status: "down" as const,
    p95Latency: 0,
    errorRate: 100,
    rateLimitUsage: 0,
  },
  {
    name: "Analytics",
    endpoint: "/api/v1/analytics",
    status: "healthy" as const,
    p95Latency: 234,
    errorRate: 0.5,
    rateLimitUsage: 56,
  },
];

export default function Overview() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Real-time system health and performance metrics
          </p>
        </div>

        {/* Top Summary Strip */}
        <div className="grid grid-cols-5 gap-4">
          <MetricCard
            label="Requests/sec"
            value={1247}
            unit="RPS"
            trend={{ direction: "up", value: "+12.3%", isPositive: true }}
            tooltip="Current requests per second across all endpoints"
            icon={<Activity className="h-4 w-4" />}
          />
          <MetricCard
            label="P95 Latency"
            value={89}
            unit="ms"
            trend={{ direction: "down", value: "-5.2%", isPositive: true }}
            tooltip="95th percentile response time"
            icon={<Clock className="h-4 w-4" />}
          />
          <MetricCard
            label="Error Rate"
            value={0.42}
            unit="%"
            status="normal"
            trend={{ direction: "down", value: "-0.1%", isPositive: true }}
            tooltip="Percentage of requests returning 4xx/5xx"
            icon={<AlertTriangle className="h-4 w-4" />}
          />
          <MetricCard
            label="Rate Violations"
            value={23}
            unit="/min"
            status="warning"
            trend={{ direction: "up", value: "+8", isPositive: false }}
            tooltip="Rate limit exceeded events per minute"
            icon={<Shield className="h-4 w-4" />}
          />
          <MetricCard
            label="Circuit Breaker"
            value="Closed"
            status="normal"
            tooltip="Circuit breaker state: Closed (normal), Open (blocking), Half-Open (testing)"
            icon={<Zap className="h-4 w-4" />}
          />
        </div>

        {/* Live Traffic Chart */}
        <TrafficChart />

        {/* API Health Cards */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">API Health</h2>
            <p className="text-sm text-muted-foreground">
              {apis.filter((a) => a.status === "healthy").length} of {apis.length} endpoints healthy
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {apis.map((api, index) => (
              <APIHealthCard key={api.name} {...api} index={index} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}