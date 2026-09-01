import type {
  ApplicationStat,
  AppDisposition,
  BlockingRule,
  DomainQuery,
  DomainRecord,
  EngineStatus,
  FlowDisposition,
  FlowQuery,
  FlowRecord,
  Paginated,
  ProcessingSession,
  Protocol,
  RuleInput,
  RuleType,
  StatsOverview,
  StatsResponse,
  ThreadStat,
  TimeSeriesPoint,
} from "@/types/dpi";

const ENGINE_NAME = "DPI Engine";
const ENGINE_VERSION = "2.4.1";
const INPUT_PCAP = "campus-edge-2026-08-31.pcap";
const OUTPUT_PCAP = "campus-edge-2026-08-31.filtered.pcap";
const SESSION_ID = "sess-8f3c21";
const PROCESSING_MS = 16_000;
const BUCKETS = 32;
const PAGE_SIZE_DEFAULT = 25;

type FlowSpec = {
  srcIp: string;
  dstIp: string;
  srcPort: number;
  dstPort: number;
  protocol: Protocol;
  application: string;
  domain: string | null;
  packets: number;
  avgBytes: number;
};

const FLOW_SPECS: FlowSpec[] = [
  { srcIp: "10.12.4.18", dstIp: "142.250.190.14", srcPort: 49152, dstPort: 443, protocol: "TCP", application: "YouTube", domain: "www.youtube.com", packets: 1240, avgBytes: 1380 },
  { srcIp: "10.12.4.22", dstIp: "142.250.190.46", srcPort: 49188, dstPort: 443, protocol: "TCP", application: "YouTube", domain: "googlevideo.com", packets: 1560, avgBytes: 1440 },
  { srcIp: "10.12.4.31", dstIp: "142.250.64.14", srcPort: 50301, dstPort: 443, protocol: "TCP", application: "YouTube", domain: "i.ytimg.com", packets: 420, avgBytes: 980 },
  { srcIp: "10.12.4.57", dstIp: "142.250.190.78", srcPort: 50880, dstPort: 443, protocol: "TCP", application: "YouTube", domain: "www.youtube.com", packets: 310, avgBytes: 1210 },
  { srcIp: "10.12.4.18", dstIp: "142.251.41.14", srcPort: 49200, dstPort: 443, protocol: "TCP", application: "Google", domain: "www.google.com", packets: 880, avgBytes: 720 },
  { srcIp: "10.12.4.44", dstIp: "142.251.41.14", srcPort: 49512, dstPort: 443, protocol: "TCP", application: "Google", domain: "www.google.com", packets: 310, avgBytes: 640 },
  { srcIp: "10.12.4.22", dstIp: "172.217.18.10", srcPort: 50110, dstPort: 443, protocol: "TCP", application: "Google", domain: "fonts.googleapis.com", packets: 640, avgBytes: 890 },
  { srcIp: "10.12.4.57", dstIp: "142.250.185.189", srcPort: 51120, dstPort: 443, protocol: "TCP", application: "Google", domain: "accounts.google.com", packets: 290, avgBytes: 580 },
  { srcIp: "10.12.4.18", dstIp: "142.250.185.99", srcPort: 51121, dstPort: 443, protocol: "TCP", application: "Google", domain: "www.gstatic.com", packets: 410, avgBytes: 760 },
  { srcIp: "10.12.4.31", dstIp: "104.16.132.229", srcPort: 49300, dstPort: 443, protocol: "TCP", application: "HTTPS", domain: "cloudflare.com", packets: 520, avgBytes: 1100 },
  { srcIp: "10.12.4.44", dstIp: "103.102.166.224", srcPort: 49340, dstPort: 443, protocol: "TCP", application: "HTTPS", domain: "www.wikipedia.org", packets: 380, avgBytes: 1250 },
  { srcIp: "10.12.4.61", dstIp: "151.101.1.140", srcPort: 49400, dstPort: 443, protocol: "TCP", application: "HTTPS", domain: "cdn.jsdelivr.net", packets: 270, avgBytes: 900 },
  { srcIp: "192.168.10.8", dstIp: "104.16.25.35", srcPort: 50500, dstPort: 443, protocol: "TCP", application: "HTTPS", domain: "registry.npmjs.org", packets: 190, avgBytes: 840 },
  { srcIp: "10.12.4.22", dstIp: "93.184.216.34", srcPort: 50666, dstPort: 443, protocol: "TCP", application: "HTTPS", domain: "example.com", packets: 140, avgBytes: 700 },
  { srcIp: "10.12.4.18", dstIp: "8.8.4.4", srcPort: 53200, dstPort: 853, protocol: "TCP", application: "HTTPS", domain: null, packets: 42, avgBytes: 400 },
  { srcIp: "10.12.4.57", dstIp: "157.240.22.35", srcPort: 49700, dstPort: 443, protocol: "TCP", application: "Facebook", domain: "www.facebook.com", packets: 760, avgBytes: 1180 },
  { srcIp: "10.12.4.61", dstIp: "157.240.22.35", srcPort: 49750, dstPort: 443, protocol: "TCP", application: "Facebook", domain: "www.facebook.com", packets: 330, avgBytes: 1020 },
  { srcIp: "192.168.10.19", dstIp: "31.13.71.36", srcPort: 49800, dstPort: 443, protocol: "TCP", application: "Facebook", domain: "static.xx.fbcdn.net", packets: 510, avgBytes: 1340 },
  { srcIp: "10.12.4.18", dstIp: "140.82.112.4", srcPort: 49900, dstPort: 443, protocol: "TCP", application: "GitHub", domain: "github.com", packets: 420, avgBytes: 880 },
  { srcIp: "10.12.4.44", dstIp: "140.82.113.6", srcPort: 49980, dstPort: 443, protocol: "TCP", application: "GitHub", domain: "api.github.com", packets: 280, avgBytes: 640 },
  { srcIp: "192.168.10.8", dstIp: "185.199.108.133", srcPort: 50010, dstPort: 443, protocol: "TCP", application: "GitHub", domain: "avatars.githubusercontent.com", packets: 160, avgBytes: 720 },
  { srcIp: "10.12.4.18", dstIp: "10.12.0.1", srcPort: 53001, dstPort: 53, protocol: "UDP", application: "DNS", domain: null, packets: 86, avgBytes: 92 },
  { srcIp: "10.12.4.22", dstIp: "10.12.0.1", srcPort: 53002, dstPort: 53, protocol: "UDP", application: "DNS", domain: null, packets: 74, avgBytes: 88 },
  { srcIp: "10.12.4.31", dstIp: "8.8.8.8", srcPort: 53003, dstPort: 53, protocol: "UDP", application: "DNS", domain: null, packets: 112, avgBytes: 96 },
  { srcIp: "10.12.4.44", dstIp: "1.1.1.1", srcPort: 53004, dstPort: 53, protocol: "UDP", application: "DNS", domain: null, packets: 64, avgBytes: 84 },
  { srcIp: "192.168.10.8", dstIp: "10.12.0.1", srcPort: 53005, dstPort: 53, protocol: "UDP", application: "DNS", domain: null, packets: 48, avgBytes: 90 },
  { srcIp: "10.12.4.31", dstIp: "34.223.124.45", srcPort: 50100, dstPort: 80, protocol: "TCP", application: "HTTP", domain: "neverssl.com", packets: 120, avgBytes: 540 },
  { srcIp: "192.168.10.19", dstIp: "93.184.216.34", srcPort: 50130, dstPort: 80, protocol: "TCP", application: "HTTP", domain: "example.com", packets: 95, avgBytes: 480 },
  { srcIp: "10.12.4.22", dstIp: "23.59.137.27", srcPort: 51200, dstPort: 443, protocol: "TCP", application: "TikTok", domain: "www.tiktok.com", packets: 640, avgBytes: 1280 },
  { srcIp: "10.12.4.57", dstIp: "23.59.137.27", srcPort: 51240, dstPort: 443, protocol: "TCP", application: "TikTok", domain: "www.tiktok.com", packets: 280, avgBytes: 1190 },
  { srcIp: "192.168.10.19", dstIp: "104.123.68.10", srcPort: 51300, dstPort: 443, protocol: "TCP", application: "TikTok", domain: "v16.tiktokcdn.com", packets: 390, avgBytes: 1410 },
  { srcIp: "10.12.4.61", dstIp: "203.0.113.77", srcPort: 52000, dstPort: 443, protocol: "TCP", application: "Unknown", domain: null, packets: 88, avgBytes: 600 },
  { srcIp: "10.12.4.18", dstIp: "203.0.113.77", srcPort: 52040, dstPort: 443, protocol: "TCP", application: "Unknown", domain: null, packets: 54, avgBytes: 520 },
  { srcIp: "192.168.10.8", dstIp: "198.51.100.10", srcPort: 52100, dstPort: 443, protocol: "TCP", application: "Unknown", domain: "cdn.obscure-host.net", packets: 96, avgBytes: 700 },
];

