import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "error" | "info" | "muted";

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  pulse?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  error: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-primary/10 text-primary border-primary/20",
  muted: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ variant, children, pulse, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        pulse && variant === "error" && "pulse-error",
        pulse && variant === "warning" && "pulse-warning",
        className
      )}
    >
      <span className={cn(
        "h-1.5 w-1.5 rounded-full",
        variant === "success" && "bg-success",
        variant === "warning" && "bg-warning",
        variant === "error" && "bg-destructive",
        variant === "info" && "bg-primary",
        variant === "muted" && "bg-muted-foreground"
      )} />
      {children}
    </span>
  );
}