import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { TrafficStatusBadge } from "@/components/status/status-badge";
import { EmptyState, ErrorState, PanelSkeleton } from "@/components/status/widget-states";
import { Pagination, SortButton, Table, TableWrap, Td, Th, THead } from "@/components/tables/simple-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useDebouncedValue, useDomain, useDomains } from "@/hooks/use-dpi";
import { formatBytes, formatDateTime, formatInteger } from "@/lib/format";
import type { AppDisposition } from "@/types/dpi";

export const Route = createFileRoute("/_dash/domains")({
  component: DomainsPage,
});

function DomainsPage() {
  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q);
  const [status, setStatus] = useState<AppDisposition | "all">("all");
  const [sort, setSort] = useState("packets");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);

  const query = { q: debouncedQ, status, sort, dir, page, pageSize: 12 };
  const domains = useDomains(query);
  const detail = useDomain(selected);

  function toggle(key: string) {
    if (sort === key) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSort(key);
      setDir(key === "domain" || key === "application" ? "asc" : "desc");
    }
    setPage(1);
  }

  return (
    <div>
      <PageHeader
        title="Detected domains"
        description="SNI and HTTP Host values extracted from TLS and HTTP traffic."
      />
      <Card>
        <CardContent className="pt-4">
          <div className="mb-4 flex flex-wrap gap-2">
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search domain or application"
              className="max-w-xs"
            />
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v as AppDisposition | "all");
                setPage(1);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="allowed">Allowed</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {domains.isLoading && !domains.data ? (
            <PanelSkeleton rows={8} />
          ) : domains.isError ? (
            <ErrorState error={domains.error} onRetry={() => domains.refetch()} />
          ) : !domains.data?.items.length ? (
            <EmptyState title="No domains detected" description="No SNI or HTTP Host records match the current filters." />
          ) : (
            <>
              <TableWrap>
                <Table>
                  <THead>
                    <Th>
                      <SortButton label="Domain" active={sort === "domain"} dir={dir} onClick={() => toggle("domain")} />
                    </Th>
                    <Th>
                      <SortButton label="Application" active={sort === "application"} dir={dir} onClick={() => toggle("application")} />
                    </Th>
                    <Th>
                      <SortButton label="Packets" active={sort === "packets"} dir={dir} onClick={() => toggle("packets")} />
                    </Th>
                    <Th>Source</Th>
                    <Th>Status</Th>
                  </THead>
                  <tbody>
                    {domains.data.items.map((row) => (
                      <tr
                        key={row.id}
                        className="cursor-pointer hover:bg-elevated/60"
                        onClick={() => setSelected(row.id)}
                      >
                        <Td mono>{row.domain}</Td>
                        <Td>{row.application}</Td>
                        <Td mono>{formatInteger(row.packets)}</Td>
                        <Td>
                          <Badge variant="outline">
                            {row.source === "both" ? "SNI + Host" : row.source === "sni" ? "TLS SNI" : "HTTP Host"}
                          </Badge>
                        </Td>
                        <Td>
                          <TrafficStatusBadge status={row.status} />
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrap>
              <Pagination
                page={domains.data.page}
                pageSize={domains.data.pageSize}
                total={domains.data.total}
                onPage={setPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{detail.data?.domain ?? "Domain"}</SheetTitle>
            <SheetDescription>Extracted by the DPI engine from TLS SNI or HTTP Host.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-auto px-5 py-4">
            {detail.isLoading ? (
              <PanelSkeleton rows={6} />
            ) : detail.isError ? (
              <ErrorState error={detail.error} onRetry={() => detail.refetch()} />
            ) : detail.data ? (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <Meta label="Application" value={detail.data.application} />
                <Meta label="Status" value={detail.data.status} />
                <Meta label="Packets" value={formatInteger(detail.data.packets)} mono />
                <Meta label="Bytes" value={formatBytes(detail.data.bytes)} mono />
                <Meta label="Flows" value={formatInteger(detail.data.flows)} mono />
                <Meta label="Source" value={detail.data.source} />
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
