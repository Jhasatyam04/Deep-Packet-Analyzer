import type {
  ApplicationStat,
  BlockingRule,
  DomainQuery,
  DomainRecord,
  EngineStatus,
  FlowQuery,
  FlowRecord,
  Paginated,
  ProcessingSession,
  RuleInput,
  RuleType,
  StatsResponse,
  ThreadStat,
} from "@/types/dpi";

const BASE = "/api/dpi";

export class DpiApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "DpiApiError";
  }
}

function toQuery(params: Record<string, string | number | undefined>): string {
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "" || value === "all") continue;
    usp.set(key, String(value));
  }
  const s = usp.toString();
  return s ? `?${s}` : "";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}/${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new DpiApiError(0, "Unable to connect to DPI Engine");
  }

  if (!res.ok) {
    let message = `Engine request failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
          }
    if (res.status === 0 || res.status >= 500) {
      throw new DpiApiError(res.status, "Unable to connect to DPI Engine");
    }
    throw new DpiApiError(res.status, message);
  }

  return (await res.json()) as T;
}

export const dpiApi = {
  getStatus: () => request<EngineStatus>("status"),
  getStats: () => request<StatsResponse>("stats"),
  getApplications: () => request<ApplicationStat[]>("applications"),
  getDomains: (query: DomainQuery = {}) =>
    request<Paginated<DomainRecord>>(
      `domains${toQuery({
        q: query.q,
        page: query.page,
        pageSize: query.pageSize,
        sort: query.sort,
        dir: query.dir,
        status: query.status,
        application: query.application,
      })}`,
    ),
  getDomain: (id: string) => request<DomainRecord>(`domains/${encodeURIComponent(id)}`),
  getFlows: (query: FlowQuery = {}) =>
    request<Paginated<FlowRecord>>(
      `flows${toQuery({
        q: query.q,
        page: query.page,
        pageSize: query.pageSize,
        sort: query.sort,
        dir: query.dir,
        status: query.status,
        application: query.application,
      })}`,
    ),
  getFlow: (id: string) => request<FlowRecord>(`flows/${encodeURIComponent(id)}`),
  getRules: (type?: RuleType | "all") =>
    request<BlockingRule[]>(`rules${toQuery({ type })}`),
  createRule: (input: RuleInput) =>
    request<BlockingRule>("rules", { method: "POST", body: JSON.stringify(input) }),
  updateRule: (id: string, patch: Partial<RuleInput>) =>
    request<BlockingRule>(`rules/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),
  deleteRule: (id: string) =>
    request<{ ok: boolean }>(`rules/${encodeURIComponent(id)}`, { method: "DELETE" }),
  getThreads: () => request<ThreadStat[]>("threads"),
  getSession: () => request<ProcessingSession>("session"),
  reprocess: () => request<ProcessingSession>("session/reprocess", { method: "POST" }),
};

export function isConnectionError(err: unknown): boolean {
  return err instanceof DpiApiError && (err.status === 0 || err.status >= 500);
}
