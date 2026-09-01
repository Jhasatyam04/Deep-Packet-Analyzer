import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartTooltipFrame, ChartTooltipRow } from "@/components/charts/chart-tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/status/widget-states";
import { appColor } from "@/lib/app-meta";
import { formatInteger, formatPercent } from "@/lib/format";
import type { ApplicationStat } from "@/types/dpi";

export function AppDonut({
  data,
  isLoading,
  error,
  onRetry,
}: {
  data: ApplicationStat[] | undefined;
  isLoading: boolean;
  error: unknown;
  onRetry?: () => void;
}) {
  if (isLoading && !data) return <Skeleton className="mx-auto h-56 w-56 rounded-full" />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (!data?.length) {
    return <EmptyState title="No applications" description="The engine has not classified any application traffic yet." />;
  }

  const total = data.reduce((s, d) => s + d.packets, 0);

  return (
    <div className="relative mx-auto h-56 w-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="packets" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={1.5} stroke="none">
            {data.map((row) => (
              <Cell key={row.name} fill={appColor(row.name)} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0].payload as ApplicationStat;
              return (
                <ChartTooltipFrame label={row.name}>
                  <ChartTooltipRow name="Packets" value={formatInteger(row.packets)} />
                  <ChartTooltipRow name="Share" value={formatPercent(row.percent)} />
                </ChartTooltipFrame>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-mono text-xl tabular-nums">{data.length}</p>
        <p className="text-[0.6875rem] uppercase tracking-wider text-muted-foreground">Apps</p>
        <p className="font-mono text-[0.6875rem] tabular-nums text-muted-foreground">{formatInteger(total)} pkts</p>
      </div>
    </div>
  );
}
