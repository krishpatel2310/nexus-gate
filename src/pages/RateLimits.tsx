import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Info, Plus, Trash2, Power } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { toast } from "@/hooks/use-toast";
import { useRateLimits, useCreateRateLimit, useDeleteRateLimit, useToggleRateLimit } from "@/hooks/use-rate-limits";
import { useServiceRoutes } from "@/hooks/use-service-routes";
import { useAPIKeys } from "@/hooks/use-api-keys";
import type { CreateRateLimitPayload } from "@/lib/api";

export default function RateLimits() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState<CreateRateLimitPayload>({
    apiKeyId: null,
    serviceRouteId: null,
    requestsPerMinute: 100,
    requestsPerHour: 5000,
    requestsPerDay: 100000,
    notes: "",
  });

  const { data: rateLimits, isLoading, error } = useRateLimits();
  const { data: serviceRoutes } = useServiceRoutes();
  const { data: apiKeys } = useAPIKeys();
  const createMutation = useCreateRateLimit();
  const deleteMutation = useDeleteRateLimit();
  const toggleMutation = useToggleRateLimit();

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync(formData);
      toast({ title: "Rate limit created", description: "New rate limit rule has been configured" });
      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      toast({ title: "Failed to create rate limit", description: error instanceof Error ? error.message : "Unknown error", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this rate limit?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Rate limit deleted" });
    } catch (error) {
      toast({ title: "Failed to delete", description: error instanceof Error ? error.message : "Unknown error", variant: "destructive" });
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleMutation.mutateAsync(id);
      toast({ title: "Status updated" });
    } catch (error) {
      toast({ title: "Failed to toggle", description: error instanceof Error ? error.message : "Unknown error", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({ apiKeyId: null, serviceRouteId: null, requestsPerMinute: 100, requestsPerHour: 5000, requestsPerDay: 100000, notes: "" });
  };

  const getServiceRouteName = (id: number | null) => !id ? "All Routes" : serviceRoutes?.find((r) => r.id === id)?.serviceName || `Route ${id}`;
  const getApiKeyName = (id: number | null) => !id ? "All Keys" : apiKeys?.find((k) => k.id === id)?.keyName || `Key ${id}`;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Rate Limits</h1>
            <p className="text-sm text-muted-foreground">Configure rate limiting rules</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" />Create Rate Limit</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Rate Limit</DialogTitle>
                <DialogDescription>Define a new rate limiting rule</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Service Route</Label>
                  <Select value={formData.serviceRouteId?.toString() || ""} onValueChange={(v) => setFormData({ ...formData, serviceRouteId: v ? parseInt(v) : null })}>
                    <SelectTrigger><SelectValue placeholder="All Routes (Global)" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Routes</SelectItem>
                      {serviceRoutes?.map((r) => <SelectItem key={r.id} value={r.id.toString()}>{r.serviceName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Select value={formData.apiKeyId?.toString() || ""} onValueChange={(v) => setFormData({ ...formData, apiKeyId: v ? parseInt(v) : null })}>
                    <SelectTrigger><SelectValue placeholder="All API Keys" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All API Keys</SelectItem>
                      {apiKeys?.filter((k) => k.isActive).map((k) => <SelectItem key={k.id} value={k.id.toString()}>{k.keyName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Per Minute</Label>
                    <Input type="number" value={formData.requestsPerMinute} onChange={(e) => setFormData({ ...formData, requestsPerMinute: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Per Hour</Label>
                    <Input type="number" value={formData.requestsPerHour} onChange={(e) => setFormData({ ...formData, requestsPerHour: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Per Day</Label>
                    <Input type="number" value={formData.requestsPerDay} onChange={(e) => setFormData({ ...formData, requestsPerDay: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Optional notes" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={createMutation.isPending}>{createMutation.isPending ? "Creating..." : "Create"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="text-destructive">Failed to load rate limits</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Route</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead className="text-right">Per Min</TableHead>
                  <TableHead className="text-right">Per Hour</TableHead>
                  <TableHead className="text-right">Per Day</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(7)].map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}
                    </TableRow>
                  ))
                ) : !rateLimits?.length ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No rate limits configured</TableCell></TableRow>
                ) : (
                  rateLimits.map((limit) => (
                    <TableRow key={limit.id}>
                      <TableCell className="font-medium">{getServiceRouteName(limit.serviceRouteId)}</TableCell>
                      <TableCell>{getApiKeyName(limit.apiKeyId)}</TableCell>
                      <TableCell className="text-right font-mono">{limit.requestsPerMinute.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">{limit.requestsPerHour.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">{limit.requestsPerDay.toLocaleString()}</TableCell>
                      <TableCell><StatusBadge variant={limit.isActive ? "success" : "muted"}>{limit.isActive ? "Active" : "Inactive"}</StatusBadge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggle(limit.id)}><Power className={`h-4 w-4 ${limit.isActive ? "text-success" : ""}`} /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(limit.id)}><Trash2 className="h-4 w-4" /></Button>
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
