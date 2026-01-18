import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Plus, Key, AlertTriangle, MoreVertical, Eye, EyeOff, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAPIKeys, useCreateAPIKey, useUpdateAPIKey, useDeleteAPIKey } from "@/hooks/use-api-keys";
import type { APIKey } from "@/lib/api";

export default function APIKeys() {
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyLimit, setNewKeyLimit] = useState("100000");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

  const { data: apiKeys, isLoading, error } = useAPIKeys();
  const createMutation = useCreateAPIKey();
  const updateMutation = useUpdateAPIKey();
  const deleteMutation = useDeleteAPIKey();

  const handleCreateKey = async () => {
    try {
      const result = await createMutation.mutateAsync({
        name: newKeyName,
        limit: parseInt(newKeyLimit),
      });
      // The API should return the full key only on creation
      if (result.key) {
        setGeneratedKey(result.key);
      } else {
        // Fallback for display purposes
        setGeneratedKey(`${result.prefix}...${Math.random().toString(36).substring(2, 34)}`);
      }
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

  const handleCopyKey = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      toast({
        title: "Copied to clipboard",
        description: "API key has been copied securely",
      });
    }
  };

  const handleRevokeKey = async (key: APIKey) => {
    try {
      await updateMutation.mutateAsync({
        id: key.id,
        payload: { status: "revoked" },
      });
      toast({
        title: "API key revoked",
        description: `${key.name} has been revoked`,
      });
    } catch (error) {
      toast({
        title: "Failed to revoke API key",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleDeleteKey = async (key: APIKey) => {
    if (!confirm(`Are you sure you want to delete ${key.name}?`)) return;
    
    try {
      await deleteMutation.mutateAsync(key.id);
      toast({
        title: "API key deleted",
        description: `${key.name} has been permanently removed`,
      });
    } catch (error) {
      toast({
        title: "Failed to delete API key",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const resetDialog = () => {
    setShowNewKey(false);
    setGeneratedKey(null);
    setNewKeyName("");
    setNewKeyLimit("100000");
    setShowKey(false);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "expired":
        return "warning";
      case "revoked":
        return "error";
      default:
        return "muted";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
                <DialogDescription>
                  Generate a new API key for authentication. The key will only be shown once.
                </DialogDescription>
              </DialogHeader>
              
              {!generatedKey ? (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyName">Key Name</Label>
                    <Input
                      id="keyName"
                      placeholder="e.g., Production Backend"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keyLimit">Usage Limit</Label>
                    <Input
                      id="keyLimit"
                      type="number"
                      placeholder="100000"
                      value={newKeyLimit}
                      onChange={(e) => setNewKeyLimit(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Maximum requests allowed</p>
                  </div>
                  <Alert className="border-warning bg-warning/10">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <AlertDescription className="text-warning">
                      This key will have full API access. Store it securely.
                    </AlertDescription>
                  </Alert>
                </div>
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
                          value={showKey ? generatedKey : generatedKey.replace(/./g, "•")}
                          readOnly
                          className="font-mono pr-10"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                          onClick={() => setShowKey(!showKey)}
                        >
                          {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Button variant="outline" size="icon" onClick={handleCopyKey}>
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
                    disabled={!newKeyName || createMutation.isPending}
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
                  <TableHead>Name</TableHead>
                  <TableHead>Key Prefix</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(4)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : !apiKeys?.length ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No API keys created yet
                    </TableCell>
                  </TableRow>
                ) : (
                  apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.name}</TableCell>
                      <TableCell>
                        <code className="rounded bg-secondary px-2 py-1 font-mono text-xs">
                          {key.prefix}...
                        </code>
                      </TableCell>
                      <TableCell>
                        <StatusBadge variant={getStatusVariant(key.status)}>
                          {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress
                            value={(key.usage / key.limit) * 100}
                            className="h-1.5 w-20"
                            indicatorClassName={
                              key.usage / key.limit >= 0.9
                                ? "bg-destructive"
                                : key.usage / key.limit >= 0.7
                                ? "bg-warning"
                                : "bg-success"
                            }
                          />
                          <span className="font-mono text-xs text-muted-foreground">
                            {key.usage.toLocaleString()} / {key.limit.toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(key.createdAt)}
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
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Regenerate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {key.status === "active" && (
                              <DropdownMenuItem
                                className="text-warning"
                                onClick={() => handleRevokeKey(key)}
                              >
                                Revoke Key
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteKey(key)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Key
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
      </div>
    </DashboardLayout>
  );
}
