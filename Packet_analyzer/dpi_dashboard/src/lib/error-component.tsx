import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-3 bg-background px-6 text-center text-foreground">
      <span className="text-danger" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="text-lg font-semibold">Something went wrong</h1>
      <p className="max-w-md text-sm break-words text-muted-foreground">
        {error.message || "An unexpected error occurred. Try reloading the page."}
      </p>
    </main>
  );
}

export function AppNotFoundComponent() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-2 bg-background px-6 text-center text-foreground">
      <p className="text-sm font-medium">Page not found</p>
      <p className="text-sm text-muted-foreground">That view is not part of the DPI console.</p>
    </main>
  );
}
