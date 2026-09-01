import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TrafficChart } from "@/components/charts/traffic-chart";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStats } from "@/hooks/use-dpi";
import { formatBps, formatBytes, formatCompact, formatInteger, formatPercent } from "@/lib/format";

export const Route = createFileRoute("/_dash/traffic")({
  component: TrafficPage,
});

function TrafficPage() {
  const stats = useStats();
  const [mode, setMode] = useState<"packets" | "bytes" | "disposition">("packets");
  const overview = stats.data?.overview;

  return (
    <div>
      <PageHeader
        title="Traffic"
        description="Packets and bytes processed by the engine over the current session."
      />
      {overview ? (
        <div className="mb-4 grid gap-3 sm:grid-cols-4">
          <MiniStat label="Packets" value={formatInteger(overview.totalPackets)} hint={`${formatCompact(overview.packetsPerSec ?? 0)} pkt/s`} />
          <MiniStat label="Bytes" value={formatBytes(overview.totalBytes)} hint={formatBps(overview.throughputBps ?? 0)} />
          <MiniStat label="Forwarded" value={formatPercent(overview.forwardedPercent, 0)} hint={formatInteger(overview.forwardedPackets)} />
          <MiniStat label="Dropped" value={formatPercent(overview.droppedPercent, 0)} hint={formatInteger(overview.droppedPackets)} />
        </div>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>Session series</CardTitle>
          <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
            <TabsList>
              <TabsTrigger value="packets">Packets</TabsTrigger>
              <TabsTrigger value="bytes">Bytes</TabsTrigger>
              <TabsTrigger value="disposition">Forwarded / dropped</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <TrafficChart
            data={stats.data?.timeseries}
            mode={mode}
            isLoading={stats.isLoading}
            error={stats.error}
            onRetry={() => stats.refetch()}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function MiniStat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-lg tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
