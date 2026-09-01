import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltipFrame, ChartTooltipRow } from "@/components/charts/chart-tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/status/widget-states";
import { formatBytes, formatClock, formatInteger } from "@/lib/format";
import type { TimeSeriesPoint } from "@/types/dpi";

type Mode = "packets" | "bytes" | "disposition";

export function TrafficChart({
  data,
  mode,
  isLoading,
  error,
  onRetry,
}: {
  data: TimeSeriesPoint[] | undefined;
  mode: Mode;
  isLoading: boolean;
  error: unknown;
  onRetry?: () => void;
}) {
  const rows = useMemo(
    () =>
      (data ?? []).map((p) => ({
        ...p,
        label: formatClock(p.ts),
      })),
    [data],
  );

  if (isLoading && !data) return <Skeleton className="h-72 w-full" />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (!rows.length) {
    return <EmptyState title="No traffic series" description="The engine has not published time-series statistics for this session." />;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={28} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={56}
            tickFormatter={(v: number) => (mode === "bytes" ? formatBytes(v) : formatInteger(v))}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <ChartTooltipFrame label={String(label)}>
                  {payload.map((item) => (
                    <ChartTooltipRow
                      key={String(item.dataKey)}
                      color={String(item.color)}
                      name={String(item.name)}
                      value={
                        mode === "bytes"
                          ? formatBytes(Number(item.value ?? 0))
                          : formatInteger(Number(item.value ?? 0))
                      }
                    />
                  ))}
                </ChartTooltipFrame>
              );
            }}
          />
          {mode === "disposition" ? (
            <>
              <Area type="monotone" dataKey="forwarded" name="Forwarded" stroke="#3dcf8e" fill="#3dcf8e" fillOpacity={0.18} strokeWidth={1.5} />
              <Area type="monotone" dataKey="dropped" name="Dropped" stroke="#e25b6a" fill="#e25b6a" fillOpacity={0.18} strokeWidth={1.5} />
            </>
          ) : mode === "bytes" ? (
            <Area type="monotone" dataKey="bytes" name="Bytes" stroke="#5eb1e7" fill="#5eb1e7" fillOpacity={0.16} strokeWidth={1.5} />
          ) : (
            <Area type="monotone" dataKey="packets" name="Packets" stroke="#5eb1e7" fill="#5eb1e7" fillOpacity={0.16} strokeWidth={1.5} />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
