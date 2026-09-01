import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "danger" | "info";
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <Icon
          className={cn(
            "size-4",
            tone === "success" && "text-success",
            tone === "danger" && "text-danger",
            tone === "info" && "text-info",
            tone === "default" && "text-muted-foreground",
          )}
          aria-hidden
        />
      </div>
      <p className="mt-2 font-mono text-xl font-medium tabular-nums tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </Card>
  );
}
