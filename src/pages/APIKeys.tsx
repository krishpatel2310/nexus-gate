import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Plus, Key, AlertTriangle, MoreVertical, Eye, EyeOff } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface APIKey {
  id: string;
  name: string;
  prefix: string;
  status: "active" | "revoked" | "expired";
  usage: number;
  limit: number;
  createdAt: string;
  expiresAt: string | null;
}

const apiKeys: APIKey[] = [
  {
    id: "1",
    name: "Production Backend",
    prefix: "nxg_live_7kX9",
    status: "active",
    usage: 45230,
    limit: 100000,
    createdAt: "2024-01-15",
    expiresAt: "2025-01-15",
  },
  {
    id: "2",
    name: "Mobile App",
    prefix: "nxg_live_3mP2",
    status: "active",
    usage: 78900,
    limit: 100000,
    createdAt: "2024-02-20",
    expiresAt: null,
  },
  {
    id: "3",
    name: "Legacy Integration",
    prefix: "nxg_live_9qR5",
    status: "expired",
    usage: 0,
    limit: 50000,
    createdAt: "2023-06-01",
    expiresAt: "2024-06-01",
  },
  {
    id: "4",
    name: "Testing Key",
    prefix: "nxg_test_1aB4",
    status: "revoked",
    usage: 1200,
    limit: 10000,
    createdAt: "2024-03-01",
    expiresAt: null,
  },
];

export default function APIKeys() {
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

  const handleCreateKey = () => {
    // Simulate key generation
    const key = `nxg_live_${Math.random().toString(36).substring(2, 6)}_${Math.random().toString(36).substring(2, 34)}`;
    setGeneratedKey(key);
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
                  <Button onClick={handleCreateKey} disabled={!newKeyName}>
                    Generate Key
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setShowNewKey(false);
                      setGeneratedKey(null);
                      setNewKeyName("");
                      setShowKey(false);
                    }}
                  >
                    Done
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

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
              {apiKeys.map((key) => (
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
                    {key.createdAt}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {key.expiresAt || "Never"}
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
                        <DropdownMenuItem className="text-destructive">
                          Revoke Key
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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