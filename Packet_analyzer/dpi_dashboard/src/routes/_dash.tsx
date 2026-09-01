import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";

export const Route = createFileRoute("/_dash")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
