import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ThreadHealthBadge } from "@/components/status/status-badge";
import { EmptyState, ErrorState, PanelSkeleton } from "@/components/status/widget-states";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useThreads } from "@/hooks/use-dpi";
import { formatCompact, formatInteger, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ThreadStat } from "@/types/dpi";

export const Route = createFileRoute("/_dash/system")({
  component: SystemPage,
});

function SystemPage() {
  const threads = useThreads();
  const byId = new Map((threads.data ?? []).map((t) => [t.id, t]));
  const reader = byId.get("reader");
  const lbs = [byId.get("lb-0"), byId.get("lb-1")].filter(Boolean) as ThreadStat[];
  const fps = ["fp-0", "fp-1", "fp-2", "fp-3"].map((id) => byId.get(id)).filter(Boolean) as ThreadStat[];
  const writer = byId.get("writer");

  return (
    <div>
      <PageHeader
        title="System performance"
        description="Reader, load-balancer, fast-path, and writer threads as reported by the engine."
      />
      {threads.isLoading && !threads.data ? (
        <PanelSkeleton rows={8} />
      ) : threads.isError ? (
        <Card>
          <ErrorState error={threads.error} onRetry={() => threads.refetch()} />
        </Card>
      ) : !threads.data?.length ? (
        <EmptyState title="No thread statistics" description="The engine has not published LB/FP telemetry for this session." />
      ) : (
        <>
          <div className="flex flex-col items-center gap-3">
            {reader ? <ThreadCard thread={reader} className="w-full max-w-md" /> : null}
            <ArrowDown className="size-4 text-muted-foreground" aria-hidden />
            <div className="grid w-full gap-3 md:grid-cols-2">
              {lbs.map((lb) => (
                <div key={lb.id} className="flex flex-col items-center gap-3">
                  <ThreadCard thread={lb} className="w-full" />
                  <ArrowDown className="size-4 text-muted-foreground" aria-hidden />
                  <div className="grid w-full grid-cols-2 gap-3">
                    {fps
                      .filter((fp) => fp.parentId === lb.id)
                      .map((fp) => (
                        <ThreadCard key={fp.id} thread={fp} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
            <ArrowDown className="size-4 text-muted-foreground" aria-hidden />
            {writer ? <ThreadCard thread={writer} className="w-full max-w-md" /> : null}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Thread table</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[40rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground">
                      <th className="px-3 py-2 font-medium">Thread</th>
                      <th className="px-3 py-2 font-medium">Role</th>
                      <th className="px-3 py-2 font-medium">Packets</th>
                      <th className="px-3 py-2 font-medium">Rate</th>
                      <th className="px-3 py-2 font-medium">Utilization</th>
                      <th className="px-3 py-2 font-medium">Queue</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {threads.data.map((t) => (
                      <tr key={t.id} className="border-b border-border">
                        <td className="px-3 py-2 font-medium">{t.name}</td>
                        <td className="px-3 py-2 text-muted-foreground">{roleLabel(t.role)}</td>
                        <td className="px-3 py-2 font-mono text-xs tabular-nums">{formatInteger(t.packets)}</td>
                        <td className="px-3 py-2 font-mono text-xs tabular-nums">
                          {t.rate != null ? `${formatCompact(t.rate)} pkt/s` : "—"}
                        </td>
                        <td className="px-3 py-2 font-mono text-xs tabular-nums">{formatPercent(t.utilization, 0)}</td>
                        <td className="px-3 py-2 font-mono text-xs tabular-nums">
                          {t.queueDepth != null && t.queueCapacity != null
                            ? `${t.queueDepth}/${t.queueCapacity}`
                            : "—"}
                        </td>
                        <td className="px-3 py-2">
                          <ThreadHealthBadge status={t.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function roleLabel(role: ThreadStat["role"]): string {
  if (role === "load_balancer") return "Load balancer";
  if (role === "fast_path") return "Fast path";
  if (role === "reader") return "Reader";
  return "Writer";
}

function ThreadCard({ thread, className }: { thread: ThreadStat; className?: string }) {
  const queuePct =
    thread.queueDepth != null && thread.queueCapacity
      ? (thread.queueDepth / thread.queueCapacity) * 100
      : null;
  return (
    <Card className={cn(thread.status === "warning" && "border-warning/40", className)}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium">{thread.name}</p>
            <p className="text-xs text-muted-foreground">{roleLabel(thread.role)}</p>
          </div>
          <ThreadHealthBadge status={thread.status} />
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <dt className="text-muted-foreground">Packets</dt>
            <dd className="font-mono tabular-nums">{formatInteger(thread.packets)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Rate</dt>
            <dd className="font-mono tabular-nums">
              {thread.rate != null ? `${formatCompact(thread.rate)} pkt/s` : "—"}
            </dd>
          </div>
        </dl>
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>Utilization</span>
            <span className="font-mono tabular-nums">{formatPercent(thread.utilization, 0)}</span>
          </div>
          <Progress value={thread.utilization} />
        </div>
        {queuePct != null ? (
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>Queue</span>
              <span className="font-mono tabular-nums">
                {thread.queueDepth}/{thread.queueCapacity}
              </span>
            </div>
            <Progress value={queuePct} className={queuePct >= 70 ? "[&>div]:bg-warning" : undefined} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
