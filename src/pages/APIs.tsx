import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ExternalLink } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";

const apis = [
  {
    id: "user-service",
    name: "User Service",
    endpoint: "/api/v1/users",
    status: "healthy" as const,
    requests: 45230,
    p95: 45,
    errorRate: 0.2,
    rateLimitUsage: 34,
  },
  {
    id: "payment-gateway",
    name: "Payment Gateway",
    endpoint: "/api/v1/payments",
    status: "healthy" as const,
    requests: 12450,
    p95: 128,
    errorRate: 0.8,
    rateLimitUsage: 67,
  },
  {
    id: "auth-service",
    name: "Auth Service",
    endpoint: "/api/v1/auth",
    status: "degraded" as const,
    requests: 89320,
    p95: 523,
    errorRate: 3.2,
    rateLimitUsage: 89,
  },
  {
    id: "notification-hub",
    name: "Notification Hub",
    endpoint: "/api/v1/notifications",
    status: "healthy" as const,
    requests: 23400,
    p95: 67,
    errorRate: 0.1,
    rateLimitUsage: 45,
  },
  {
    id: "search-engine",
    name: "Search Engine",
    endpoint: "/api/v1/search",
    status: "down" as const,
    requests: 0,
    p95: 0,
    errorRate: 100,
    rateLimitUsage: 0,
  },
  {
    id: "analytics",
    name: "Analytics",
    endpoint: "/api/v1/analytics",
    status: "healthy" as const,
    requests: 34560,
    p95: 234,
    errorRate: 0.5,
    rateLimitUsage: 56,
  },
];

export default function APIs() {
  const [search, setSearch] = useState("");

  const filteredAPIs = apis.filter(
    (api) =>
      api.name.toLowerCase().includes(search.toLowerCase()) ||
      api.endpoint.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "healthy":
        return "success";
      case "degraded":
        return "warning";
      case "down":
        return "error";
      default:
        return "muted";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">APIs</h1>
            <p className="text-sm text-muted-foreground">
              Monitor and manage all registered API endpoints
            </p>
          </div>
          <Button>Register New API</Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search APIs by name or endpoint..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* APIs Table */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-border bg-card"
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>API Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Requests/hr</TableHead>
                <TableHead className="text-right">P95 Latency</TableHead>
                <TableHead className="text-right">Error Rate</TableHead>
                <TableHead>Rate Limit Usage</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAPIs.map((api) => (
                <TableRow
                  key={api.id}
                  className="group cursor-pointer"
                  onClick={() => {}}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{api.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {api.endpoint}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      variant={getStatusVariant(api.status)}
                      pulse={api.status !== "healthy"}
                    >
                      {api.status.charAt(0).toUpperCase() + api.status.slice(1)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {api.requests.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {api.p95}ms
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    <span
                      className={
                        api.errorRate > 5
                          ? "text-destructive"
                          : api.errorRate > 1
                          ? "text-warning"
                          : ""
                      }
                    >
                      {api.errorRate}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={api.rateLimitUsage}
                        className="h-1.5 w-20"
                        indicatorClassName={
                          api.rateLimitUsage >= 90
                            ? "bg-destructive"
                            : api.rateLimitUsage >= 70
                            ? "bg-warning"
                            : "bg-success"
                        }
                      />
                      <span className="font-mono text-xs w-8">
                        {api.rateLimitUsage}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link to={`/apis/${api.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}