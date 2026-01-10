import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, Copy, ExternalLink } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface LogEntry {
  id: string;
  timestamp: string;
  apiName: string;
  endpoint: string;
  violationType: "rate_limit" | "auth_failure" | "timeout" | "circuit_break";
  source: string;
  statusCode: number;
  details: string;
}

const logs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2024-01-20T14:32:15.123Z",
    apiName: "User Service",
    endpoint: "/api/v1/users",
    violationType: "rate_limit",
    source: "192.168.1.100",
    statusCode: 429,
    details: "Rate limit exceeded: 1000 requests per minute. Current: 1247 requests.",
  },
  {
    id: "2",
    timestamp: "2024-01-20T14:31:45.456Z",
    apiName: "Auth Service",
    endpoint: "/api/v1/auth/login",
    violationType: "auth_failure",
    source: "nxg_live_3mP2",
    statusCode: 401,
    details: "Invalid API key provided. Key has been revoked.",
  },
  {
    id: "3",
    timestamp: "2024-01-20T14:30:22.789Z",
    apiName: "Payment Gateway",
    endpoint: "/api/v1/payments/process",
    violationType: "timeout",
    source: "192.168.1.105",
    statusCode: 504,
    details: "Upstream timeout after 30000ms. Gateway did not respond.",
  },
  {
    id: "4",
    timestamp: "2024-01-20T14:29:18.012Z",
    apiName: "Search Engine",
    endpoint: "/api/v1/search",
    violationType: "circuit_break",
    source: "system",
    statusCode: 503,
    details: "Circuit breaker opened. Error rate exceeded 50% threshold.",
  },
  {
    id: "5",
    timestamp: "2024-01-20T14:28:55.345Z",
    apiName: "User Service",
    endpoint: "/api/v1/users/bulk",
    violationType: "rate_limit",
    source: "nxg_live_7kX9",
    statusCode: 429,
    details: "Burst limit exceeded. Maximum 100 requests per second.",
  },
  {
    id: "6",
    timestamp: "2024-01-20T14:27:33.678Z",
    apiName: "Analytics",
    endpoint: "/api/v1/analytics/events",
    violationType: "rate_limit",
    source: "192.168.1.120",
    statusCode: 429,
    details: "Rate limit exceeded: 500 requests per minute for this endpoint.",
  },
];

const violationLabels: Record<string, string> = {
  rate_limit: "Rate Limit",
  auth_failure: "Auth Failure",
  timeout: "Timeout",
  circuit_break: "Circuit Break",
};

const violationVariants: Record<string, "error" | "warning" | "info"> = {
  rate_limit: "warning",
  auth_failure: "error",
  timeout: "error",
  circuit_break: "error",
};

export default function Logs() {
  const [search, setSearch] = useState("");
  const [violationFilter, setViolationFilter] = useState<string>("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.apiName.toLowerCase().includes(search.toLowerCase()) ||
      log.source.toLowerCase().includes(search.toLowerCase()) ||
      log.endpoint.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = violationFilter === "all" || log.violationType === violationFilter;
    return matchesSearch && matchesFilter;
  });

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Logs & Violations</h1>
          <p className="text-sm text-muted-foreground">
            Monitor rate limit violations, authentication failures, and system events
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by API, endpoint, or source..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={violationFilter} onValueChange={setViolationFilter}>
            <SelectTrigger className="w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Violations</SelectItem>
              <SelectItem value="rate_limit">Rate Limit</SelectItem>
              <SelectItem value="auth_failure">Auth Failure</SelectItem>
              <SelectItem value="timeout">Timeout</SelectItem>
              <SelectItem value="circuit_break">Circuit Break</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Logs Table */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-border bg-card"
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-8"></TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>API</TableHead>
                <TableHead>Violation Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <Collapsible
                  key={log.id}
                  open={expandedRow === log.id}
                  onOpenChange={(open) => setExpandedRow(open ? log.id : null)}
                  asChild
                >
                  <>
                    <CollapsibleTrigger asChild>
                      <TableRow className="cursor-pointer">
                        <TableCell>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform",
                              expandedRow === log.id && "rotate-180"
                            )}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{log.apiName}</p>
                            <p className="font-mono text-xs text-muted-foreground">
                              {log.endpoint}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge variant={violationVariants[log.violationType]}>
                            {violationLabels[log.violationType]}
                          </StatusBadge>
                        </TableCell>
                        <TableCell>
                          <code className="rounded bg-secondary px-2 py-1 font-mono text-xs">
                            {log.source}
                          </code>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={cn(
                              "font-mono font-medium",
                              log.statusCode >= 500 && "text-destructive",
                              log.statusCode >= 400 && log.statusCode < 500 && "text-warning"
                            )}
                          >
                            {log.statusCode}
                          </span>
                        </TableCell>
                      </TableRow>
                    </CollapsibleTrigger>
                    <CollapsibleContent asChild>
                      <TableRow className="bg-secondary/30 hover:bg-secondary/30">
                        <TableCell colSpan={6}>
                          <div className="py-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Details</p>
                                <p className="text-sm text-muted-foreground">
                                  {log.details}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="gap-2">
                                  <Copy className="h-3 w-3" />
                                  Copy cURL
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2">
                                  <ExternalLink className="h-3 w-3" />
                                  View Request
                                </Button>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ))}
            </TableBody>
          </Table>
        </motion.div>

        {filteredLogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">No logs match your filters</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}