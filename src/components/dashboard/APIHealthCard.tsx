import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

type HealthStatus = "healthy" | "degraded" | "down";

interface APIHealthCardProps {
  name: string;
  endpoint: string;
  status: HealthStatus;
  p95Latency: number;
  errorRate: number;
  rateLimitUsage: number;
  index?: number;
}

export function APIHealthCard({
  name,
  endpoint,
  status,
  p95Latency,
  errorRate,
  rateLimitUsage,
  index = 0,
}: APIHealthCardProps) {
  const statusConfig = {
    healthy: {
      label: "Healthy",
      dotColor: "bg-success",
      borderColor: "border-border hover:border-success/30",
      pulse: false,
    },
    degraded: {
      label: "Degraded",
      dotColor: "bg-warning",
      borderColor: "border-warning/30 pulse-warning",
      pulse: true,
    },
    down: {
      label: "Down",
      dotColor: "bg-destructive",
      borderColor: "border-destructive/30 pulse-error",
      pulse: true,
    },
  };

  const config = statusConfig[status];

  const getRateLimitColor = (usage: number) => {
    if (usage >= 90) return "bg-destructive";
    if (usage >= 70) return "bg-warning";
    return "bg-success";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/apis/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-"))}`}
        className={cn(
          "group block rounded-lg border bg-card p-4 transition-all hover:shadow-lg hover:shadow-primary/5",
          config.borderColor
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <motion.div
                className={cn("h-2 w-2 rounded-full", config.dotColor)}
                animate={config.pulse ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <h4 className="font-medium">{name}</h4>
              <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground font-mono">{endpoint}</p>
          </div>
          <span className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium",
            status === "healthy" && "bg-success/10 text-success",
            status === "degraded" && "bg-warning/10 text-warning",
            status === "down" && "bg-destructive/10 text-destructive"
          )}>
            {config.label}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">P95 Latency</p>
            <p className={cn(
              "mt-0.5 font-mono text-sm font-medium",
              p95Latency > 500 && "text-warning",
              p95Latency > 1000 && "text-destructive"
            )}>
              {p95Latency}ms
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Error Rate</p>
            <p className={cn(
              "mt-0.5 font-mono text-sm font-medium",
              errorRate > 1 && "text-warning",
              errorRate > 5 && "text-destructive"
            )}>
              {errorRate}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Rate Limit</p>
            <div className="mt-1.5 flex items-center gap-2">
              <Progress 
                value={rateLimitUsage} 
                className="h-1.5 flex-1"
                indicatorClassName={getRateLimitColor(rateLimitUsage)}
              />
              <span className="font-mono text-xs">{rateLimitUsage}%</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}