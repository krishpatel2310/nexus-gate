import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ExternalLink, Plus, Trash2, Power, Eye, Pencil } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  useServiceRoutes,
  useCreateServiceRoute,
  useToggleServiceRoute,
  useDeleteServiceRoute,
  useUpdateServiceRoute,
} from "@/hooks/use-service-routes";
import { useAuth } from "@/hooks/use-auth";
import type { ServiceRoute, CreateServiceRoutePayload } from "@/lib/api";

const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"];

export default function APIs() {
  const [search, setSearch] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<ServiceRoute | null>(null);
  const [newRoute, setNewRoute] = useState<CreateServiceRoutePayload>({
    serviceName: "",
    serviceDescription: "",
    publicPath: "",
    targetUrl: "",
    allowedMethods: ["GET"],
    rateLimitPerMinute: 100,
    rateLimitPerHour: 5000,
    createdByUserId: 1,
    notes: "",
  });

  const { user } = useAuth();
  const { data: serviceRoutes, isLoading, error } = useServiceRoutes();
  const createMutation = useCreateServiceRoute();
  const toggleMutation = useToggleServiceRoute();
  const deleteMutation = useDeleteServiceRoute();
  const updateMutation = useUpdateServiceRoute();

  const filteredAPIs = (serviceRoutes || []).filter(
    (api) =>
      api.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      api.publicPath.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        ...newRoute,
        createdByUserId: user?.userId || 1,
      });
      toast({
        title: "Service route created",
        description: `${newRoute.serviceName} has been registered successfully`,
      });
      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Failed to create service route",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!selectedRoute) return;
    try {
      await updateMutation.mutateAsync({
        id: selectedRoute.id,
        payload: {
          serviceName: newRoute.serviceName,
          serviceDescription: newRoute.serviceDescription,
          publicPath: newRoute.publicPath,
          targetUrl: newRoute.targetUrl,
          allowedMethods: newRoute.allowedMethods,
          rateLimitPerMinute: newRoute.rateLimitPerMinute,
          rateLimitPerHour: newRoute.rateLimitPerHour,
          notes: newRoute.notes,
        },
      });
      toast({
        title: "Service route updated",
        description: `${newRoute.serviceName} has been updated`,
      });
      setShowEditDialog(false);
      setSelectedRoute(null);
      resetForm();
    } catch (error) {
      toast({
        title: "Failed to update service route",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleToggle = async (id: number, name: string) => {
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

  const handleDelete = async (id: number, name: string) => {
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

  const resetForm = () => {
    setNewRoute({
      serviceName: "",
      serviceDescription: "",
      publicPath: "",
      targetUrl: "",
      allowedMethods: ["GET"],
      rateLimitPerMinute: 100,
      rateLimitPerHour: 5000,
      createdByUserId: user?.userId || 1,
      notes: "",
    });
  };

  const openEditDialog = (route: ServiceRoute) => {
    setSelectedRoute(route);
    setNewRoute({
      serviceName: route.serviceName,
      serviceDescription: route.serviceDescription,
      publicPath: route.publicPath,
      targetUrl: route.targetUrl,
      allowedMethods: route.allowedMethods,
      rateLimitPerMinute: route.rateLimitPerMinute,
      rateLimitPerHour: route.rateLimitPerHour,
      createdByUserId: route.createdByUserId,
      notes: route.notes || "",
    });
    setShowEditDialog(true);
  };

  const openViewDialog = (route: ServiceRoute) => {
    setSelectedRoute(route);
    setShowViewDialog(true);
  };

  const toggleMethod = (method: string) => {
    if (newRoute.allowedMethods.includes(method)) {
      setNewRoute({
        ...newRoute,
        allowedMethods: newRoute.allowedMethods.filter((m) => m !== method),
      });
    } else {
      setNewRoute({
        ...newRoute,
        allowedMethods: [...newRoute.allowedMethods, method],
      });
    }
  };

  const RouteFormFields = () => (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="serviceName">Service Name *</Label>
          <Input
            id="serviceName"
            placeholder="e.g., user-service"
            value={newRoute.serviceName}
            onChange={(e) => setNewRoute({ ...newRoute, serviceName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="publicPath">Public Path *</Label>
          <Input
            id="publicPath"
            placeholder="e.g., /api/users/**"
            value={newRoute.publicPath}
            onChange={(e) => setNewRoute({ ...newRoute, publicPath: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="serviceDescription">Description</Label>
        <Textarea
          id="serviceDescription"
          placeholder="Describe what this service does"
          value={newRoute.serviceDescription}
          onChange={(e) => setNewRoute({ ...newRoute, serviceDescription: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="targetUrl">Target URL *</Label>
        <Input
          id="targetUrl"
          placeholder="e.g., http://localhost:8080/users"
          value={newRoute.targetUrl}
          onChange={(e) => setNewRoute({ ...newRoute, targetUrl: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Allowed Methods</Label>
        <div className="flex flex-wrap gap-2">
          {HTTP_METHODS.map((method) => (
            <Button
              key={method}
              type="button"
              variant={newRoute.allowedMethods.includes(method) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleMethod(method)}
            >
              {method}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rateLimitPerMinute">Rate Limit / Minute</Label>
          <Input
            id="rateLimitPerMinute"
            type="number"
            value={newRoute.rateLimitPerMinute}
            onChange={(e) => setNewRoute({ ...newRoute, rateLimitPerMinute: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rateLimitPerHour">Rate Limit / Hour</Label>
          <Input
            id="rateLimitPerHour"
            type="number"
            value={newRoute.rateLimitPerHour}
            onChange={(e) => setNewRoute({ ...newRoute, rateLimitPerHour: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Additional notes"
          value={newRoute.notes}
          onChange={(e) => setNewRoute({ ...newRoute, notes: e.target.value })}
        />
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Gateway Services</h1>
            <p className="text-sm text-muted-foreground">
              Manage service routes and API endpoints
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Service Route
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Service Route</DialogTitle>
                <DialogDescription>
                  Add a new service route to the gateway
                </DialogDescription>
              </DialogHeader>
              <RouteFormFields />
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!newRoute.serviceName || !newRoute.publicPath || !newRoute.targetUrl || createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or path..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
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
                  <TableHead>Service Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Public Path</TableHead>
                  <TableHead>Target URL</TableHead>
                  <TableHead>Methods</TableHead>
                  <TableHead className="text-right">Limit/min</TableHead>
                  <TableHead className="text-right">Limit/hr</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredAPIs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      {search ? "No services match your search" : "No service routes configured"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAPIs.map((api) => (
                    <TableRow key={api.id} className="group">
                      <TableCell className="font-medium">{api.serviceName}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {api.serviceDescription || "-"}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{api.publicPath}</TableCell>
                      <TableCell className="font-mono text-xs max-w-[200px] truncate">
                        {api.targetUrl}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {api.allowedMethods.slice(0, 3).map((method) => (
                            <span
                              key={method}
                              className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium"
                            >
                              {method}
                            </span>
                          ))}
                          {api.allowedMethods.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{api.allowedMethods.length - 3}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {api.rateLimitPerMinute.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {api.rateLimitPerHour.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <StatusBadge variant={api.isActive ? "success" : "muted"}>
                          {api.isActive ? "Active" : "Disabled"}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openViewDialog(api)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditDialog(api)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleToggle(api.id, api.serviceName)}
                            disabled={toggleMutation.isPending}
                          >
                            <Power className={`h-4 w-4 ${api.isActive ? "text-success" : "text-muted-foreground"}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(api.id, api.serviceName)}
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

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Service Route</DialogTitle>
              <DialogDescription>
                Update the service route configuration
              </DialogDescription>
            </DialogHeader>
            <RouteFormFields />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={!newRoute.serviceName || !newRoute.publicPath || !newRoute.targetUrl || updateMutation.isPending}
              >
                {updateMutation.isPending ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedRoute?.serviceName}</DialogTitle>
              <DialogDescription>Service route details</DialogDescription>
            </DialogHeader>
            {selectedRoute && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Public Path</p>
                    <p className="font-mono">{selectedRoute.publicPath}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Target URL</p>
                    <p className="font-mono text-xs break-all">{selectedRoute.targetUrl}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rate Limit / Minute</p>
                    <p className="font-mono">{selectedRoute.rateLimitPerMinute}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rate Limit / Hour</p>
                    <p className="font-mono">{selectedRoute.rateLimitPerHour}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <StatusBadge variant={selectedRoute.isActive ? "success" : "muted"}>
                      {selectedRoute.isActive ? "Active" : "Disabled"}
                    </StatusBadge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created At</p>
                    <p>{new Date(selectedRoute.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Allowed Methods</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoute.allowedMethods.map((method) => (
                      <span
                        key={method}
                        className="rounded bg-secondary px-2 py-1 text-xs font-medium"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
                {selectedRoute.serviceDescription && (
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Description</p>
                    <p className="text-sm">{selectedRoute.serviceDescription}</p>
                  </div>
                )}
                {selectedRoute.notes && (
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Notes</p>
                    <p className="text-sm">{selectedRoute.notes}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
