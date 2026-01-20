import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Plus, Key, AlertTriangle, MoreVertical, Eye, EyeOff, Trash2, Pencil } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAPIKeys, useCreateAPIKey, useUpdateAPIKey, useDeleteAPIKey } from "@/hooks/use-api-keys";
import { useAuth } from "@/hooks/use-auth";
import type { APIKey, CreateAPIKeyPayload } from "@/lib/api";

export default function APIKeys() {
  const [showNewKey, setShowNewKey] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedKey, setSelectedKey] = useState<APIKey | null>(null);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showKeyValue, setShowKeyValue] = useState(false);
  const [formData, setFormData] = useState<CreateAPIKeyPayload>({
    keyName: "",
    clientName: "",
    clientEmail: "",
    clientCompany: "",
    createdByUserId: 1,
    expiresAt: "",
    notes: "",
  });

  const { user } = useAuth();
  const { data: apiKeys, isLoading, error } = useAPIKeys();
  const createMutation = useCreateAPIKey();
  const updateMutation = useUpdateAPIKey();
  const deleteMutation = useDeleteAPIKey();

  const handleCreateKey = async () => {
    try {
      const result = await createMutation.mutateAsync({
        ...formData,
        createdByUserId: user?.userId || 1,
        expiresAt: formData.expiresAt || undefined,
      });
      // The API returns the full keyValue on creation
      setGeneratedKey(result.keyValue);
      toast({
        title: "API key created",
        description: "Store this key securely - it won't be shown again",
      });
    } catch (error) {
      toast({
        title: "Failed to create API key",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleUpdateKey = async () => {
    if (!selectedKey) return;
    try {
      await updateMutation.mutateAsync({
        id: selectedKey.id,
        payload: {
          keyName: formData.keyName,
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          clientCompany: formData.clientCompany,
          expiresAt: formData.expiresAt || undefined,
          notes: formData.notes,
        },
      });
      toast({
        title: "API key updated",
        description: `${formData.keyName} has been updated`,
      });
      setShowEditDialog(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Failed to update API key",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleCopyKey = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to clipboard",
      description: "API key has been copied securely",
    });
  };

  const handleDeleteKey = async (key: APIKey) => {
    if (!confirm(`Are you sure you want to revoke ${key.keyName}?`)) return;
    
    try {
      await deleteMutation.mutateAsync(key.id);
      toast({
        title: "API key revoked",
        description: `${key.keyName} has been revoked`,
      });
    } catch (error) {
      toast({
        title: "Failed to revoke API key",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      keyName: "",
      clientName: "",
      clientEmail: "",
      clientCompany: "",
      createdByUserId: user?.userId || 1,
      expiresAt: "",
      notes: "",
    });
    setGeneratedKey(null);
    setShowKeyValue(false);
    setSelectedKey(null);
  };

  const resetDialog = () => {
    setShowNewKey(false);
    resetForm();
  };

  const openEditDialog = (key: APIKey) => {
    setSelectedKey(key);
    setFormData({
      keyName: key.keyName,
      clientName: key.clientName,
      clientEmail: key.clientEmail,
      clientCompany: key.clientCompany,
      createdByUserId: key.createdByUserId,
      expiresAt: key.expiresAt || "",
      notes: key.notes || "",
    });
    setShowEditDialog(true);
  };

  const openViewDialog = (key: APIKey) => {
    setSelectedKey(key);
    setShowViewDialog(true);
  };

  const getStatusVariant = (key: APIKey) => {
    if (!key.isActive) return "error";
    if (key.expiresAt && new Date(key.expiresAt) < new Date()) return "warning";
    return "success";
  };

  const getStatusLabel = (key: APIKey) => {
    if (!key.isActive) return "Revoked";
    if (key.expiresAt && new Date(key.expiresAt) < new Date()) return "Expired";
    return "Active";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  const maskKeyValue = (keyValue: string) => {
    if (keyValue.length <= 12) return "••••••••••••";
    return `${keyValue.slice(0, 6)}••••••${keyValue.slice(-4)}`;
  };

  const FormFields = () => (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="keyName">Key Name *</Label>
          <Input
            id="keyName"
            placeholder="e.g., Production Key - Acme Corp"
            value={formData.keyName}
            onChange={(e) => setFormData({ ...formData, keyName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name *</Label>
          <Input
            id="clientName"
            placeholder="e.g., Acme Corporation"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientEmail">Client Email *</Label>
          <Input
            id="clientEmail"
            type="email"
            placeholder="e.g., api@acme.com"
            value={formData.clientEmail}
            onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientCompany">Client Company</Label>
          <Input
            id="clientCompany"
            placeholder="e.g., Acme Technologies Ltd"
            value={formData.clientCompany}
            onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
        <Input
          id="expiresAt"
          type="datetime-local"
          value={formData.expiresAt}
          onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Additional notes about this key"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">API Keys</h1>
            <p className="text-sm text-muted-foreground">
              Manage authentication keys for your API access
            </p>
          </div>
          <Dialog open={showNewKey} onOpenChange={setShowNewKey}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create API Key
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
                <DialogDescription>
                  Generate a new API key for authentication. The key will only be shown once.
                </DialogDescription>
              </DialogHeader>
              
              {!generatedKey ? (
                <>
                  <FormFields />
                  <Alert className="border-warning bg-warning/10">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <AlertDescription className="text-warning">
                      This key will have full API access. Store it securely.
                    </AlertDescription>
                  </Alert>
                </>
              ) : (
                <div className="space-y-4 py-4">
                  <Alert className="border-success bg-success/10">
                    <Key className="h-4 w-4 text-success" />
                    <AlertDescription className="text-success">
                      API key created successfully. Copy it now - it won't be shown again.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <Label>Your API Key</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          value={showKeyValue ? generatedKey : generatedKey.replace(/./g, "•")}
                          readOnly
                          className="font-mono pr-10"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                          onClick={() => setShowKeyValue(!showKeyValue)}
                        >
                          {showKeyValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Button variant="outline" size="icon" onClick={() => handleCopyKey(generatedKey)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                {!generatedKey ? (
                  <Button
                    onClick={handleCreateKey}
                    disabled={!formData.keyName || !formData.clientName || !formData.clientEmail || createMutation.isPending}
                  >
                    {createMutation.isPending ? "Generating..." : "Generate Key"}
                  </Button>
                ) : (
                  <Button onClick={resetDialog}>Done</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="text-destructive">Failed to load API keys</p>
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
                  <TableHead>Key Name</TableHead>
                  <TableHead>Key Value</TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Client Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(4)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : !apiKeys?.length ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No API keys created yet
                    </TableCell>
                  </TableRow>
                ) : (
                  apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.keyName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-secondary px-2 py-1 font-mono text-xs">
                            {maskKeyValue(key.keyValue)}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleCopyKey(key.keyValue)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{key.clientName}</TableCell>
                      <TableCell className="text-muted-foreground">{key.clientEmail}</TableCell>
                      <TableCell className="text-muted-foreground">{key.clientCompany || "-"}</TableCell>
                      <TableCell>
                        <StatusBadge variant={getStatusVariant(key)}>
                          {getStatusLabel(key)}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(key.expiresAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openViewDialog(key)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditDialog(key)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteKey(key)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Revoke Key
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit API Key</DialogTitle>
              <DialogDescription>Update API key details</DialogDescription>
            </DialogHeader>
            <FormFields />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateKey}
                disabled={!formData.keyName || !formData.clientName || !formData.clientEmail || updateMutation.isPending}
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
              <DialogTitle>{selectedKey?.keyName}</DialogTitle>
              <DialogDescription>API key details</DialogDescription>
            </DialogHeader>
            {selectedKey && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Client Name</p>
                    <p className="font-medium">{selectedKey.clientName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Client Email</p>
                    <p>{selectedKey.clientEmail}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Company</p>
                    <p>{selectedKey.clientCompany || "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <StatusBadge variant={getStatusVariant(selectedKey)}>
                      {getStatusLabel(selectedKey)}
                    </StatusBadge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created At</p>
                    <p>{formatDate(selectedKey.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expires At</p>
                    <p>{formatDate(selectedKey.expiresAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Used</p>
                    <p>{formatDate(selectedKey.lastUsedAt)}</p>
                  </div>
                </div>
                {selectedKey.notes && (
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Notes</p>
                    <p className="text-sm">{selectedKey.notes}</p>
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
