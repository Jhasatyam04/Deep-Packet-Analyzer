import { Link } from "@tanstack/react-router";
import {
  Activity,
  AppWindow,
  Cpu,
  FileSearch,
  GitBranch,
  Globe,
  LayoutDashboard,
  ShieldBan,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/traffic", label: "Traffic", icon: Activity, exact: false },
  { to: "/flows", label: "Flows", icon: GitBranch, exact: false },
  { to: "/applications", label: "Applications", icon: AppWindow, exact: false },
  { to: "/domains", label: "Domains", icon: Globe, exact: false },
  { to: "/rules", label: "Rules", icon: ShieldBan, exact: false },
  { to: "/processing", label: "Processing", icon: FileSearch, exact: false },
  { to: "/system", label: "System", icon: Cpu, exact: false },
] as const;

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-2" onClick={onClick}>
      <span className="flex size-7 items-center justify-center rounded-md border border-border bg-elevated">
        <span className="size-2 rounded-full bg-brand" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-semibold tracking-widest text-muted-foreground">
          DPI ENGINE
        </span>
        <span className="block text-xs text-muted-foreground/80">Inspection console</span>
      </span>
    </Link>
  );
}

function NavLinks({ onClick }: { onClick?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-0.5 p-2">
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onClick}
          activeOptions={{ exact: item.exact }}
          className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-elevated hover:text-foreground data-[status=active]:bg-elevated data-[status=active]:text-foreground data-[status=active]:shadow-[inset_2px_0_0_0_var(--color-brand)]"
        >
          <item.icon className="size-4 shrink-0" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-12 items-center border-b border-border px-4">
          <Brand />
        </div>
        <NavLinks />
        <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
          Deep Packet Analyzer &copy; 2026
        </p>
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/70 md:hidden transition-opacity duration-200",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden={!mobileOpen}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r border-border bg-card md:hidden",
          "transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!mobileOpen}
      >
        <div className="flex h-12 items-center justify-between gap-2 border-b border-border px-4">
          <Brand onClick={onClose} />
          <Button variant="ghost" size="icon" className="size-8" onClick={onClose} aria-label="Close menu">
            <X className="size-4" />
          </Button>
        </div>
        <NavLinks onClick={onClose} />
      </aside>
    </>
  );
}