const IP_RE = /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/;
const HOST_RE = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

function iso(ms: number): string {
  return new Date(ms).toISOString();
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function curve(i: number, n: number): number {
  const x = (i + 0.5) / n;
  const w = Math.sin(Math.PI * x);
  return w * w;
}

function matchRule(rule: BlockingRule, flow: { srcIp: string; dstIp: string; application: string; domain: string | null }): boolean {
  if (!rule.enabled) return false;
  if (rule.type === "ip") {
    return flow.srcIp === rule.value || flow.dstIp === rule.value;
  }
  if (rule.type === "application") {
    return flow.application.toLowerCase() === rule.value.toLowerCase();
  }
  const hay = (flow.domain ?? "").toLowerCase();
  const needle = rule.value.toLowerCase().replace(/^\*\./, "");
  return hay === needle || hay.endsWith(`.${needle}`) || hay.includes(needle);
}

function paginate<T>(items: T[], page: number, pageSize: number): Paginated<T> {
  const p = Math.max(1, page);
  const size = clamp(pageSize, 1, 200);
  const start = (p - 1) * size;
  return {
    items: items.slice(start, start + size),
    total: items.length,
    page: p,
    pageSize: size,
  };
}

function compareValues(a: unknown, b: unknown, dir: "asc" | "desc"): number {
  const mul = dir === "asc" ? 1 : -1;
  if (typeof a === "number" && typeof b === "number") return (a - b) * mul;
  return String(a ?? "").localeCompare(String(b ?? ""), undefined, { numeric: true }) * mul;
}

function pick(row: object, key: string): unknown {
  return (row as unknown as Record<string, unknown>)[key];
}

type SessionPhase = "idle" | "processing" | "completed";

class DpiEngineStore {
  private bootAt = Date.now();
  private phase: SessionPhase = "completed";
  private processStartedAt = this.bootAt - 8 * 60_000;
  private processDurationMs = 47_320;
  private rules: BlockingRule[];
  private ruleSeq = 3;

  constructor() {
    const t0 = this.processStartedAt;
    this.rules = [
      {
        id: "rule-1",
        type: "domain",
        value: "tiktok",
        enabled: true,
        packetsAffected: 0,
        createdAt: iso(t0 - 86_400_000),
        updatedAt: iso(t0 - 3_600_000),
      },
      {
        id: "rule-2",
        type: "application",
        value: "YouTube",
        enabled: false,
        packetsAffected: 0,
        createdAt: iso(t0 - 72_000_000),
        updatedAt: iso(t0 - 2_400_000),
      },
      {
        id: "rule-3",
        type: "ip",
        value: "203.0.113.77",
        enabled: true,
        packetsAffected: 0,
        createdAt: iso(t0 - 48_000_000),
        updatedAt: iso(t0 - 1_800_000),
      },
    ];
  }

  private progress(): number {
    if (this.phase === "completed") return 1;
    if (this.phase === "idle") return 0;
    const p = (Date.now() - this.processStartedAt) / this.processDurationMs;
    if (p >= 1) {
      this.phase = "completed";
      this.processDurationMs = Date.now() - this.processStartedAt;
      return 1;
    }
    return clamp(p, 0, 1);
  }

  private classifiedFlows(progress: number): FlowRecord[] {
    const n = FLOW_SPECS.length;
    const visible = Math.max(0, Math.ceil(n * progress));
    const sessionStart = this.processStartedAt;
    const sessionSpan = this.processDurationMs;

    return FLOW_SPECS.slice(0, visible).map((spec, i) => {
      const firstSeen = sessionStart + Math.floor((i / Math.max(n, 1)) * sessionSpan * 0.92);
      const lastSeen = firstSeen + Math.max(400, Math.floor(spec.packets * 12));
      const matched = this.rules.find((r) => matchRule(r, spec));
      const status: FlowDisposition = matched ? "dropped" : "forwarded";
      return {
        id: `flow-${String(i + 1).padStart(3, "0")}`,
        srcIp: spec.srcIp,
        dstIp: spec.dstIp,
        srcPort: spec.srcPort,
        dstPort: spec.dstPort,
        protocol: spec.protocol,
        application: spec.application,
        domain: spec.domain,
        packets: spec.packets,
        bytes: spec.packets * spec.avgBytes,
        status,
        blockReason: matched ? `${matched.type}:${matched.value}` : null,
        firstSeen: iso(firstSeen),
        lastSeen: iso(Math.min(lastSeen, sessionStart + sessionSpan)),
      };
    });
  }

  private withRuleCounts(flows: FlowRecord[]): BlockingRule[] {
    return this.rules.map((rule) => ({
      ...rule,
      packetsAffected: flows
        .filter((f) => matchRule({ ...rule, enabled: true }, f))
        .reduce((sum, f) => sum + f.packets, 0),
    }));
  }

  private overview(flows: FlowRecord[], durationMs: number): StatsOverview {
    const totalPackets = flows.reduce((s, f) => s + f.packets, 0);
    const totalBytes = flows.reduce((s, f) => s + f.bytes, 0);
    const forwardedPackets = flows.filter((f) => f.status === "forwarded").reduce((s, f) => s + f.packets, 0);
    const droppedPackets = totalPackets - forwardedPackets;
    const secs = Math.max(durationMs / 1000, 0.001);
    const apps = new Set(flows.map((f) => f.application));
    const domains = new Set(flows.map((f) => f.domain).filter(Boolean));
    return {
      totalPackets,
      packetsPerSec: totalPackets / secs,
      totalBytes,
      throughputBps: (totalBytes * 8) / secs,
      forwardedPackets,
      forwardedPercent: totalPackets === 0 ? 0 : (forwardedPackets / totalPackets) * 100,
      droppedPackets,
      droppedPercent: totalPackets === 0 ? 0 : (droppedPackets / totalPackets) * 100,
      activeFlows: flows.length,
      detectedApplications: apps.size,
      detectedDomains: domains.size,
    };
  }

  private timeseries(flows: FlowRecord[], progress: number): TimeSeriesPoint[] {
    const ready = Math.max(0, Math.ceil(BUCKETS * progress));
    if (ready === 0) return [];
    const weights = Array.from({ length: BUCKETS }, (_, i) => curve(i, BUCKETS));
    const weightSum = weights.reduce((s, w) => s + w, 0);
    const totalPackets = flows.reduce((s, f) => s + f.packets, 0);
    const totalBytes = flows.reduce((s, f) => s + f.bytes, 0);
    const forwarded = flows.filter((f) => f.status === "forwarded").reduce((s, f) => s + f.packets, 0);
    const dropped = totalPackets - forwarded;
    const fwdRatio = totalPackets === 0 ? 1 : forwarded / totalPackets;
    const dropRatio = totalPackets === 0 ? 0 : dropped / totalPackets;

    const points: TimeSeriesPoint[] = [];
    for (let i = 0; i < ready; i += 1) {
      const share = weights[i] / weightSum;
      const ts = this.processStartedAt + Math.floor(((i + 1) / BUCKETS) * this.processDurationMs);
      points.push({
        ts: iso(ts),
        packets: Math.round(totalPackets * share),
        bytes: Math.round(totalBytes * share),
        forwarded: Math.round(totalPackets * share * fwdRatio),
        dropped: Math.round(totalPackets * share * dropRatio),
      });
    }
    return points;
  }

  private applications(flows: FlowRecord[]): ApplicationStat[] {
    const total = flows.reduce((s, f) => s + f.packets, 0) || 1;
    const map = new Map<string, ApplicationStat>();
    for (const flow of flows) {
      const current = map.get(flow.application) ?? {
        name: flow.application,
        packets: 0,
        bytes: 0,
        percent: 0,
        flows: 0,
        status: "allowed" as AppDisposition,
      };
      current.packets += flow.packets;
      current.bytes += flow.bytes;
      current.flows += 1;
      if (flow.status === "dropped") current.status = "blocked";
      map.set(flow.application, current);
    }
    return [...map.values()]
      .map((row) => ({ ...row, percent: (row.packets / total) * 100 }))
      .sort((a, b) => b.packets - a.packets);
  }

  private domains(flows: FlowRecord[]): DomainRecord[] {
    const map = new Map<string, DomainRecord>();
    for (const flow of flows) {
      if (!flow.domain) continue;
      const current = map.get(flow.domain) ?? {
        id: `dom-${flow.domain.replace(/[^a-z0-9]+/gi, "-")}`,
        domain: flow.domain,
        application: flow.application,
        packets: 0,
        bytes: 0,
        flows: 0,
        status: "allowed" as AppDisposition,
        firstSeen: flow.firstSeen,
        lastSeen: flow.lastSeen,
        source: flow.dstPort === 80 ? "http_host" : "sni",
      };
      current.packets += flow.packets;
      current.bytes += flow.bytes;
      current.flows += 1;
      if (flow.firstSeen < current.firstSeen) current.firstSeen = flow.firstSeen;
      if (flow.lastSeen > current.lastSeen) current.lastSeen = flow.lastSeen;
      if (flow.status === "dropped") current.status = "blocked";
      if (current.source === "sni" && flow.dstPort === 80) current.source = "both";
      if (current.source === "http_host" && flow.dstPort === 443) current.source = "both";
      map.set(flow.domain, current);
    }
    return [...map.values()].sort((a, b) => b.packets - a.packets);
  }

  private threads(flows: FlowRecord[], progress: number): ThreadStat[] {
    const total = flows.reduce((s, f) => s + f.packets, 0);
    const forwarded = flows.filter((f) => f.status === "forwarded").reduce((s, f) => s + f.packets, 0);
    const load = 0.38 + progress * 0.28;
    const shares = [0.27, 0.24, 0.22, 0.27];
    const fpPackets = shares.map((s) => Math.round(total * s));
    const lb0 = fpPackets[0] + fpPackets[1];
    const lb1 = fpPackets[2] + fpPackets[3];
    const util = (base: number, hot = 0) => clamp(Math.round((base + hot) * 100), 4, 96);
    const rate = (packets: number) => (this.processDurationMs > 0 ? packets / (this.processDurationMs / 1000) : 0);

    const fp1Queue = Math.round(28 + progress * 160);
    const mk = (
      partial: Omit<ThreadStat, "rate" | "status"> & { rate?: number; status?: ThreadStat["status"] },
    ): ThreadStat => {
      const queueBusy =
        partial.queueDepth != null &&
        partial.queueCapacity != null &&
        partial.queueDepth / partial.queueCapacity >= 0.7;
      const utilization = partial.utilization;
      return {
        ...partial,
        rate: partial.rate ?? rate(partial.packets),
        status: partial.status ?? (queueBusy || utilization >= 86 ? "warning" : "ok"),
      };
    };

    return [
      mk({
        id: "reader",
        name: "Reader",
        role: "reader",
        packets: total,
        utilization: util(load, -0.08),
        queueDepth: Math.round(6 + progress * 10),
        queueCapacity: 64,
        parentId: null,
        children: ["lb-0", "lb-1"],
      }),
      mk({
        id: "lb-0",
        name: "LB0",
        role: "load_balancer",
        packets: lb0,
        utilization: util(load, -0.04),
        queueDepth: Math.round(12 + progress * 18),
        queueCapacity: 128,
        parentId: "reader",
        children: ["fp-0", "fp-1"],
      }),
      mk({
        id: "lb-1",
        name: "LB1",
        role: "load_balancer",
        packets: lb1,
        utilization: util(load, -0.07),
        queueDepth: Math.round(9 + progress * 14),
        queueCapacity: 128,
        parentId: "reader",
        children: ["fp-2", "fp-3"],
      }),
      mk({
        id: "fp-0",
        name: "FP0",
        role: "fast_path",
        packets: fpPackets[0],
        utilization: util(load, -0.1),
        queueDepth: Math.round(16 + progress * 22),
        queueCapacity: 256,
        parentId: "lb-0",
        children: [],
      }),
      mk({
        id: "fp-1",
        name: "FP1",
        role: "fast_path",
        packets: fpPackets[1],
        utilization: util(load, 0.18),
        queueDepth: fp1Queue,
        queueCapacity: 256,
        parentId: "lb-0",
        children: [],
      }),
      mk({
        id: "fp-2",
        name: "FP2",
        role: "fast_path",
        packets: fpPackets[2],
        utilization: util(load, -0.12),
        queueDepth: Math.round(11 + progress * 16),
        queueCapacity: 256,
        parentId: "lb-1",
        children: [],
      }),
      mk({
        id: "fp-3",
        name: "FP3",
        role: "fast_path",
        packets: fpPackets[3],
        utilization: util(load, -0.05),
        queueDepth: Math.round(14 + progress * 20),
        queueCapacity: 256,
        parentId: "lb-1",
        children: [],
      }),
      mk({
        id: "writer",
        name: "Writer",
        role: "writer",
        packets: forwarded,
        utilization: util(load * 0.7, -0.12),
        queueDepth: Math.round(4 + progress * 8),
        queueCapacity: 64,
        parentId: null,
        children: [],
      }),
    ];
  }

  private sessionView(flows: FlowRecord[], progress: number, overview: StatsOverview): ProcessingSession {
    const activeRules = this.rules.filter((r) => r.enabled).length;
    const endTime =
      this.phase === "completed" ? iso(this.processStartedAt + this.processDurationMs) : null;
    const durationMs =
      this.phase === "processing"
        ? Date.now() - this.processStartedAt
        : this.phase === "completed"
          ? this.processDurationMs
          : null;
    return {
      id: SESSION_ID,
      inputPcap: INPUT_PCAP,
      outputPcap: progress >= 1 ? OUTPUT_PCAP : this.phase === "idle" ? null : OUTPUT_PCAP,
      status: this.phase === "processing" ? "processing" : this.phase === "idle" ? "idle" : "completed",
      progress: this.phase === "idle" ? null : Math.round(progress * 100),
      startTime: this.phase === "idle" ? null : iso(this.processStartedAt),
      endTime,
      durationMs,
      totalPackets: overview.totalPackets,
      totalBytes: overview.totalBytes,
      forwardedPackets: overview.forwardedPackets,
      droppedPackets: overview.droppedPackets,
      flows: overview.activeFlows,
      applications: overview.detectedApplications,
      domains: overview.detectedDomains,
      activeRules,
    };
  }

  private snapshot() {
    const progress = this.progress();
    const flows = this.classifiedFlows(progress);
    const durationMs =
      this.phase === "processing" ? Date.now() - this.processStartedAt : this.processDurationMs;
    const overview = this.overview(flows, durationMs);
    return { progress, flows, overview };
  }

  getStatus(): EngineStatus {
    const progress = this.progress();
    const status =
      this.phase === "processing" ? "processing" : this.phase === "idle" ? "idle" : "online";
    return {
      name: ENGINE_NAME,
      version: ENGINE_VERSION,
      status,
      capture: this.phase === "idle" ? null : INPUT_PCAP,
      lastUpdated: iso(Date.now()),
      uptimeSeconds: Math.floor((Date.now() - this.bootAt) / 1000),
      connected: true,
    };
  }

  getStats(): StatsResponse {
    const { progress, flows, overview } = this.snapshot();
    return { overview, timeseries: this.timeseries(flows, progress) };
  }

  getApplications(): ApplicationStat[] {
    return this.applications(this.snapshot().flows);
  }

  getDomains(query: DomainQuery = {}): Paginated<DomainRecord> {
    const { q = "", page = 1, pageSize = PAGE_SIZE_DEFAULT, sort = "packets", dir = "desc", status = "all", application } = query;
    let rows = this.domains(this.snapshot().flows);
    const needle = q.trim().toLowerCase();
    if (needle) {
      rows = rows.filter(
        (d) =>
          d.domain.toLowerCase().includes(needle) ||
          d.application.toLowerCase().includes(needle),
      );
    }
    if (status !== "all") rows = rows.filter((d) => d.status === status);
    if (application) rows = rows.filter((d) => d.application === application);
    rows = [...rows].sort((a, b) => compareValues(pick(a, sort), pick(b, sort), dir));
    return paginate(rows, page, pageSize);
  }

  getDomain(id: string): DomainRecord | null {
    return this.domains(this.snapshot().flows).find((d) => d.id === id || d.domain === id) ?? null;
  }

  getFlows(query: FlowQuery = {}): Paginated<FlowRecord> {
    const { q = "", page = 1, pageSize = PAGE_SIZE_DEFAULT, sort = "packets", dir = "desc", status = "all", application } = query;
    let rows = this.snapshot().flows;
    const needle = q.trim().toLowerCase();
    if (needle) {
      rows = rows.filter((f) => {
        const blob = `${f.srcIp} ${f.dstIp} ${f.srcPort} ${f.dstPort} ${f.protocol} ${f.application} ${f.domain ?? ""} ${f.blockReason ?? ""}`.toLowerCase();
        return blob.includes(needle);
      });
    }
    if (status !== "all") rows = rows.filter((f) => f.status === status);
    if (application) rows = rows.filter((f) => f.application === application);
    rows = [...rows].sort((a, b) => compareValues(pick(a, sort), pick(b, sort), dir));
    return paginate(rows, page, pageSize);
  }

  getFlow(id: string): FlowRecord | null {
    return this.snapshot().flows.find((f) => f.id === id) ?? null;
  }

  getRules(type?: RuleType | "all"): BlockingRule[] {
    const { flows } = this.snapshot();
    const rules = this.withRuleCounts(flows);
    if (!type || type === "all") return rules;
    return rules.filter((r) => r.type === type);
  }

  createRule(input: RuleInput): BlockingRule {
    const value = input.value.trim();
    this.assertRuleValue(input.type, value);
    const dup = this.rules.find(
      (r) => r.type === input.type && r.value.toLowerCase() === value.toLowerCase(),
    );
    if (dup) {
      const err = new Error("A rule with this type and value already exists");
      (err as Error & { status: number }).status = 409;
      throw err;
    }
    this.ruleSeq += 1;
    const now = iso(Date.now());
    const rule: BlockingRule = {
      id: `rule-${this.ruleSeq}`,
      type: input.type,
      value,
      enabled: input.enabled ?? true,
      packetsAffected: 0,
      createdAt: now,
      updatedAt: now,
    };
    this.rules = [rule, ...this.rules];
    const { flows } = this.snapshot();
    return this.withRuleCounts(flows).find((r) => r.id === rule.id)!;
  }

  updateRule(id: string, patch: Partial<Pick<BlockingRule, "value" | "enabled" | "type">>): BlockingRule {
    const idx = this.rules.findIndex((r) => r.id === id);
    if (idx < 0) {
      const err = new Error("Rule not found");
      (err as Error & { status: number }).status = 404;
      throw err;
    }
    const current = this.rules[idx];
    const nextType = patch.type ?? current.type;
    const nextValue = (patch.value ?? current.value).trim();
    this.assertRuleValue(nextType, nextValue);
    const dup = this.rules.find(
      (r) => r.id !== id && r.type === nextType && r.value.toLowerCase() === nextValue.toLowerCase(),
    );
    if (dup) {
      const err = new Error("A rule with this type and value already exists");
      (err as Error & { status: number }).status = 409;
      throw err;
    }
    this.rules[idx] = {
      ...current,
      type: nextType,
      value: nextValue,
      enabled: patch.enabled ?? current.enabled,
      updatedAt: iso(Date.now()),
    };
    const { flows } = this.snapshot();
    return this.withRuleCounts(flows)[idx];
  }

  deleteRule(id: string): void {
    const idx = this.rules.findIndex((r) => r.id === id);
    if (idx < 0) {
      const err = new Error("Rule not found");
      (err as Error & { status: number }).status = 404;
      throw err;
    }
    this.rules.splice(idx, 1);
  }

  getThreads(): ThreadStat[] {
    const { progress, flows } = this.snapshot();
    return this.threads(flows, progress);
  }

  getSession(): ProcessingSession {
    const { progress, flows, overview } = this.snapshot();
    return this.sessionView(flows, progress, overview);
  }

  reprocess(): ProcessingSession {
    this.phase = "processing";
    this.processStartedAt = Date.now();
    this.processDurationMs = PROCESSING_MS;
    return this.getSession();
  }

  private assertRuleValue(type: RuleType, value: string) {
    if (!value) {
      const err = new Error("Rule value is required");
      (err as Error & { status: number }).status = 400;
      throw err;
    }
    if (type === "ip" && !IP_RE.test(value)) {
      const err = new Error("Enter a valid IPv4 address");
      (err as Error & { status: number }).status = 400;
      throw err;
    }
    if (type === "domain" && !HOST_RE.test(value) && !HOST_RE.test(value.replace(/^\*\./, ""))) {
      const err = new Error("Enter a valid domain name");
      (err as Error & { status: number }).status = 400;
      throw err;
    }
    if (type === "application" && value.length > 64) {
      const err = new Error("Application name is too long");
      (err as Error & { status: number }).status = 400;
      throw err;
    }
  }
}

const globalStore = globalThis as typeof globalThis & { __dpiEngineStoreV2?: DpiEngineStore };

export function getEngineStore(): DpiEngineStore {
  if (!globalStore.__dpiEngineStoreV2) {
    globalStore.__dpiEngineStoreV2 = new DpiEngineStore();
  }
  return globalStore.__dpiEngineStoreV2;
}
