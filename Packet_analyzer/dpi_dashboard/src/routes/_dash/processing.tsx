import { createFileRoute } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { SessionStatusBadge } from "@/components/status/status-badge";
import { ErrorState, KpiSkeleton } from "@/components/status/widget-states";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useReprocess, useSession } from "@/hooks/use-dpi";
import { formatBytes, formatDateTime, formatDuration, formatInteger, formatPercent } from "@/lib/format";

export const Route = createFileRoute("/_dash/processing")({
  component: ProcessingPage,
});

function ProcessingPage() {
  const session = useSession();
  const reprocess = useReprocess();
  const data = session.data;

  return (
    <div>
      <PageHeader
        title="Processing session"
        description="Current PCAP inspection run: input, output, duration, and engine-reported totals."

      />

      {session.isLoading && !data ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <KpiSkeleton key={i} />
          ))}
        </div>
      ) : session.isError ? (
        <Card>
          <ErrorState error={session.error} onRetry={() => session.refetch()} />
        </Card>
      ) : data ? (
        <>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Session {data.id}</CardTitle>
              <SessionStatusBadge status={data.status} />
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Meta label="Input PCAP" value={data.inputPcap} mono />
                <Meta label="Output PCAP" value={data.outputPcap ?? "—"} mono />
                <Meta label="Started" value={formatDateTime(data.startTime)} />
                <Meta label="Ended" value={formatDateTime(data.endTime)} />
                <Meta label="Duration" value={formatDuration(data.durationMs)} />
                <Meta label="Active rules" value={formatInteger(data.activeRules)} />
              </dl>
              {data.progress != null ? (
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{data.status === "processing" ? "Processing capture" : "Progress"}</span>
                    <span className="font-mono tabular-nums">{formatPercent(data.progress, 0)}</span>
                  </div>
                  <Progress value={data.progress} />
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">No processing session is currently loaded.</p>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Total packets" value={formatInteger(data.totalPackets)} />
            <Stat label="Total bytes" value={formatBytes(data.totalBytes)} />
            <Stat label="Forwarded" value={formatInteger(data.forwardedPackets)} />
            <Stat label="Dropped" value={formatInteger(data.droppedPackets)} />
            <Stat label="Flows" value={formatInteger(data.flows)} />
            <Stat label="Applications" value={formatInteger(data.applications)} />
            <Stat label="Detected domains" value={formatInteger(data.domains)} />
            <Stat label="Active rules" value={formatInteger(data.activeRules)} />
          </div>
        </>
      ) : null}
    </div>
  );
}

function Meta({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
      <dd className={`mt-1 ${mono ? "font-mono text-xs" : "text-sm"}`}>{value}</dd>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-lg tabular-nums">{value}</p>
    </div>
  );
}
