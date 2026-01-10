import { motion } from "framer-motion";
import { Save, RefreshCw, Bell, Shield, Database, Globe } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Configure global settings for your NexusGate instance
            </p>
          </div>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Redis Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <CardTitle>Redis Configuration</CardTitle>
                </div>
                <CardDescription>
                  Configure your Redis connection for rate limit state storage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="redisHost">Host</Label>
                    <Input id="redisHost" defaultValue="redis.nexusgate.io" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="redisPort">Port</Label>
                    <Input id="redisPort" type="number" defaultValue="6379" />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-0.5">
                    <Label>Enable TLS</Label>
                    <p className="text-xs text-muted-foreground">
                      Encrypt Redis connection with TLS
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Test Connection
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Global Rate Limits */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Global Rate Limits</CardTitle>
                </div>
                <CardDescription>
                  Set default rate limits applied to all new API registrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultRequests">Default Requests</Label>
                    <Input id="defaultRequests" type="number" defaultValue="1000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultWindow">Time Window</Label>
                    <Select defaultValue="minute">
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
                  <div className="space-y-2">
                    <Label htmlFor="defaultAlgorithm">Algorithm</Label>
                    <Select defaultValue="token-bucket">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="token-bucket">Token Bucket</SelectItem>
                        <SelectItem value="fixed-window">Fixed Window</SelectItem>
                        <SelectItem value="sliding-window">Sliding Window</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <CardTitle>Notifications</CardTitle>
                </div>
                <CardDescription>
                  Configure alerts for rate limit violations and system events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-0.5">
                    <Label>Email Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive email notifications for critical events
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-0.5">
                    <Label>Slack Integration</Label>
                    <p className="text-xs text-muted-foreground">
                      Send alerts to your Slack workspace
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-0.5">
                    <Label>Webhook Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      POST events to a custom webhook URL
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Alert Threshold</Label>
                  <p className="text-xs text-muted-foreground">
                    Minimum number of violations per minute to trigger an alert
                  </p>
                  <Input type="number" defaultValue="10" className="w-32" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CORS Settings */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <CardTitle>CORS Settings</CardTitle>
                </div>
                <CardDescription>
                  Configure Cross-Origin Resource Sharing policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="allowedOrigins">Allowed Origins</Label>
                  <Input
                    id="allowedOrigins"
                    placeholder="https://example.com, https://app.example.com"
                    defaultValue="*"
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of allowed origins. Use * for all origins.
                  </p>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-0.5">
                    <Label>Allow Credentials</Label>
                    <p className="text-xs text-muted-foreground">
                      Include cookies in cross-origin requests
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}