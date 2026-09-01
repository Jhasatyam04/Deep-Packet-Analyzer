export type EngineLifecycle = "online" | "processing" | "idle" | "error";

export type TrafficStatus = "normal" | "processing" | "blocked" | "warning" | "error";

export type SessionStatus = "idle" | "queued" | "processing" | "completed" | "failed";

export type FlowDisposition = "forwarded" | "dropped";

export type RuleType = "ip" | "application" | "domain";

export type Protocol = "TCP" | "UDP";

export type ThreadRole = "reader" | "load_balancer" | "fast_path" | "writer";

export type ThreadHealth = "ok" | "warning" | "error";

export type AppDisposition = "allowed" | "blocked";

export interface EngineStatus {
  name: string;
  version: string;
  status: EngineLifecycle;
  capture: string | null;
  lastUpdated: string;
  uptimeSeconds: number;
  connected: boolean;
}

export interface StatsOverview {
  totalPackets: number;
  packetsPerSec: number | null;
  totalBytes: number;
  throughputBps: number | null;
  forwardedPackets: number;
  forwardedPercent: number;
  droppedPackets: number;
  droppedPercent: number;
  activeFlows: number;
  detectedApplications: number;
  detectedDomains: number;
}

export interface TimeSeriesPoint {
  ts: string;
  packets: number;
  bytes: number;
  forwarded: number;
  dropped: number;
}

export interface StatsResponse {
  overview: StatsOverview;
  timeseries: TimeSeriesPoint[];
}

export interface ApplicationStat {
  name: string;
  packets: number;
  bytes: number;
  percent: number;
  flows: number;
  status: AppDisposition;
}

export interface DomainRecord {
  id: string;
  domain: string;
  application: string;
  packets: number;
  bytes: number;
  flows: number;
  status: AppDisposition;
  firstSeen: string;
  lastSeen: string;
  source: "sni" | "http_host" | "both";
}

export interface FlowRecord {
  id: string;
  srcIp: string;
  dstIp: string;
  srcPort: number;
  dstPort: number;
  protocol: Protocol;
  application: string;
  domain: string | null;
  packets: number;
  bytes: number;
  status: FlowDisposition;
  blockReason: string | null;
  firstSeen: string;
  lastSeen: string;
}

export interface BlockingRule {
  id: string;
  type: RuleType;
  value: string;
  enabled: boolean;
  packetsAffected: number;
  createdAt: string;
  updatedAt: string;
}

export interface RuleInput {
  type: RuleType;
  value: string;
  enabled?: boolean;
}

export interface ThreadStat {
  id: string;
  name: string;
  role: ThreadRole;
  packets: number;
  utilization: number;
  queueDepth: number | null;
  queueCapacity: number | null;
  rate: number | null;
  parentId: string | null;
  children: string[];
  status: ThreadHealth;
}

export interface ProcessingSession {
  id: string;
  inputPcap: string;
  outputPcap: string | null;
  status: SessionStatus;
  progress: number | null;
  startTime: string | null;
  endTime: string | null;
  durationMs: number | null;
  totalPackets: number;
  totalBytes: number;
  forwardedPackets: number;
  droppedPackets: number;
  flows: number;
  applications: number;
  domains: number;
  activeRules: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiErrorBody {
  error: string;
  code?: string;
}

export interface FlowQuery {
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  dir?: "asc" | "desc";
  status?: FlowDisposition | "all";
  application?: string;
}

export interface DomainQuery {
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  dir?: "asc" | "desc";
  status?: AppDisposition | "all";
  application?: string;
}
