import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Info, Check } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function RateLimits() {
  const [requests, setRequests] = useState("1000");
  const [timeUnit, setTimeUnit] = useState("minute");
  const [algorithm, setAlgorithm] = useState("token-bucket");
  const [burstEnabled, setBurstEnabled] = useState(true);
  const [burstSize, setBurstSize] = useState("100");
  const [isProduction, setIsProduction] = useState(true);

  const effectiveThroughput = parseInt(requests) / (timeUnit === "second" ? 1 : timeUnit === "minute" ? 60 : 3600);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Rate Limit Configuration</h1>
          <p className="text-sm text-muted-foreground">
            Configure rate limiting rules for your API endpoints
          </p>
        </div>

        {isProduction && (
          <Alert variant="destructive" className="border-warning bg-warning/10">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertTitle className="text-warning">Production Environment</AlertTitle>
            <AlertDescription className="text-warning/80">
              Changes will affect live traffic. A confirmation step is required before saving.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* Configuration Form */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Rate Limit Rules</CardTitle>
                <CardDescription>
                  Define the maximum number of requests allowed per time window
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                    <Select value={timeUnit} onValueChange={setTimeUnit}>
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
                  <p className="text-xs text-muted-foreground">
                    {algorithm === "token-bucket" && "Allows burst traffic while maintaining average rate"}
                    {algorithm === "fixed-window" && "Simple counter reset at fixed intervals"}
                    {algorithm === "sliding-window" && "Precise rate limiting with timestamp tracking"}
                    {algorithm === "leaky-bucket" && "Smooths out bursts into steady output rate"}
                  </p>
                </div>

                <div className="space-y-4 rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Burst</Label>
                      <p className="text-xs text-muted-foreground">
                        Enable temporary request spikes above the limit
                      </p>
                    </div>
                    <Switch
                      checked={burstEnabled}
                      onCheckedChange={setBurstEnabled}
                    />
                  </div>
                  
                  {burstEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-2"
                    >
                      <Label htmlFor="burstSize">Burst Size</Label>
                      <Input
                        id="burstSize"
                        type="number"
                        value={burstSize}
                        onChange={(e) => setBurstSize(e.target.value)}
                        min="1"
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum requests allowed in a burst
                      </p>
                    </motion.div>
                  )}
                </div>

                <Button className="w-full" disabled={!requests || parseInt(requests) < 1}>
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Live Preview */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  Configuration Preview
                </CardTitle>
                <CardDescription>
                  See how your configuration will behave in practice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Burst Allowed</span>
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
                    <span className="text-sm text-muted-foreground">Effective Throughput</span>
                    <span className="font-mono font-medium">
                      {effectiveThroughput.toFixed(2)} req/sec
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Algorithm</span>
                    <span className="font-medium capitalize">
                      {algorithm.replace("-", " ")}
                    </span>
                  </div>
                  {burstEnabled && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Max Burst</span>
                      <span className="font-mono font-medium">{burstSize} requests</span>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-border p-4">
                  <h4 className="mb-3 text-sm font-medium">When limit is exceeded:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-destructive" />
                      <span>
                        Returns <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">HTTP 429 Too Many Requests</code>
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-destructive" />
                      <span>
                        <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">Retry-After</code> header included
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-destructive" />
                      <span>Event logged to violations stream</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}