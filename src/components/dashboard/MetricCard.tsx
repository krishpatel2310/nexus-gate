import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type MetricStatus = "normal" | "warning" | "critical";
type TrendDirection = "up" | "down" | "neutral";

interface MetricCardProps {
  label: string;
  value: number | string;
  unit?: string;
  trend?: {
    direction: TrendDirection;
    value: string;
    isPositive?: boolean;
  };
  status?: MetricStatus;
  tooltip?: string;
  icon?: ReactNode;
  animate?: boolean;
}

export function MetricCard({
  label,
  value,
  unit,
  trend,
  status = "normal",
  tooltip,
  icon,
  animate = true,
}: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(typeof value === "number" ? 0 : value);

  useEffect(() => {
    if (typeof value === "number" && animate) {
      const duration = 500;
      const start = performance.now();
      const startValue = typeof displayValue === "number" ? displayValue : 0;

      const animateValue = (currentTime: number) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (value - startValue) * easeProgress;
        setDisplayValue(Math.round(currentValue * 100) / 100);

        if (progress < 1) {
          requestAnimationFrame(animateValue);
        }
      };

      requestAnimationFrame(animateValue);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  const statusStyles = {
    normal: "border-border",
    warning: "border-warning/30 pulse-warning",
    critical: "border-destructive/30 pulse-error",
  };

  const TrendIcon = trend?.direction === "up" ? TrendingUp : trend?.direction === "down" ? TrendingDown : Minus;

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-lg border bg-card p-4 transition-all hover:border-primary/30",
        statusStyles[status]
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className={cn(
          "font-mono text-2xl font-semibold",
          status === "critical" && "text-destructive",
          status === "warning" && "text-warning",
          status === "normal" && "text-foreground"
        )}>
          {typeof displayValue === "number" ? displayValue.toLocaleString() : displayValue}
        </span>
        {unit && (
          <span className="text-sm text-muted-foreground">{unit}</span>
        )}
      </div>

      {trend && (
        <div className="mt-2 flex items-center gap-1.5">
          <TrendIcon className={cn(
            "h-3 w-3",
            trend.isPositive ? "text-success" : "text-destructive"
          )} />
          <span className={cn(
            "text-xs font-medium",
            trend.isPositive ? "text-success" : "text-destructive"
          )}>
            {trend.value}
          </span>
        </div>
      )}
    </motion.div>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}