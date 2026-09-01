import { useQueryClient } from "@tanstack/react-query";
import { Menu, Moon, RefreshCw, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { EngineStatusBadge, LiveDot } from "@/components/status/status-badge";
import { Button } from "@/components/ui/button";
import { useEngineStatus } from "@/hooks/use-dpi";
import { formatRelative } from "@/lib/format";
import { useTheme } from "@/components/theme-provider";

export function Header({ onMenu }: { onMenu: () => void }) {
  const status = useEngineStatus();
  const queryClient = useQueryClient();
  const { theme, toggle } = useTheme();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const engine = status.data;

  return (
    <header className="flex min-h-12 items-center gap-3 border-b border-border bg-card px-3 py-2 md:px-5">
      <Button variant="ghost" size="icon" className="size-11 md:size-9 md:hidden" onClick={onMenu} aria-label="Open menu">
        <Menu className="size-4" />
      </Button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="text-sm font-semibold tracking-wide">Deep Packet Analyzer</h1>
          {engine ? (
            <span className="inline-flex items-center gap-2">
              <LiveDot active={engine.status === "online" || engine.status === "processing"} />
              <EngineStatusBadge status={engine.status} />
            </span>
          ) : status.isError ? (
            <EngineStatusBadge status="error" />
          ) : (
            <span className="text-xs text-muted-foreground">Connecting…</span>
          )}
        </div>
        <p className="truncate text-[0.6875rem] text-muted-foreground">
          {engine?.capture ? (
            <>
              Capture <span className={engine.capture === "Live Interface" ? "text-foreground" : "font-mono text-foreground/80"}>{engine.capture}</span>
            </>
          ) : (
            "No active capture"
          )}
          <span className="mx-2 text-border">·</span>
          Updated {engine ? formatRelative(engine.lastUpdated, now) : "—"}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-11 md:h-8"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["dpi"] })}
          disabled={status.isFetching}
          aria-label="Refresh"
        >
          <RefreshCw className={status.isFetching ? "animate-spin" : undefined} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
        <Button variant="ghost" size="icon" className="size-11 md:size-9" onClick={toggle} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>
    </header>
  );
}
