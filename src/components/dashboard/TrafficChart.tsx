import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TimeRange = "1m" | "5m" | "15m";
type ViewMode = "global" | "per-api" | "per-key";

interface TrafficChartProps {
  className?: string;
}

// Generate mock data
const generateData = (points: number) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 5000).toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit",
      second: "2-digit" 
    }),
    requests: Math.floor(Math.random() * 500 + 800),
    success: Math.floor(Math.random() * 450 + 750),
    errors: Math.floor(Math.random() * 30 + 10),
  }));
};

export function TrafficChart({ className }: TrafficChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("5m");
  const [viewMode, setViewMode] = useState<ViewMode>("global");

  const data = useMemo(() => {
    const points = timeRange === "1m" ? 12 : timeRange === "5m" ? 30 : 45;
    return generateData(points);
  }, [timeRange]);

  const timeRanges: TimeRange[] = ["1m", "5m", "15m"];
  const viewModes: { value: ViewMode; label: string }[] = [
    { value: "global", label: "Global" },
    { value: "per-api", label: "Per API" },
    { value: "per-key", label: "Per Key" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-lg border border-border bg-card p-5", className)}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Live Traffic</h3>
          <p className="text-sm text-muted-foreground">Requests per second across all endpoints</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex rounded-md border border-border">
            {viewModes.map((mode) => (
              <Button
                key={mode.value}
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-none border-r border-border px-3 last:border-r-0",
                  viewMode === mode.value && "bg-secondary"
                )}
                onClick={() => setViewMode(mode.value)}
              >
                {mode.label}
              </Button>
            ))}
          </div>

          {/* Time Range Toggle */}
          <div className="flex rounded-md border border-border">
            {timeRanges.map((range) => (
              <Button
                key={range}
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-none border-r border-border px-3 last:border-r-0",
                  timeRange === range && "bg-secondary"
                )}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 500 }}
              itemStyle={{ color: "hsl(var(--muted-foreground))" }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              iconSize={8}
            />
            <Line
              type="monotone"
              dataKey="requests"
              name="Total Requests"
              stroke="hsl(var(--chart-primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="success"
              name="Success"
              stroke="hsl(var(--chart-success))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="errors"
              name="Errors"
              stroke="hsl(var(--chart-error))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}