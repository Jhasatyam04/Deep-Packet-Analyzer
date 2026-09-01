import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Ban, Boxes, GitBranch, Package, Radio } from "lucide-react";
import { KpiCard } from "@/components/cards/kpi-card";
import { AppDonut } from "@/components/charts/app-donut";
import { TrafficChart } from "@/components/charts/traffic-chart";
import { PageHeader } from "@/components/page-header";
import { TrafficStatusBadge } from "@/components/status/status-badge";
import { EmptyState, ErrorState, KpiSkeleton, PanelSkeleton } from "@/components/status/widget-states";
import { Table, TableWrap, Td, Th, THead } from "@/components/tables/simple-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplications, useDomains, useStats } from "@/hooks/use-dpi";
import { appIcon } from "@/lib/app-meta";
import { formatBps, formatBytes, formatCompact, formatInteger, formatPercent } from "@/lib/format";

export const Route = createFileRoute("/_dash/")({
  component: OverviewPage,
});

function OverviewPage() {
  const stats = useStats();
  const apps = useApplications();
  const domains = useDomains({ page: 1, pageSize: 6, sort: "packets", dir: "desc" });
  const overview = stats.data?.overview;

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Live view of packets, classification, and blocking from the DPI engine."
      />

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {stats.isLoading && !overview ? (
          Array.from({ length: 6 }).map((_, i) => <KpiSkeleton key={i} />)
        ) : stats.isError ? (
          <div className="sm:col-span-2 xl:col-span-3 2xl:col-span-6">
            <Card>
              <ErrorState error={stats.error} onRetry={() => stats.refetch()} />
            </Card>
          </div>
        ) : overview ? (
          <>
            <KpiCard
              label="Total packets"
              value={formatInteger(overview.totalPackets)}
              hint={overview.packetsPerSec != null ? `${formatCompact(overview.packetsPerSec)} pkt/s` : undefined}
              icon={Package}
            />
            <KpiCard
              label="Total bytes"
              value={formatBytes(overview.totalBytes)}
              hint={overview.throughputBps != null ? formatBps(overview.throughputBps) : undefined}
              icon={Radio}
              tone="info"
            />
            <KpiCard
              label="Forwarded"
              value={formatInteger(overview.forwardedPackets)}
              hint={formatPercent(overview.forwardedPercent)}
              icon={ArrowRight}
              tone="success"
            />
            <KpiCard
              label="Dropped"
              value={formatInteger(overview.droppedPackets)}
              hint={formatPercent(overview.droppedPercent)}
              icon={Ban}
              tone="danger"
            />
            <KpiCard
              label="Active flows"
              value={formatInteger(overview.activeFlows)}
              hint="Five-tuple tracked"
              icon={GitBranch}
            />
            <KpiCard
              label="Applications"
              value={formatInteger(overview.detectedApplications)}
              hint={`${formatInteger(overview.detectedDomains)} domains`}
              icon={Boxes}
              tone="info"
            />
          </>
        ) : null}
      </section>

      <section className="mt-5 grid gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Traffic</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/traffic">
                Open traffic
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <TrafficChart
              data={stats.data?.timeseries}
              mode="packets"
              isLoading={stats.isLoading}
              error={stats.error}
              onRetry={() => stats.refetch()}
            />
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/applications">
                All apps
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <AppDonut
              data={apps.data}
              isLoading={apps.isLoading}
              error={apps.error}
              onRetry={() => apps.refetch()}
            />
          </CardContent>
        </Card>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Application mix</CardTitle>
          </CardHeader>
          <CardContent>
            {apps.isLoading && !apps.data ? (
              <PanelSkeleton />
            ) : apps.isError ? (
              <ErrorState error={apps.error} onRetry={() => apps.refetch()} />
            ) : !apps.data?.length ? (
              <EmptyState title="No applications detected" description="Classification results will appear once the engine processes traffic." />
            ) : (
              <TableWrap>
                <Table className="min-w-[32rem]">
                  <THead>
                    <Th>Application</Th>
                    <Th>Packets</Th>
                    <Th>Share</Th>
                    <Th>Status</Th>
                  </THead>
                  <tbody>
                    {apps.data.slice(0, 8).map((row) => {
                      const Icon = appIcon(row.name);
                      return (
                        <tr key={row.name} className="hover:bg-elevated/60">
                          <Td>
                            <span className="inline-flex items-center gap-2">
                              <Icon className="size-3.5 text-muted-foreground" />
                              {row.name}
                            </span>
                          </Td>
                          <Td mono>{formatInteger(row.packets)}</Td>
                          <Td mono>{formatPercent(row.percent)}</Td>
                          <Td>
                            <TrafficStatusBadge status={row.status} />
                          </Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </TableWrap>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detected domains</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/domains">
                All domains
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {domains.isLoading && !domains.data ? (
              <PanelSkeleton />
            ) : domains.isError ? (
              <ErrorState error={domains.error} onRetry={() => domains.refetch()} />
            ) : !domains.data?.items.length ? (
              <EmptyState title="No domains detected" description="SNI and HTTP Host values extracted by the engine will appear here." />
            ) : (
              <TableWrap>
                <Table className="min-w-[32rem]">
                  <THead>
                    <Th>Domain</Th>
                    <Th>App</Th>
                    <Th>Packets</Th>
                    <Th>Status</Th>
                  </THead>
                  <tbody>
                    {domains.data.items.map((row) => (
                      <tr key={row.id} className="hover:bg-elevated/60">
                        <Td mono>{row.domain}</Td>
                        <Td>{row.application}</Td>
                        <Td mono>{formatInteger(row.packets)}</Td>
                        <Td>
                          <TrafficStatusBadge status={row.status} />
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrap>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
