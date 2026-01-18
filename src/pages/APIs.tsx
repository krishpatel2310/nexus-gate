import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ExternalLink, Plus, Trash2, Power } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import {
  useServiceRoutes,
  useCreateServiceRoute,
  useToggleServiceRoute,
  useDeleteServiceRoute,
} from "@/hooks/use-service-routes";
import type { ServiceRoute } from "@/lib/api";

export default function APIs() {
  const [search, setSearch] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newRoute, setNewRoute] = useState({ name: "", path: "", targetUrl: "" });

  const { data: serviceRoutes, isLoading, error } = useServiceRoutes();
  const createMutation = useCreateServiceRoute();
  const toggleMutation = useToggleServiceRoute();
  const deleteMutation = useDeleteServiceRoute();

  const filteredAPIs = (serviceRoutes || []).filter(
    (api) =>
      api.name.toLowerCase().includes(search.toLowerCase()) ||
      api.path.toLowerCase().includes(search.toLowerCase())
  );

  const getHealthVariant = (route: ServiceRoute) => {
    if (route.status === "inactive") return "muted";
    const health = route.healthStatus || "healthy";
    switch (health) {
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

  const getHealthLabel = (route: ServiceRoute) => {
    if (route.status === "inactive") return "Inactive";
    const health = route.healthStatus || "healthy";
    return health.charAt(0).toUpperCase() + health.slice(1);
  };

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync(newRoute);
      toast({
        title: "Service route created",
        description: `${newRoute.name} has been registered successfully`,
      });
      setShowCreateDialog(false);
      setNewRoute({ name: "", path: "", targetUrl: "" });
    } catch (error) {
      toast({
        title: "Failed to create service route",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleToggle = async (id: string, name: string) => {
    try {
      await toggleMutation.mutateAsync(id);
      toast({
        title: "Status updated",
        description: `${name} status has been toggled`,
      });
    } catch (error) {
      toast({
        title: "Failed to toggle status",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    
    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: "Service route deleted",
        description: `${name} has been removed`,
      });
    } catch (error) {
      toast({
        title: "Failed to delete service route",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
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
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Register New API
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register New Service Route</DialogTitle>
                <DialogDescription>
                  Add a new API endpoint to manage through NexusGate
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., User Service"
                    value={newRoute.name}
                    onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="path">Path</Label>
                  <Input
                    id="path"
                    placeholder="e.g., /api/users"
                    value={newRoute.path}
                    onChange={(e) => setNewRoute({ ...newRoute, path: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetUrl">Target URL</Label>
                  <Input
                    id="targetUrl"
                    placeholder="e.g., http://user-service:8080"
                    value={newRoute.targetUrl}
                    onChange={(e) => setNewRoute({ ...newRoute, targetUrl: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!newRoute.name || !newRoute.path || !newRoute.targetUrl || createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
        {error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="text-destructive">Failed to load service routes</p>
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
                  <TableHead>API Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Requests/hr</TableHead>
                  <TableHead className="text-right">P95 Latency</TableHead>
                  <TableHead className="text-right">Error Rate</TableHead>
                  <TableHead>Rate Limit Usage</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-10 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredAPIs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {search ? "No APIs match your search" : "No service routes registered"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAPIs.map((api) => (
                    <TableRow key={api.id} className="group">
                      <TableCell>
                        <div>
                          <p className="font-medium">{api.name}</p>
                          <p className="font-mono text-xs text-muted-foreground">
                            {api.path}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          variant={getHealthVariant(api)}
                          pulse={api.healthStatus !== "healthy" && api.status === "active"}
                        >
                          {getHealthLabel(api)}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {(api.requestsPerHour || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {api.p95Latency || 0}ms
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        <span
                          className={
                            (api.errorRate || 0) > 5
                              ? "text-destructive"
                              : (api.errorRate || 0) > 1
                              ? "text-warning"
                              : ""
                          }
                        >
                          {api.errorRate || 0}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={api.rateLimitUsage || 0}
                            className="h-1.5 w-20"
                            indicatorClassName={
                              (api.rateLimitUsage || 0) >= 90
                                ? "bg-destructive"
                                : (api.rateLimitUsage || 0) >= 70
                                ? "bg-warning"
                                : "bg-success"
                            }
                          />
                          <span className="font-mono text-xs w-8">
                            {api.rateLimitUsage || 0}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleToggle(api.id, api.name)}
                            disabled={toggleMutation.isPending}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(api.id, api.name)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Link to={`/apis/${api.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
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
