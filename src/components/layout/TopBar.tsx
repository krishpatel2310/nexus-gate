import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Database,
  User,
  LogOut,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

type Environment = "development" | "production";
type SystemHealth = "healthy" | "degraded" | "critical";

interface TopBarProps {
  environment?: Environment;
  systemHealth?: SystemHealth;
  redisConnected?: boolean;
}

export function TopBar({
  environment = "production",
  systemHealth = "healthy",
  redisConnected = true,
}: TopBarProps) {
  const [env, setEnv] = useState<Environment>(environment);
  const { user, logout, isAuthenticated } = useAuth();

  const healthConfig = {
    healthy: { label: "All Systems Operational", color: "bg-success" },
    degraded: { label: "Degraded Performance", color: "bg-warning" },
    critical: { label: "Critical Issues", color: "bg-destructive" },
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        {/* Environment Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-2",
                env === "production" && "border-warning/50 bg-warning/10 text-warning hover:bg-warning/20"
              )}
            >
              <span className={cn(
                "h-2 w-2 rounded-full",
                env === "production" ? "bg-warning" : "bg-success"
              )} />
              {env === "production" ? "Production" : "Development"}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setEnv("development")}>
              <span className="mr-2 h-2 w-2 rounded-full bg-success" />
              Development
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEnv("production")}>
              <span className="mr-2 h-2 w-2 rounded-full bg-warning" />
              Production
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* System Health */}
        <div className="flex items-center gap-2">
          <motion.div
            className={cn("h-2 w-2 rounded-full", healthConfig[systemHealth].color)}
            animate={systemHealth !== "healthy" ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <span className="text-sm text-muted-foreground">
            {healthConfig[systemHealth].label}
          </span>
        </div>

        {/* Redis Status */}
        <div className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5">
          <Database className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Redis</span>
          <span className={cn(
            "h-2 w-2 rounded-full",
            redisConnected ? "bg-success" : "bg-destructive"
          )} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
            3
          </span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary">
                <User className="h-4 w-4" />
              </div>
              <span className="text-sm">{user?.fullName || user?.email || "Admin"}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
