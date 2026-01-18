import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Info, Check, Plus, Trash2, Power } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { toast } from "@/hooks/use-toast";
import {
  useRateLimits,
  useCreateRateLimit,
  useUpdateRateLimit,
  useDeleteRateLimit,
  useToggleRateLimit,
} from "@/hooks/use-rate-limits";
import { useServiceRoutes } from "@/hooks/use-service-routes";
import { useAPIKeys } from "@/hooks/use-api-keys";
import type { RateLimit } from "@/lib/api";

export default function RateLimits() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [requests, setRequests] = useState("1000");
  const [timeUnit, setTimeUnit] = useState<"second" | "minute" | "hour">("minute");
  const [algorithm, setAlgorithm] = useState("token-bucket");
  const [burstEnabled, setBurstEnabled] = useState(true);
  const [burstSize, setBurstSize] = useState("100");
  const [selectedServiceRoute, setSelectedServiceRoute] = useState("");
  const [selectedApiKey, setSelectedApiKey] = useState("");
  const [isProduction] = useState(true);

  const { data: rateLimits, isLoading, error } = useRateLimits();
  const { data: serviceRoutes } = useServiceRoutes();
  const { data: apiKeys } = useAPIKeys();
  const createMutation = useCreateRateLimit();
  const deleteMutation = useDeleteRateLimit();
  const toggleMutation = useToggleRateLimit();

  const effectiveThroughput = parseInt(requests) / (timeUnit === "second" ? 1 : timeUnit === "minute" ? 60 : 3600);

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        serviceRouteId: selectedServiceRoute || undefined,
        apiKeyId: selectedApiKey || undefined,
        requests: parseInt(requests),
        timeWindow: timeUnit,
        algorithm,
        burstEnabled,
        burstSize: burstEnabled ? parseInt(burstSize) : 0,
      });
      toast({
        title: "Rate limit created",
        description: "New rate limit rule has been configured",
      });
      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Failed to create rate limit",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this rate limit?")) return;
    
    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: "Rate limit deleted",
        description: "Rate limit rule has been removed",
      });
    } catch (error) {
      toast({
        title: "Failed to delete rate limit",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleMutation.mutateAsync(id);
      toast({
        title: "Status updated",
        description: "Rate limit status has been toggled",
      });
    } catch (error) {
      toast({
        title: "Failed to toggle status",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setRequests("1000");
    setTimeUnit("minute");
    setAlgorithm("token-bucket");
    setBurstEnabled(true);
    setBurstSize("100");
    setSelectedServiceRoute("");
    setSelectedApiKey("");
  };

  const getServiceRouteName = (id?: string) => {
    if (!id) return "Global";
    return serviceRoutes?.find((r) => r.id === id)?.name || id;
  };

  const getApiKeyName = (id?: string) => {
    if (!id) return "All Keys";
    return apiKeys?.find((k) => k.id === id)?.name || id;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Rate Limit Configuration</h1>
            <p className="text-sm text-muted-foreground">
              Configure rate limiting rules for your API endpoints
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Rate Limit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Rate Limit Rule</DialogTitle>
                <DialogDescription>
                  Define a new rate limiting rule for API endpoints or keys
                </DialogDescription>
              </DialogHeader>

              {isProduction && (
                <Alert variant="destructive" className="border-warning bg-warning/10">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <AlertTitle className="text-warning">Production Environment</AlertTitle>
                  <AlertDescription className="text-warning/80">
                    Changes will affect live traffic.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-6 py-4">
                {/* Configuration Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Apply To Service Route</Label>
                    <Select value={selectedServiceRoute} onValueChange={setSelectedServiceRoute}>
                      <SelectTrigger>
                        <SelectValue placeholder="Global (all routes)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Global (all routes)</SelectItem>
                        {serviceRoutes?.map((route) => (
                          <SelectItem key={route.id} value={route.id}>
                            {route.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Apply To API Key</Label>
                    <Select value={selectedApiKey} onValueChange={setSelectedApiKey}>
                      <SelectTrigger>
                        <SelectValue placeholder="All API Keys" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All API Keys</SelectItem>
                        {apiKeys?.filter((k) => k.status === "active").map((key) => (
                          <SelectItem key={key.id} value={key.id}>
                            {key.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="requests">Requests</Label>
                      <Input
                        id="requests"
                        type="number"
                        value={requests}
                        onChange={(e) => setRequests(e.target.value)}
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeUnit">Per</Label>
                      <Select value={timeUnit} onValueChange={(v) => setTimeUnit(v as typeof timeUnit)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="second">Second</SelectItem>
                          <SelectItem value="minute">Minute</SelectItem>
                          <SelectItem value="hour">Hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="algorithm">Algorithm</Label>
                    <Select value={algorithm} onValueChange={setAlgorithm}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="token-bucket">Token Bucket</SelectItem>
                        <SelectItem value="fixed-window">Fixed Window</SelectItem>
                        <SelectItem value="sliding-window">Sliding Window Log</SelectItem>
                        <SelectItem value="leaky-bucket">Leaky Bucket</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4 rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Allow Burst</Label>
                        <p className="text-xs text-muted-foreground">
                          Enable temporary request spikes
                        </p>
                      </div>
                      <Switch
                        checked={burstEnabled}
                        onCheckedChange={setBurstEnabled}
                      />
                    </div>
                    
                    {burstEnabled && (
                      <div className="space-y-2">
                        <Label htmlFor="burstSize">Burst Size</Label>
                        <Input
                          id="burstSize"
                          type="number"
                          value={burstSize}
                          onChange={(e) => setBurstSize(e.target.value)}
                          min="1"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview Panel */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Info className="h-4 w-4 text-primary" />
                        Configuration Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-3 rounded-lg bg-secondary/50 p-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Burst Allowed</span>
                          <span className="font-medium">
                            {burstEnabled ? (
                              <span className="flex items-center gap-1 text-success">
                                <Check className="h-4 w-4" /> Yes
                              </span>
                            ) : (
                              "No"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Effective Throughput</span>
                          <span className="font-mono font-medium">
                            {effectiveThroughput.toFixed(2)} req/sec
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Algorithm</span>
                          <span className="font-medium capitalize">
                            {algorithm.replace("-", " ")}
                          </span>
                        </div>
                        {burstEnabled && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Max Burst</span>
                            <span className="font-mono font-medium">{burstSize} requests</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!requests || parseInt(requests) < 1 || createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create Rate Limit"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Existing Rate Limits Table */}
        {error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="text-destructive">Failed to load rate limits</p>
            <p className="text-sm text-muted-foreground mt-1">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-border bg-card"
          >
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Service Route</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Limit</TableHead>
                  <TableHead>Algorithm</TableHead>
                  <TableHead>Burst</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                    </TableRow>
                  ))
                ) : !rateLimits?.length ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No rate limits configured
                    </TableCell>
                  </TableRow>
                ) : (
                  rateLimits.map((limit) => (
                    <TableRow key={limit.id}>
                      <TableCell className="font-medium">
                        {getServiceRouteName(limit.serviceRouteId)}
                      </TableCell>
                      <TableCell>{getApiKeyName(limit.apiKeyId)}</TableCell>
                      <TableCell className="font-mono">
                        {limit.requests}/{limit.timeWindow}
                      </TableCell>
                      <TableCell className="capitalize">
                        {limit.algorithm.replace("-", " ")}
                      </TableCell>
                      <TableCell>
                        {limit.burstEnabled ? (
                          <span className="text-success">{limit.burstSize}</span>
                        ) : (
                          <span className="text-muted-foreground">Disabled</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge variant={limit.status === "active" ? "success" : "muted"}>
                          {limit.status.charAt(0).toUpperCase() + limit.status.slice(1)}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleToggle(limit.id)}
                            disabled={toggleMutation.isPending}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(limit.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
