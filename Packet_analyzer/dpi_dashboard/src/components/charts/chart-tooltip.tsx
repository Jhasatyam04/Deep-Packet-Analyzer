import type { ReactNode } from "react";

export function ChartTooltipFrame({ label, children }: { label?: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-sm">
      {label ? <p className="mb-1.5 font-medium text-muted-foreground">{label}</p> : null}
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export function ChartTooltipRow({
  color,
  name,
  value,
}: {
  color?: string;
  name: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className="inline-flex items-center gap-2">
        {color ? <span className="size-2 rounded-full" style={{ background: color }} /> : null}
        {name}
      </span>
      <span className="font-mono tabular-nums">{value}</span>
    </div>
  );
}
