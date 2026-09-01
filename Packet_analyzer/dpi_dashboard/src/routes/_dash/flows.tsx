import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { TrafficStatusBadge } from "@/components/status/status-badge";
import { EmptyState, ErrorState, PanelSkeleton } from "@/components/status/widget-states";
import { Pagination, SortButton, Table, TableWrap, Td, Th, THead } from "@/components/tables/simple-table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useApplications, useDebouncedValue, useFlow, useFlows } from "@/hooks/use-dpi";
import { formatBytes, formatDateTime, formatInteger } from "@/lib/format";
import type { FlowDisposition } from "@/types/dpi";

export const Route = createFileRoute("/_dash/flows")({
  component: FlowsPage,
});

function FlowsPage() {
  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q);
  const [status, setStatus] = useState<FlowDisposition | "all">("all");
  const [application, setApplication] = useState("all");
  const [sort, setSort] = useState("packets");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);

  const apps = useApplications();
  const query = {
    q: debouncedQ,
    status,
    application: application === "all" ? undefined : application,
    sort,
    dir,
    page,
    pageSize: 12,
  };
  const flows = useFlows(query);
  const detail = useFlow(selected);

  function toggle(key: string) {
    if (sort === key) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSort(key);
      setDir("desc");
    }
    setPage(1);
  }

  return (
    <div>
      <PageHeader title="Flows" description="Five-tuple connections tracked by the engine during this session." />
      <Card>
        <CardContent className="pt-4">
          <div className="mb-4 flex flex-wrap gap-2">
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search IP, port, app, domain"
              className="max-w-xs"
            />
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v as FlowDisposition | "all");
                setPage(1);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="forwarded">Forwarded</SelectItem>
                <SelectItem value="dropped">Dropped</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={application}
              onValueChange={(v) => {
                setApplication(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Application" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All applications</SelectItem>
                {(apps.data ?? []).map((a) => (
                  <SelectItem key={a.name} value={a.name}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {flows.isLoading && !flows.data ? (
            <PanelSkeleton rows={8} />
          ) : flows.isError ? (
            <ErrorState error={flows.error} onRetry={() => flows.refetch()} />
          ) : !flows.data?.items.length ? (
            <EmptyState title="No flows" description="No tracked connections match the current filters." />
          ) : (
            <>
              <TableWrap>
                <Table className="min-w-[64rem]">
                  <THead>
                    <Th>Source</Th>
                    <Th>Destination</Th>
                    <Th>Src port</Th>
                    <Th>Dst port</Th>
                    <Th>Protocol</Th>
                    <Th>
                      <SortButton label="Application" active={sort === "application"} dir={dir} onClick={() => toggle("application")} />
                    </Th>
                    <Th>Domain</Th>
                    <Th>
                      <SortButton label="Packets" active={sort === "packets"} dir={dir} onClick={() => toggle("packets")} />
                    </Th>
                    <Th>Status</Th>
                  </THead>
                  <tbody>
                    {flows.data.items.map((row) => (
                      <tr
                        key={row.id}
                        className="cursor-pointer hover:bg-elevated/60"
                        onClick={() => setSelected(row.id)}
                      >
                        <Td mono>{row.srcIp}</Td>
                        <Td mono>{row.dstIp}</Td>
                        <Td mono>{row.srcPort}</Td>
                        <Td mono>{row.dstPort}</Td>
                        <Td mono>{row.protocol}</Td>
                        <Td>{row.application}</Td>
                        <Td mono>{row.domain ?? "—"}</Td>
                        <Td mono>{formatInteger(row.packets)}</Td>
                        <Td>
                          <TrafficStatusBadge status={row.status} />
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrap>
              <Pagination page={flows.data.page} pageSize={flows.data.pageSize} total={flows.data.total} onPage={setPage} />
            </>
          )}
        </CardContent>
      </Card>

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{detail.data ? `${detail.data.srcIp} → ${detail.data.dstIp}` : "Flow"}</SheetTitle>
            <SheetDescription>Five-tuple and classification as reported by the engine.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-auto px-5 py-4">
            {detail.isLoading ? (
              <PanelSkeleton rows={8} />
            ) : detail.isError ? (
              <ErrorState error={detail.error} onRetry={() => detail.refetch()} />
            ) : detail.data ? (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <Meta label="Flow ID" value={detail.data.id} mono />
                <Meta label="Protocol" value={detail.data.protocol} />
                <Meta label="Source" value={`${detail.data.srcIp}:${detail.data.srcPort}`} mono />
                <Meta label="Destination" value={`${detail.data.dstIp}:${detail.data.dstPort}`} mono />
                <Meta label="Application" value={detail.data.application} />
                <Meta label="Domain / SNI" value={detail.data.domain ?? "—"} mono />
                <Meta label="Packets" value={formatInteger(detail.data.packets)} mono />
                <Meta label="Bytes" value={formatBytes(detail.data.bytes)} mono />
                <Meta label="Disposition" value={detail.data.status} />
                <Meta label="Block reason" value={detail.data.blockReason ?? "—"} />
                <Meta label="First seen" value={formatDateTime(detail.data.firstSeen)} />
                <Meta label="Last seen" value={formatDateTime(detail.data.lastSeen)} />
              </dl>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Meta({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={mono ? "font-mono text-xs tabular-nums" : ""}>{value}</dd>
    </div>
  );
}
