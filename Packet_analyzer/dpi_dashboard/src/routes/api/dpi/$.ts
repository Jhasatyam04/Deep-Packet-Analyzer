import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getEngineStore } from "@/lib/dpi/store";
import type { AppDisposition, FlowDisposition, RuleType } from "@/types/dpi";

const RuleBody = z.object({
  type: z.enum(["ip", "application", "domain"]),
  value: z.string().min(1).max(253),
  enabled: z.boolean().optional(),
});

const RulePatch = z.object({
  type: z.enum(["ip", "application", "domain"]).optional(),
  value: z.string().min(1).max(253).optional(),
  enabled: z.boolean().optional(),
});

function dpiPath(request: Request): string {
  const url = new URL(request.url);
  return url.pathname.replace(/^\/api\/dpi\/?/, "").replace(/\/$/, "");
}

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status });
}

function error(message: string, status = 400, code?: string): Response {
  return Response.json({ error: message, code }, { status });
}

function asDir(value: string | null): "asc" | "desc" {
  return value === "asc" ? "asc" : "desc";
}

function handleError(err: unknown): Response {
  const status = typeof err === "object" && err && "status" in err ? Number((err as { status: number }).status) : 500;
  const message = err instanceof Error ? err.message : "Internal engine error";
  return error(message, Number.isFinite(status) ? status : 500);
}

export const Route = createFileRoute("/api/dpi/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const path = dpiPath(request);
        const url = new URL(request.url);
        try {
          let backendPath = path;
          if (path === "status" || path === "stats") {
            backendPath = `live/${path}`;
          } else if (path === "applications" || path === "domains" || path === "flows") {
            backendPath = `stats/${path}${url.search}`;
          } else if (path === "threads") {
            backendPath = `system/threads`;
          } else if (path === "rules") {
            backendPath = `rules${url.search}`;
          }
          
          const res = await fetch(`http://127.0.0.1:8081/api/v1/${backendPath}`);
          if (!res.ok) return error("Backend error", res.status);
          const data = await res.json();
          return json(data);
        } catch (err) {
          return handleError(err);
        }
      },
      POST: async ({ request }) => {
        const path = dpiPath(request);
        try {
          if (path === "rules") {
            const body = RuleBody.parse(await request.json());
            const res = await fetch("http://127.0.0.1:8081/api/v1/rules", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body)
            });
            if (!res.ok) return error("Backend error", res.status);
            return json(await res.json(), 201);
          } else if (path === "live/start" || path === "live/stop" || path === "session/reprocess") {
            const res = await fetch(`http://127.0.0.1:8081/api/v1/${path}`, {
              method: "POST"
            });
            if (!res.ok) return error("Backend error", res.status);
            return json(await res.json());
          }
          return error("Unknown DPI endpoint", 404);
        } catch (err) {
          if (err instanceof z.ZodError) return error("Invalid rule payload", 400);
          return handleError(err);
        }
      },
      PATCH: async ({ request }) => {
        const path = dpiPath(request);
        try {
          if (path.startsWith("rules/")) {
            const id = decodeURIComponent(path.slice("rules/".length));
            const body = RulePatch.parse(await request.json());
            const res = await fetch(`http://127.0.0.1:8081/api/v1/rules/${encodeURIComponent(id)}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body)
            });
            if (!res.ok) return error("Backend error", res.status);
            return json(await res.json());
          }
          return error("Unknown DPI endpoint", 404);
        } catch (err) {
          if (err instanceof z.ZodError) return error("Invalid rule payload", 400);
          return handleError(err);
        }
      },
      DELETE: async ({ request }) => {
        const path = dpiPath(request);
        try {
          if (path.startsWith("rules/")) {
            const id = decodeURIComponent(path.slice("rules/".length));
            const res = await fetch(`http://127.0.0.1:8081/api/v1/rules/${encodeURIComponent(id)}`, {
              method: "DELETE"
            });
            if (!res.ok) return error("Backend error", res.status);
            return json({ ok: true });
          }
          return error("Unknown DPI endpoint", 404);
        } catch (err) {
          return handleError(err);
        }
      },
    },
  },
});
