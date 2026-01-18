import { Activity, Zap, AlertTriangle, Shield, Clock } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TrafficChart } from "@/components/dashboard/TrafficChart";
import { APIHealthCard } from "@/components/dashboard/APIHealthCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useServiceRoutes } from "@/hooks/use-service-routes";
import { Skeleton } from "@/components/ui/skeleton";
import type { ServiceRoute } from "@/lib/api";

// Transform service route to API health card format
const transformToHealthCard = (route: ServiceRoute) => ({
  name: route.name,
  endpoint: route.path,
  status: route.healthStatus || (route.status === "active" ? "healthy" : "down") as "healthy" | "degraded" | "down",
  p95Latency: route.p95Latency || 0,
  errorRate: route.errorRate || 0,
  rateLimitUsage: route.rateLimitUsage || 0,
});

export default function Overview() {
  const { data: serviceRoutes, isLoading, error } = useServiceRoutes();

  const apis = serviceRoutes?.map(transformToHealthCard) || [];
  const healthyCount = apis.filter((a) => a.status === "healthy").length;

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
              {isLoading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                `${healthyCount} of ${apis.length} endpoints healthy`
              )}
            </p>
          </div>
          
          {error ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
              <p className="text-destructive">Failed to load service routes</p>
              <p className="text-sm text-muted-foreground mt-1">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-lg" />
              ))}
            </div>
          ) : apis.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <p className="text-muted-foreground">No service routes configured</p>
              <p className="text-sm text-muted-foreground mt-1">
                Register your first API endpoint to see health metrics
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {apis.map((api, index) => (
                <APIHealthCard key={api.name} {...api} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
