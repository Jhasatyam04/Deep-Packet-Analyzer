import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppDonut } from "@/components/charts/app-donut";
import { PageHeader } from "@/components/page-header";
import { TrafficStatusBadge } from "@/components/status/status-badge";
import { EmptyState, ErrorState, PanelSkeleton } from "@/components/status/widget-states";
import { SortButton, Table, TableWrap, Td, Th, THead } from "@/components/tables/simple-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplications } from "@/hooks/use-dpi";
import { appIcon } from "@/lib/app-meta";
import { formatBytes, formatInteger, formatPercent } from "@/lib/format";
import type { ApplicationStat } from "@/types/dpi";

export const Route = createFileRoute("/_dash/applications")({
  component: ApplicationsPage,
});

type SortKey = "name" | "packets" | "percent" | "bytes" | "flows" | "status";

export function ApplicationsPage() {
  const apps = useApplications();
  const [sort, setSort] = useState<SortKey>("packets");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const rows = useMemo(() => {
    const list = [...(apps.data ?? [])];
    list.sort((a, b) => {
      const av = a[sort];
      const bv = b[sort];
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return dir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [apps.data, sort, dir]);

  function toggle(key: SortKey) {
    if (sort === key) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSort(key);
      setDir(key === "name" || key === "status" ? "asc" : "desc");
    }
  }

  return (
    <div>
      <PageHeader
        title="Applications"
        description="Classification results from the DPI engine. Blocking status is evaluated against active rules."
      />
      <div className="grid gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <AppDonut data={apps.data} isLoading={apps.isLoading} error={apps.error} onRetry={() => apps.refetch()} />
          </CardContent>
        </Card>
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {apps.isLoading && !apps.data ? (
              <PanelSkeleton rows={8} />
            ) : apps.isError ? (
              <ErrorState error={apps.error} onRetry={() => apps.refetch()} />
            ) : !rows.length ? (
              <EmptyState title="No applications detected" description="The engine has not classified any flows in this session." />
            ) : (
              <TableWrap>
                <Table>
                  <THead>
                    <Th>
                      <SortButton label="Application" active={sort === "name"} dir={dir} onClick={() => toggle("name")} />
                    </Th>
                    <Th>
                      <SortButton label="Packets" active={sort === "packets"} dir={dir} onClick={() => toggle("packets")} />
                    </Th>
                    <Th>
                      <SortButton label="Bytes" active={sort === "bytes"} dir={dir} onClick={() => toggle("bytes")} />
                    </Th>
                    <Th>
                      <SortButton label="Share" active={sort === "percent"} dir={dir} onClick={() => toggle("percent")} />
                    </Th>
                    <Th>
                      <SortButton label="Flows" active={sort === "flows"} dir={dir} onClick={() => toggle("flows")} />
                    </Th>
                    <Th>
                      <SortButton label="Status" active={sort === "status"} dir={dir} onClick={() => toggle("status")} />
                    </Th>
                  </THead>
                  <tbody>
                    {rows.map((row) => (
                      <AppRow key={row.name} row={row} />
                    ))}
                  </tbody>
                </Table>
              </TableWrap>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AppRow({ row }: { row: ApplicationStat }) {
  const Icon = appIcon(row.name);
  return (
    <tr className="hover:bg-elevated/60">
      <Td>
        <span className="inline-flex items-center gap-2">
          <Icon className="size-3.5 text-muted-foreground" />
          {row.name}
        </span>
      </Td>
      <Td mono>{formatInteger(row.packets)}</Td>
      <Td mono>{formatBytes(row.bytes)}</Td>
      <Td>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-16 overflow-hidden rounded-full bg-elevated">
            <span className="block h-full bg-brand" style={{ width: `${Math.min(100, row.percent)}%` }} />
          </span>
          <span className="font-mono text-xs tabular-nums">{formatPercent(row.percent)}</span>
        </div>
      </Td>
      <Td mono>{formatInteger(row.flows)}</Td>
      <Td>
        <TrafficStatusBadge status={row.status} />
      </Td>
    </tr>
  );
}
