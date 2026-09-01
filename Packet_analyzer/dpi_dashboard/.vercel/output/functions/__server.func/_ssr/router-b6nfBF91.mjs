import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { r as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQueryClient, n as useQuery, r as QueryClientProvider, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as keepPreviousData, t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { C as Github, D as CircleX, F as ArrowUpDown, L as ArrowDown, N as Ban, O as CircleHelp, P as ArrowUp, S as Globe, c as Search, f as Play, h as Music2, k as CircleCheck, l as RefreshCw, n as TriangleAlert, o as Share2, s as Server, v as Lock, x as Inbox, y as LoaderCircle } from "../_libs/lucide-react.mjs";
import { f as createRouter, g as createRootRoute, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { a as object, c as ZodError, i as number, n as boolean, o as string, r as literal, s as union, t as _enum } from "../_libs/zod.mjs";
import { t as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
import { c as Cell, l as ResponsiveContainer, n as PieChart, s as Pie, u as Tooltip } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-dpi-CIsD2kDd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,background-color,border-color,transform,box-shadow] duration-150 ease-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:not-disabled:scale-[0.96] [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:opacity-90",
			secondary: "bg-elevated text-foreground hover:bg-elevated/80",
			outline: "border border-border bg-transparent hover:bg-elevated",
			ghost: "hover:bg-elevated",
			destructive: "bg-danger text-white hover:opacity-90"
		},
		size: {
			default: "h-9 px-3",
			sm: "h-8 px-2.5 text-xs",
			lg: "h-10 px-4",
			icon: "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var BASE = "/api/dpi";
var DpiApiError = class extends Error {
	status;
	constructor(status, message) {
		super(message);
		this.status = status;
		this.name = "DpiApiError";
	}
};
function toQuery(params) {
	const usp = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value === void 0 || value === "" || value === "all") continue;
		usp.set(key, String(value));
	}
	const s = usp.toString();
	return s ? `?${s}` : "";
}
async function request(path, init) {
	let res;
	try {
		res = await fetch(`${BASE}/${path}`, {
			...init,
			headers: {
				Accept: "application/json",
				...init?.body ? { "Content-Type": "application/json" } : {},
				...init?.headers
			}
		});
	} catch {
		throw new DpiApiError(0, "Unable to connect to DPI Engine");
	}
	if (!res.ok) {
		let message = `Engine request failed (${res.status})`;
		try {
			const body = await res.json();
			if (body.error) message = body.error;
		} catch {}
		if (res.status === 0 || res.status >= 500) throw new DpiApiError(res.status, "Unable to connect to DPI Engine");
		throw new DpiApiError(res.status, message);
	}
	return await res.json();
}
var dpiApi = {
	getStatus: () => request("status"),
	getStats: () => request("stats"),
	getApplications: () => request("applications"),
	getDomains: (query = {}) => request(`domains${toQuery({
		q: query.q,
		page: query.page,
		pageSize: query.pageSize,
		sort: query.sort,
		dir: query.dir,
		status: query.status,
		application: query.application
	})}`),
	getDomain: (id) => request(`domains/${encodeURIComponent(id)}`),
	getFlows: (query = {}) => request(`flows${toQuery({
		q: query.q,
		page: query.page,
		pageSize: query.pageSize,
		sort: query.sort,
		dir: query.dir,
		status: query.status,
		application: query.application
	})}`),
	getFlow: (id) => request(`flows/${encodeURIComponent(id)}`),
	getRules: (type) => request(`rules${toQuery({ type })}`),
	createRule: (input) => request("rules", {
		method: "POST",
		body: JSON.stringify(input)
	}),
	updateRule: (id, patch) => request(`rules/${encodeURIComponent(id)}`, {
		method: "PATCH",
		body: JSON.stringify(patch)
	}),
	deleteRule: (id) => request(`rules/${encodeURIComponent(id)}`, { method: "DELETE" }),
	getThreads: () => request("threads"),
	getSession: () => request("session"),
	reprocess: () => request("session/reprocess", { method: "POST" })
};
function isConnectionError(err) {
	return err instanceof DpiApiError && (err.status === 0 || err.status >= 500);
}
var PACKETS = new Intl.NumberFormat("en-US");
function formatInteger(value) {
	return PACKETS.format(Math.round(value));
}
function formatCompact(value) {
	const abs = Math.abs(value);
	if (abs >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
	if (abs >= 1e4) return `${(value / 1e3).toFixed(1)}k`;
	if (abs >= 1e3) return `${(value / 1e3).toFixed(2)}k`;
	return PACKETS.format(value);
}
function formatBytes(bytes) {
	if (bytes < 1024) return `${Math.round(bytes)} B`;
	const units = [
		"KB",
		"MB",
		"GB",
		"TB"
	];
	let value = bytes / 1024;
	let unit = 0;
	while (value >= 1024 && unit < units.length - 1) {
		value /= 1024;
		unit += 1;
	}
	const digits = value >= 100 ? 0 : value >= 10 ? 1 : 2;
	return `${value.toFixed(digits)} ${units[unit]}`;
}
function formatBps(bps) {
	if (bps < 1e3) return `${Math.round(bps)} bps`;
	if (bps < 1e6) return `${(bps / 1e3).toFixed(1)} kbps`;
	if (bps < 1e9) return `${(bps / 1e6).toFixed(2)} Mbps`;
	return `${(bps / 1e9).toFixed(2)} Gbps`;
}
function formatPercent(value, digits = 1) {
	return `${value.toFixed(digits)}%`;
}
function formatDuration(ms) {
	if (ms == null || !Number.isFinite(ms) || ms < 0) return "—";
	const totalSec = Math.round(ms / 1e3);
	const h = Math.floor(totalSec / 3600);
	const m = Math.floor(totalSec % 3600 / 60);
	const s = totalSec % 60;
	if (h > 0) return `${h}h ${m}m ${s}s`;
	if (m > 0) return `${m}m ${s}s`;
	return `${s}s`;
}
function formatClock(iso) {
	if (!iso) return "—";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	return new Intl.DateTimeFormat("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false
	}).format(d);
}
function formatDateTime(iso) {
	if (!iso) return "—";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false
	}).format(d);
}
function formatRelative(iso, now = Date.now()) {
	if (!iso) return "—";
	const t = new Date(iso).getTime();
	if (Number.isNaN(t)) return "—";
	const delta = Math.max(0, now - t);
	if (delta < 2e3) return "just now";
	if (delta < 6e4) return `${Math.floor(delta / 1e3)}s ago`;
	if (delta < 36e5) return `${Math.floor(delta / 6e4)}m ago`;
	if (delta < 864e5) return `${Math.floor(delta / 36e5)}h ago`;
	return formatDateTime(iso);
}
var keys = {
	all: ["dpi"],
	status: ["dpi", "status"],
	stats: ["dpi", "stats"],
	applications: ["dpi", "applications"],
	domains: (q) => [
		"dpi",
		"domains",
		q
	],
	domain: (id) => [
		"dpi",
		"domain",
		id
	],
	flows: (q) => [
		"dpi",
		"flows",
		q
	],
	flow: (id) => [
		"dpi",
		"flow",
		id
	],
	rules: (type) => [
		"dpi",
		"rules",
		type
	],
	threads: ["dpi", "threads"],
	session: ["dpi", "session"]
};
function pollMs(status) {
	return status === "processing" ? 2e3 : 6e3;
}
function useDebouncedValue(value, delay = 280) {
	const [debounced, setDebounced] = (0, import_react.useState)(value);
	(0, import_react.useEffect)(() => {
		const t = window.setTimeout(() => setDebounced(value), delay);
		return () => window.clearTimeout(t);
	}, [value, delay]);
	return debounced;
}
function useEngineStatus() {
	return useQuery({
		queryKey: keys.status,
		queryFn: dpiApi.getStatus,
		refetchInterval: (q) => pollMs(q.state.data?.status)
	});
}
function useStats() {
	const status = useEngineStatus();
	return useQuery({
		queryKey: keys.stats,
		queryFn: dpiApi.getStats,
		refetchInterval: pollMs(status.data?.status),
		placeholderData: keepPreviousData
	});
}
function useApplications() {
	const status = useEngineStatus();
	return useQuery({
		queryKey: keys.applications,
		queryFn: dpiApi.getApplications,
		refetchInterval: pollMs(status.data?.status),
		placeholderData: keepPreviousData
	});
}
function useDomains(query) {
	const status = useEngineStatus();
	return useQuery({
		queryKey: keys.domains(query),
		queryFn: () => dpiApi.getDomains(query),
		refetchInterval: pollMs(status.data?.status),
		placeholderData: keepPreviousData
	});
}
function useDomain(id) {
	return useQuery({
		queryKey: keys.domain(id ?? ""),
		queryFn: () => dpiApi.getDomain(id),
		enabled: Boolean(id)
	});
}
function useFlows(query) {
	const status = useEngineStatus();
	return useQuery({
		queryKey: keys.flows(query),
		queryFn: () => dpiApi.getFlows(query),
		refetchInterval: pollMs(status.data?.status),
		placeholderData: keepPreviousData
	});
}
function useFlow(id) {
	return useQuery({
		queryKey: keys.flow(id ?? ""),
		queryFn: () => dpiApi.getFlow(id),
		enabled: Boolean(id)
	});
}
function useRules(type = "all") {
	const status = useEngineStatus();
	return useQuery({
		queryKey: keys.rules(type),
		queryFn: () => dpiApi.getRules(type),
		refetchInterval: pollMs(status.data?.status),
		placeholderData: keepPreviousData
	});
}
function useThreads() {
	const status = useEngineStatus();
	return useQuery({
		queryKey: keys.threads,
		queryFn: dpiApi.getThreads,
		refetchInterval: pollMs(status.data?.status),
		placeholderData: keepPreviousData
	});
}
function useSession() {
	const status = useEngineStatus();
	return useQuery({
		queryKey: keys.session,
		queryFn: dpiApi.getSession,
		refetchInterval: pollMs(status.data?.status),
		placeholderData: keepPreviousData
	});
}
function useInvalidateDpi() {
	const client = useQueryClient();
	return () => client.invalidateQueries({ queryKey: keys.all });
}
function useCreateRule() {
	const invalidate = useInvalidateDpi();
	return useMutation({
		mutationFn: (input) => dpiApi.createRule(input),
		onSuccess: invalidate
	});
}
function useUpdateRule() {
	const invalidate = useInvalidateDpi();
	return useMutation({
		mutationFn: ({ id, patch }) => dpiApi.updateRule(id, patch),
		onSuccess: invalidate
	});
}
function useDeleteRule() {
	const invalidate = useInvalidateDpi();
	return useMutation({
		mutationFn: (id) => dpiApi.deleteRule(id),
		onSuccess: invalidate
	});
}
function useReprocess() {
	const invalidate = useInvalidateDpi();
	return useMutation({
		mutationFn: () => dpiApi.reprocess(),
		onSuccess: invalidate
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/chart-tooltip-D8hnrycO.js
function ChartTooltipFrame({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-sm",
		children: [label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-1.5 font-medium text-muted-foreground",
			children: label
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-1",
			children
		})]
	});
}
function ChartTooltipRow({ color, name, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-2",
			children: [color ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "size-2 rounded-full",
				style: { background: color }
			}) : null, name]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono tabular-nums",
			children: value
		})]
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/card-2voLP4-z.js
function Skeleton({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("animate-pulse rounded-md bg-elevated", className) });
}
function PanelSkeleton({ rows = 4 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-2",
		children: Array.from({ length: rows }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-9 w-full" }, i))
	});
}
function KpiSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-24" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-3 h-7 w-32" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-2 h-3 w-20" })
		]
	});
}
function EmptyState({ title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center gap-2 px-4 py-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, {
				className: "size-8 text-muted-foreground",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-sm text-xs text-muted-foreground",
				children: description
			})
		]
	});
}
function ErrorState({ error, onRetry, compact = false }) {
	const message = isConnectionError(error) ? "Unable to connect to DPI Engine" : error instanceof Error ? error.message : "Request failed";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: compact ? "flex items-center gap-3 px-3 py-2" : "flex flex-col items-center gap-2 px-4 py-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
				className: "size-5 text-danger",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: message
			}),
			onRetry ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: onRetry,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" }), "Retry"]
			}) : null
		]
	});
}
function PageHeader({ title, description, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-5 flex flex-wrap items-end justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-semibold tracking-tight",
			children: title
		}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-sm text-muted-foreground",
			children: description
		}) : null] }), actions]
	});
}
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-lg border border-border bg-card text-card-foreground", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex items-start justify-between gap-3 px-4 py-3", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: cn("text-sm font-medium tracking-wide text-muted-foreground", className),
		...props
	});
}
function CardContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("px-4 pb-4", className),
		...props
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/app-meta-Bya-XteP.js
var APP_COLORS = {
	YouTube: "var(--color-app-youtube)",
	Google: "var(--color-app-google)",
	HTTPS: "var(--color-app-https)",
	Facebook: "var(--color-app-facebook)",
	GitHub: "var(--color-app-github)",
	DNS: "var(--color-app-dns)",
	HTTP: "var(--color-app-http)",
	TikTok: "var(--color-app-tiktok)",
	Unknown: "var(--color-app-unknown)"
};
var APP_ICONS = {
	YouTube: Play,
	Google: Search,
	HTTPS: Lock,
	Facebook: Share2,
	GitHub: Github,
	DNS: Server,
	HTTP: Globe,
	TikTok: Music2,
	Unknown: CircleHelp
};
function appColor(name) {
	return APP_COLORS[name] ?? "var(--color-app-unknown)";
}
function appIcon(name) {
	return APP_ICONS[name] ?? CircleHelp;
}
var RULE_TYPE_LABEL = {
	ip: "IP",
	application: "Application",
	domain: "Domain"
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/badge-DV34CcFZ.js
var badgeVariants = cva("inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[0.6875rem] font-medium tracking-wide uppercase", {
	variants: { variant: {
		default: "border-border bg-elevated text-muted-foreground",
		success: "border-success/30 bg-success/10 text-success",
		warning: "border-warning/30 bg-warning/10 text-warning",
		danger: "border-danger/30 bg-danger/10 text-danger",
		info: "border-info/30 bg-info/10 text-info",
		outline: "border-border text-muted-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-b6nfBF91.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-svh flex-col items-center justify-center gap-3 bg-background px-6 text-center text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-danger",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted-foreground",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
function AppNotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-svh flex-col items-center justify-center gap-2 bg-background px-6 text-center text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium",
			children: "Page not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "That view is not part of the DPI console."
		})]
	});
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var ThemeContext = (0, import_react.createContext)({
	theme: "dark",
	toggle: () => void 0
});
function readTheme() {
	if (typeof document === "undefined") return "dark";
	return document.documentElement.classList.contains("light") ? "light" : "dark";
}
function ThemeProvider({ children }) {
	const [theme, setTheme] = (0, import_react.useState)("dark");
	(0, import_react.useEffect)(() => {
		setTheme(readTheme());
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		theme,
		toggle: () => {
			const next = theme === "dark" ? "light" : "dark";
			document.documentElement.classList.toggle("dark", next === "dark");
			document.documentElement.classList.toggle("light", next === "light");
			try {
				localStorage.setItem("dpi-theme", next);
			} catch {}
			setTheme(next);
		}
	}), [theme]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeContext.Provider, {
		value,
		children
	});
}
function useTheme() {
	return (0, import_react.useContext)(ThemeContext);
}
var TooltipProvider = Provider;
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var styles_default = "/assets/styles-DvMWgIu5.css";
var APP_NAME = "DPI Engine";
var THEME_BOOT = `(function(){try{var t=localStorage.getItem("dpi-theme")||"dark";var r=document.documentElement;r.classList.toggle("dark",t==="dark");r.classList.toggle("light",t==="light");}catch(e){document.documentElement.classList.add("dark");}})();`;
var Route$10 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Deep Packet Inspection engine monitoring dashboard."
			},
			{
				name: "theme-color",
				content: "#07090c"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	const [queryClient] = (0, import_react.useState)(() => new QueryClient({ defaultOptions: { queries: {
		staleTime: 1500,
		retry: 1,
		refetchOnWindowFocus: false
	} } }));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "dark antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: THEME_BOOT } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "min-h-svh bg-background text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
					client: queryClient,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, {
						delayDuration: 200,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemedToaster, {})]
					}) })
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
function ThemedToaster() {
	const { theme } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		theme,
		richColors: false,
		position: "bottom-right"
	});
}
var $$splitComponentImporter$7 = () => import("../_dash-BM4DlaVb.mjs");
var Route$9 = createFileRoute("/_dash")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("../_dash-CARO9CGs.mjs");
var Route$8 = createFileRoute("/_dash/")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
function AppDonut({ data, isLoading, error, onRetry }) {
	if (isLoading && !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mx-auto h-56 w-56 rounded-full" });
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		error,
		onRetry
	});
	if (!data?.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "No applications",
		description: "The engine has not classified any application traffic yet."
	});
	const total = data.reduce((s, d) => s + d.packets, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto h-56 w-56",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
				data,
				dataKey: "packets",
				nameKey: "name",
				innerRadius: 62,
				outerRadius: 88,
				paddingAngle: 1.5,
				stroke: "none",
				children: data.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: appColor(row.name) }, row.name))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload }) => {
				if (!active || !payload?.length) return null;
				const row = payload[0].payload;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ChartTooltipFrame, {
					label: row.name,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipRow, {
						name: "Packets",
						value: formatInteger(row.packets)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipRow, {
						name: "Share",
						value: formatPercent(row.percent)
					})]
				});
			} })] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xl tabular-nums",
					children: data.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[0.6875rem] uppercase tracking-wider text-muted-foreground",
					children: "Apps"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-[0.6875rem] tabular-nums text-muted-foreground",
					children: [formatInteger(total), " pkts"]
				})
			]
		})]
	});
}
var engineMap = {
	online: {
		label: "Online",
		variant: "success",
		Icon: CircleCheck
	},
	processing: {
		label: "Processing",
		variant: "info",
		Icon: LoaderCircle,
		pulse: true
	},
	idle: {
		label: "Idle",
		variant: "warning",
		Icon: TriangleAlert
	},
	error: {
		label: "Error",
		variant: "danger",
		Icon: CircleX
	}
};
function EngineStatusBadge({ status }) {
	const { label, variant, Icon, pulse } = engineMap[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant,
		className: "normal-case tracking-normal",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: cn("size-3", pulse && "animate-spin"),
			"aria-hidden": true
		}), label]
	});
}
function TrafficStatusBadge({ status }) {
	if (status === "forwarded" || status === "allowed" || status === "normal") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant: "success",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
			className: "size-3",
			"aria-hidden": true
		}), status === "forwarded" ? "Fwd" : status === "allowed" ? "Allow" : "OK"]
	});
	if (status === "dropped" || status === "blocked") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant: "danger",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, {
			className: "size-3",
			"aria-hidden": true
		}), "Blocked"]
	});
	if (status === "processing") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant: "info",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
			className: "size-3 animate-spin",
			"aria-hidden": true
		}), "Processing"]
	});
	if (status === "warning") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant: "warning",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
			className: "size-3",
			"aria-hidden": true
		}), "Warning"]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant: "danger",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, {
			className: "size-3",
			"aria-hidden": true
		}), "Error"]
	});
}
function SessionStatusBadge({ status }) {
	const item = {
		idle: {
			label: "Idle",
			variant: "warning"
		},
		queued: {
			label: "Queued",
			variant: "default"
		},
		processing: {
			label: "Processing",
			variant: "info"
		},
		completed: {
			label: "Completed",
			variant: "success"
		},
		failed: {
			label: "Failed",
			variant: "danger"
		}
	}[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: item.variant,
		children: item.label
	});
}
function ThreadHealthBadge({ status }) {
	if (status === "ok") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant: "success",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
			className: "size-3",
			"aria-hidden": true
		}), "OK"]
	});
	if (status === "warning") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant: "warning",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
			className: "size-3",
			"aria-hidden": true
		}), "Queue high"]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant: "danger",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, {
			className: "size-3",
			"aria-hidden": true
		}), "Error"]
	});
}
function LiveDot({ active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "relative inline-flex size-2",
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute inline-flex size-full rounded-full", active ? "bg-success/40 pulse-dot" : "bg-muted-foreground/40") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("relative inline-flex size-2 rounded-full", active ? "bg-success" : "bg-muted-foreground") })]
	});
}
function SortButton({ label, active, dir, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "ghost",
		size: "sm",
		className: "-ml-2 h-7 px-2 text-xs font-medium text-muted-foreground",
		onClick,
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(!active ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown, { className: "size-3.5" })]
	});
}
function TableWrap({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children
	});
}
function Table({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
		className: cn("w-full min-w-[40rem] text-left text-sm", className),
		...props
	});
}
function THead({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
		className: "border-b border-border text-xs text-muted-foreground",
		children
	}) });
}
function Th({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
		className: cn("px-3 py-2 font-medium", className),
		children
	});
}
function Td({ children, className, mono }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		className: cn("border-b border-border px-3 py-2", mono && "font-mono tabular-nums text-xs", className),
		children
	});
}
function Pagination({ page, pageSize, total, onPage }) {
	const pages = Math.max(1, Math.ceil(total / pageSize));
	const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
	const to = Math.min(total, page * pageSize);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-3 px-1 pt-3 text-xs text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
			from,
			"–",
			to,
			" of ",
			total
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				disabled: page <= 1,
				onClick: () => onPage(page - 1),
				children: "Prev"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				disabled: page >= pages,
				onClick: () => onPage(page + 1),
				children: "Next"
			})]
		})]
	});
}
var Route$7 = createFileRoute("/_dash/applications")({ component: ApplicationsPage });
function ApplicationsPage() {
	const apps = useApplications();
	const [sort, setSort] = (0, import_react.useState)("packets");
	const [dir, setDir] = (0, import_react.useState)("desc");
	const rows = (0, import_react.useMemo)(() => {
		const list = [...apps.data ?? []];
		list.sort((a, b) => {
			const av = a[sort];
			const bv = b[sort];
			const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
			return dir === "asc" ? cmp : -cmp;
		});
		return list;
	}, [
		apps.data,
		sort,
		dir
	]);
	function toggle(key) {
		if (sort === key) setDir((d) => d === "asc" ? "desc" : "asc");
		else {
			setSort(key);
			setDir(key === "name" || key === "status" ? "asc" : "desc");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Applications",
		description: "Classification results from the DPI engine. Blocking status is evaluated against active rules."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 xl:grid-cols-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "xl:col-span-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Distribution" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppDonut, {
				data: apps.data,
				isLoading: apps.isLoading,
				error: apps.error,
				onRetry: () => apps.refetch()
			}) })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "xl:col-span-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Breakdown" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: apps.isLoading && !apps.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelSkeleton, { rows: 8 }) : apps.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
				error: apps.error,
				onRetry: () => apps.refetch()
			}) : !rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No applications detected",
				description: "The engine has not classified any flows in this session."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableWrap, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(THead, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortButton, {
					label: "Application",
					active: sort === "name",
					dir,
					onClick: () => toggle("name")
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortButton, {
					label: "Packets",
					active: sort === "packets",
					dir,
					onClick: () => toggle("packets")
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortButton, {
					label: "Bytes",
					active: sort === "bytes",
					dir,
					onClick: () => toggle("bytes")
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortButton, {
					label: "Share",
					active: sort === "percent",
					dir,
					onClick: () => toggle("percent")
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortButton, {
					label: "Flows",
					active: sort === "flows",
					dir,
					onClick: () => toggle("flows")
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortButton, {
					label: "Status",
					active: sort === "status",
					dir,
					onClick: () => toggle("status")
				}) })
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppRow, { row }, row.name)) })] }) }) })]
		})]
	})] });
}
function AppRow({ row }) {
	const Icon = appIcon(row.name);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		className: "hover:bg-elevated/60",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5 text-muted-foreground" }), row.name]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				mono: true,
				children: formatInteger(row.packets)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				mono: true,
				children: formatBytes(row.bytes)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "h-1.5 w-16 overflow-hidden rounded-full bg-elevated",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block h-full bg-brand",
						style: { width: `${Math.min(100, row.percent)}%` }
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs tabular-nums",
					children: formatPercent(row.percent)
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				mono: true,
				children: formatInteger(row.flows)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrafficStatusBadge, { status: row.status }) })
		]
	});
}
var $$splitComponentImporter$5 = () => import("./domains-vdsKD_y2.mjs");
var Route$6 = createFileRoute("/_dash/domains")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./flows-D_9VQFK0.mjs");
var Route$5 = createFileRoute("/_dash/flows")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./processing-DtjBuClv.mjs");
var Route$4 = createFileRoute("/_dash/processing")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./rules-BLuwjyJs.mjs");
var Route$3 = createFileRoute("/_dash/rules")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./system-Dnh1SydP.mjs");
var Route$2 = createFileRoute("/_dash/system")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./traffic-qC5Z8Pw4.mjs");
var Route$1 = createFileRoute("/_dash/traffic")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var ENGINE_NAME = "DPI Engine";
var ENGINE_VERSION = "2.4.1";
var INPUT_PCAP = "campus-edge-2026-08-31.pcap";
var OUTPUT_PCAP = "campus-edge-2026-08-31.filtered.pcap";
var SESSION_ID = "sess-8f3c21";
var PROCESSING_MS = 16e3;
var BUCKETS = 32;
var PAGE_SIZE_DEFAULT = 25;
var FLOW_SPECS = [
	{
		srcIp: "10.12.4.18",
		dstIp: "142.250.190.14",
		srcPort: 49152,
		dstPort: 443,
		protocol: "TCP",
		application: "YouTube",
		domain: "www.youtube.com",
		packets: 1240,
		avgBytes: 1380
	},
	{
		srcIp: "10.12.4.22",
		dstIp: "142.250.190.46",
		srcPort: 49188,
		dstPort: 443,
		protocol: "TCP",
		application: "YouTube",
		domain: "googlevideo.com",
		packets: 1560,
		avgBytes: 1440
	},
	{
		srcIp: "10.12.4.31",
		dstIp: "142.250.64.14",
		srcPort: 50301,
		dstPort: 443,
		protocol: "TCP",
		application: "YouTube",
		domain: "i.ytimg.com",
		packets: 420,
		avgBytes: 980
	},
	{
		srcIp: "10.12.4.57",
		dstIp: "142.250.190.78",
		srcPort: 50880,
		dstPort: 443,
		protocol: "TCP",
		application: "YouTube",
		domain: "www.youtube.com",
		packets: 310,
		avgBytes: 1210
	},
	{
		srcIp: "10.12.4.18",
		dstIp: "142.251.41.14",
		srcPort: 49200,
		dstPort: 443,
		protocol: "TCP",
		application: "Google",
		domain: "www.google.com",
		packets: 880,
		avgBytes: 720
	},
	{
		srcIp: "10.12.4.44",
		dstIp: "142.251.41.14",
		srcPort: 49512,
		dstPort: 443,
		protocol: "TCP",
		application: "Google",
		domain: "www.google.com",
		packets: 310,
		avgBytes: 640
	},
	{
		srcIp: "10.12.4.22",
		dstIp: "172.217.18.10",
		srcPort: 50110,
		dstPort: 443,
		protocol: "TCP",
		application: "Google",
		domain: "fonts.googleapis.com",
		packets: 640,
		avgBytes: 890
	},
	{
		srcIp: "10.12.4.57",
		dstIp: "142.250.185.189",
		srcPort: 51120,
		dstPort: 443,
		protocol: "TCP",
		application: "Google",
		domain: "accounts.google.com",
		packets: 290,
		avgBytes: 580
	},
	{
		srcIp: "10.12.4.18",
		dstIp: "142.250.185.99",
		srcPort: 51121,
		dstPort: 443,
		protocol: "TCP",
		application: "Google",
		domain: "www.gstatic.com",
		packets: 410,
		avgBytes: 760
	},
	{
		srcIp: "10.12.4.31",
		dstIp: "104.16.132.229",
		srcPort: 49300,
		dstPort: 443,
		protocol: "TCP",
		application: "HTTPS",
		domain: "cloudflare.com",
		packets: 520,
		avgBytes: 1100
	},
	{
		srcIp: "10.12.4.44",
		dstIp: "103.102.166.224",
		srcPort: 49340,
		dstPort: 443,
		protocol: "TCP",
		application: "HTTPS",
		domain: "www.wikipedia.org",
		packets: 380,
		avgBytes: 1250
	},
	{
		srcIp: "10.12.4.61",
		dstIp: "151.101.1.140",
		srcPort: 49400,
		dstPort: 443,
		protocol: "TCP",
		application: "HTTPS",
		domain: "cdn.jsdelivr.net",
		packets: 270,
		avgBytes: 900
	},
	{
		srcIp: "192.168.10.8",
		dstIp: "104.16.25.35",
		srcPort: 50500,
		dstPort: 443,
		protocol: "TCP",
		application: "HTTPS",
		domain: "registry.npmjs.org",
		packets: 190,
		avgBytes: 840
	},
	{
		srcIp: "10.12.4.22",
		dstIp: "93.184.216.34",
		srcPort: 50666,
		dstPort: 443,
		protocol: "TCP",
		application: "HTTPS",
		domain: "example.com",
		packets: 140,
		avgBytes: 700
	},
	{
		srcIp: "10.12.4.18",
		dstIp: "8.8.4.4",
		srcPort: 53200,
		dstPort: 853,
		protocol: "TCP",
		application: "HTTPS",
		domain: null,
		packets: 42,
		avgBytes: 400
	},
	{
		srcIp: "10.12.4.57",
		dstIp: "157.240.22.35",
		srcPort: 49700,
		dstPort: 443,
		protocol: "TCP",
		application: "Facebook",
		domain: "www.facebook.com",
		packets: 760,
		avgBytes: 1180
	},
	{
		srcIp: "10.12.4.61",
		dstIp: "157.240.22.35",
		srcPort: 49750,
		dstPort: 443,
		protocol: "TCP",
		application: "Facebook",
		domain: "www.facebook.com",
		packets: 330,
		avgBytes: 1020
	},
	{
		srcIp: "192.168.10.19",
		dstIp: "31.13.71.36",
		srcPort: 49800,
		dstPort: 443,
		protocol: "TCP",
		application: "Facebook",
		domain: "static.xx.fbcdn.net",
		packets: 510,
		avgBytes: 1340
	},
	{
		srcIp: "10.12.4.18",
		dstIp: "140.82.112.4",
		srcPort: 49900,
		dstPort: 443,
		protocol: "TCP",
		application: "GitHub",
		domain: "github.com",
		packets: 420,
		avgBytes: 880
	},
	{
		srcIp: "10.12.4.44",
		dstIp: "140.82.113.6",
		srcPort: 49980,
		dstPort: 443,
		protocol: "TCP",
		application: "GitHub",
		domain: "api.github.com",
		packets: 280,
		avgBytes: 640
	},
	{
		srcIp: "192.168.10.8",
		dstIp: "185.199.108.133",
		srcPort: 50010,
		dstPort: 443,
		protocol: "TCP",
		application: "GitHub",
		domain: "avatars.githubusercontent.com",
		packets: 160,
		avgBytes: 720
	},
	{
		srcIp: "10.12.4.18",
		dstIp: "10.12.0.1",
		srcPort: 53001,
		dstPort: 53,
		protocol: "UDP",
		application: "DNS",
		domain: null,
		packets: 86,
		avgBytes: 92
	},
	{
		srcIp: "10.12.4.22",
		dstIp: "10.12.0.1",
		srcPort: 53002,
		dstPort: 53,
		protocol: "UDP",
		application: "DNS",
		domain: null,
		packets: 74,
		avgBytes: 88
	},
	{
		srcIp: "10.12.4.31",
		dstIp: "8.8.8.8",
		srcPort: 53003,
		dstPort: 53,
		protocol: "UDP",
		application: "DNS",
		domain: null,
		packets: 112,
		avgBytes: 96
	},
	{
		srcIp: "10.12.4.44",
		dstIp: "1.1.1.1",
		srcPort: 53004,
		dstPort: 53,
		protocol: "UDP",
		application: "DNS",
		domain: null,
		packets: 64,
		avgBytes: 84
	},
	{
		srcIp: "192.168.10.8",
		dstIp: "10.12.0.1",
		srcPort: 53005,
		dstPort: 53,
		protocol: "UDP",
		application: "DNS",
		domain: null,
		packets: 48,
		avgBytes: 90
	},
	{
		srcIp: "10.12.4.31",
		dstIp: "34.223.124.45",
		srcPort: 50100,
		dstPort: 80,
		protocol: "TCP",
		application: "HTTP",
		domain: "neverssl.com",
		packets: 120,
		avgBytes: 540
	},
	{
		srcIp: "192.168.10.19",
		dstIp: "93.184.216.34",
		srcPort: 50130,
		dstPort: 80,
		protocol: "TCP",
		application: "HTTP",
		domain: "example.com",
		packets: 95,
		avgBytes: 480
	},
	{
		srcIp: "10.12.4.22",
		dstIp: "23.59.137.27",
		srcPort: 51200,
		dstPort: 443,
		protocol: "TCP",
		application: "TikTok",
		domain: "www.tiktok.com",
		packets: 640,
		avgBytes: 1280
	},
	{
		srcIp: "10.12.4.57",
		dstIp: "23.59.137.27",
		srcPort: 51240,
		dstPort: 443,
		protocol: "TCP",
		application: "TikTok",
		domain: "www.tiktok.com",
		packets: 280,
		avgBytes: 1190
	},
	{
		srcIp: "192.168.10.19",
		dstIp: "104.123.68.10",
		srcPort: 51300,
		dstPort: 443,
		protocol: "TCP",
		application: "TikTok",
		domain: "v16.tiktokcdn.com",
		packets: 390,
		avgBytes: 1410
	},
	{
		srcIp: "10.12.4.61",
		dstIp: "203.0.113.77",
		srcPort: 52e3,
		dstPort: 443,
		protocol: "TCP",
		application: "Unknown",
		domain: null,
		packets: 88,
		avgBytes: 600
	},
	{
		srcIp: "10.12.4.18",
		dstIp: "203.0.113.77",
		srcPort: 52040,
		dstPort: 443,
		protocol: "TCP",
		application: "Unknown",
		domain: null,
		packets: 54,
		avgBytes: 520
	},
	{
		srcIp: "192.168.10.8",
		dstIp: "198.51.100.10",
		srcPort: 52100,
		dstPort: 443,
		protocol: "TCP",
		application: "Unknown",
		domain: "cdn.obscure-host.net",
		packets: 96,
		avgBytes: 700
	}
];
var IP_RE = /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/;
var HOST_RE = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;
function iso(ms) {
	return new Date(ms).toISOString();
}
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function curve(i, n) {
	const x = (i + .5) / n;
	const w = Math.sin(Math.PI * x);
	return w * w;
}
function matchRule(rule, flow) {
	if (!rule.enabled) return false;
	if (rule.type === "ip") return flow.srcIp === rule.value || flow.dstIp === rule.value;
	if (rule.type === "application") return flow.application.toLowerCase() === rule.value.toLowerCase();
	const hay = (flow.domain ?? "").toLowerCase();
	const needle = rule.value.toLowerCase().replace(/^\*\./, "");
	return hay === needle || hay.endsWith(`.${needle}`) || hay.includes(needle);
}
function paginate(items, page, pageSize) {
	const p = Math.max(1, page);
	const size = clamp(pageSize, 1, 200);
	const start = (p - 1) * size;
	return {
		items: items.slice(start, start + size),
		total: items.length,
		page: p,
		pageSize: size
	};
}
function compareValues(a, b, dir) {
	const mul = dir === "asc" ? 1 : -1;
	if (typeof a === "number" && typeof b === "number") return (a - b) * mul;
	return String(a ?? "").localeCompare(String(b ?? ""), void 0, { numeric: true }) * mul;
}
function pick(row, key) {
	return row[key];
}
var DpiEngineStore = class {
	bootAt = Date.now();
	phase = "completed";
	processStartedAt = this.bootAt - 48e4;
	processDurationMs = 47320;
	rules;
	ruleSeq = 3;
	constructor() {
		const t0 = this.processStartedAt;
		this.rules = [
			{
				id: "rule-1",
				type: "domain",
				value: "tiktok",
				enabled: true,
				packetsAffected: 0,
				createdAt: iso(t0 - 864e5),
				updatedAt: iso(t0 - 36e5)
			},
			{
				id: "rule-2",
				type: "application",
				value: "YouTube",
				enabled: false,
				packetsAffected: 0,
				createdAt: iso(t0 - 72e6),
				updatedAt: iso(t0 - 24e5)
			},
			{
				id: "rule-3",
				type: "ip",
				value: "203.0.113.77",
				enabled: true,
				packetsAffected: 0,
				createdAt: iso(t0 - 48e6),
				updatedAt: iso(t0 - 18e5)
			}
		];
	}
	progress() {
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
	classifiedFlows(progress) {
		const n = FLOW_SPECS.length;
		const visible = Math.max(0, Math.ceil(n * progress));
		const sessionStart = this.processStartedAt;
		const sessionSpan = this.processDurationMs;
		return FLOW_SPECS.slice(0, visible).map((spec, i) => {
			const firstSeen = sessionStart + Math.floor(i / Math.max(n, 1) * sessionSpan * .92);
			const lastSeen = firstSeen + Math.max(400, Math.floor(spec.packets * 12));
			const matched = this.rules.find((r) => matchRule(r, spec));
			const status = matched ? "dropped" : "forwarded";
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
				lastSeen: iso(Math.min(lastSeen, sessionStart + sessionSpan))
			};
		});
	}
	withRuleCounts(flows) {
		return this.rules.map((rule) => ({
			...rule,
			packetsAffected: flows.filter((f) => matchRule({
				...rule,
				enabled: true
			}, f)).reduce((sum, f) => sum + f.packets, 0)
		}));
	}
	overview(flows, durationMs) {
		const totalPackets = flows.reduce((s, f) => s + f.packets, 0);
		const totalBytes = flows.reduce((s, f) => s + f.bytes, 0);
		const forwardedPackets = flows.filter((f) => f.status === "forwarded").reduce((s, f) => s + f.packets, 0);
		const droppedPackets = totalPackets - forwardedPackets;
		const secs = Math.max(durationMs / 1e3, .001);
		const apps = new Set(flows.map((f) => f.application));
		const domains = new Set(flows.map((f) => f.domain).filter(Boolean));
		return {
			totalPackets,
			packetsPerSec: totalPackets / secs,
			totalBytes,
			throughputBps: totalBytes * 8 / secs,
			forwardedPackets,
			forwardedPercent: totalPackets === 0 ? 0 : forwardedPackets / totalPackets * 100,
			droppedPackets,
			droppedPercent: totalPackets === 0 ? 0 : droppedPackets / totalPackets * 100,
			activeFlows: flows.length,
			detectedApplications: apps.size,
			detectedDomains: domains.size
		};
	}
	timeseries(flows, progress) {
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
		const points = [];
		for (let i = 0; i < ready; i += 1) {
			const share = weights[i] / weightSum;
			const ts = this.processStartedAt + Math.floor((i + 1) / BUCKETS * this.processDurationMs);
			points.push({
				ts: iso(ts),
				packets: Math.round(totalPackets * share),
				bytes: Math.round(totalBytes * share),
				forwarded: Math.round(totalPackets * share * fwdRatio),
				dropped: Math.round(totalPackets * share * dropRatio)
			});
		}
		return points;
	}
	applications(flows) {
		const total = flows.reduce((s, f) => s + f.packets, 0) || 1;
		const map = /* @__PURE__ */ new Map();
		for (const flow of flows) {
			const current = map.get(flow.application) ?? {
				name: flow.application,
				packets: 0,
				bytes: 0,
				percent: 0,
				flows: 0,
				status: "allowed"
			};
			current.packets += flow.packets;
			current.bytes += flow.bytes;
			current.flows += 1;
			if (flow.status === "dropped") current.status = "blocked";
			map.set(flow.application, current);
		}
		return [...map.values()].map((row) => ({
			...row,
			percent: row.packets / total * 100
		})).sort((a, b) => b.packets - a.packets);
	}
	domains(flows) {
		const map = /* @__PURE__ */ new Map();
		for (const flow of flows) {
			if (!flow.domain) continue;
			const current = map.get(flow.domain) ?? {
				id: `dom-${flow.domain.replace(/[^a-z0-9]+/gi, "-")}`,
				domain: flow.domain,
				application: flow.application,
				packets: 0,
				bytes: 0,
				flows: 0,
				status: "allowed",
				firstSeen: flow.firstSeen,
				lastSeen: flow.lastSeen,
				source: flow.dstPort === 80 ? "http_host" : "sni"
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
	threads(flows, progress) {
		const total = flows.reduce((s, f) => s + f.packets, 0);
		const forwarded = flows.filter((f) => f.status === "forwarded").reduce((s, f) => s + f.packets, 0);
		const load = .38 + progress * .28;
		const fpPackets = [
			.27,
			.24,
			.22,
			.27
		].map((s) => Math.round(total * s));
		const lb0 = fpPackets[0] + fpPackets[1];
		const lb1 = fpPackets[2] + fpPackets[3];
		const util = (base, hot = 0) => clamp(Math.round((base + hot) * 100), 4, 96);
		const rate = (packets) => this.processDurationMs > 0 ? packets / (this.processDurationMs / 1e3) : 0;
		const fp1Queue = Math.round(28 + progress * 160);
		const mk = (partial) => {
			const queueBusy = partial.queueDepth != null && partial.queueCapacity != null && partial.queueDepth / partial.queueCapacity >= .7;
			const utilization = partial.utilization;
			return {
				...partial,
				rate: partial.rate ?? rate(partial.packets),
				status: partial.status ?? (queueBusy || utilization >= 86 ? "warning" : "ok")
			};
		};
		return [
			mk({
				id: "reader",
				name: "Reader",
				role: "reader",
				packets: total,
				utilization: util(load, -.08),
				queueDepth: Math.round(6 + progress * 10),
				queueCapacity: 64,
				parentId: null,
				children: ["lb-0", "lb-1"]
			}),
			mk({
				id: "lb-0",
				name: "LB0",
				role: "load_balancer",
				packets: lb0,
				utilization: util(load, -.04),
				queueDepth: Math.round(12 + progress * 18),
				queueCapacity: 128,
				parentId: "reader",
				children: ["fp-0", "fp-1"]
			}),
			mk({
				id: "lb-1",
				name: "LB1",
				role: "load_balancer",
				packets: lb1,
				utilization: util(load, -.07),
				queueDepth: Math.round(9 + progress * 14),
				queueCapacity: 128,
				parentId: "reader",
				children: ["fp-2", "fp-3"]
			}),
			mk({
				id: "fp-0",
				name: "FP0",
				role: "fast_path",
				packets: fpPackets[0],
				utilization: util(load, -.1),
				queueDepth: Math.round(16 + progress * 22),
				queueCapacity: 256,
				parentId: "lb-0",
				children: []
			}),
			mk({
				id: "fp-1",
				name: "FP1",
				role: "fast_path",
				packets: fpPackets[1],
				utilization: util(load, .18),
				queueDepth: fp1Queue,
				queueCapacity: 256,
				parentId: "lb-0",
				children: []
			}),
			mk({
				id: "fp-2",
				name: "FP2",
				role: "fast_path",
				packets: fpPackets[2],
				utilization: util(load, -.12),
				queueDepth: Math.round(11 + progress * 16),
				queueCapacity: 256,
				parentId: "lb-1",
				children: []
			}),
			mk({
				id: "fp-3",
				name: "FP3",
				role: "fast_path",
				packets: fpPackets[3],
				utilization: util(load, -.05),
				queueDepth: Math.round(14 + progress * 20),
				queueCapacity: 256,
				parentId: "lb-1",
				children: []
			}),
			mk({
				id: "writer",
				name: "Writer",
				role: "writer",
				packets: forwarded,
				utilization: util(load * .7, -.12),
				queueDepth: Math.round(4 + progress * 8),
				queueCapacity: 64,
				parentId: null,
				children: []
			})
		];
	}
	sessionView(flows, progress, overview) {
		const activeRules = this.rules.filter((r) => r.enabled).length;
		const endTime = this.phase === "completed" ? iso(this.processStartedAt + this.processDurationMs) : null;
		const durationMs = this.phase === "processing" ? Date.now() - this.processStartedAt : this.phase === "completed" ? this.processDurationMs : null;
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
			activeRules
		};
	}
	snapshot() {
		const progress = this.progress();
		const flows = this.classifiedFlows(progress);
		const durationMs = this.phase === "processing" ? Date.now() - this.processStartedAt : this.processDurationMs;
		return {
			progress,
			flows,
			overview: this.overview(flows, durationMs)
		};
	}
	getStatus() {
		this.progress();
		return {
			name: ENGINE_NAME,
			version: ENGINE_VERSION,
			status: this.phase === "processing" ? "processing" : this.phase === "idle" ? "idle" : "online",
			capture: this.phase === "idle" ? null : INPUT_PCAP,
			lastUpdated: iso(Date.now()),
			uptimeSeconds: Math.floor((Date.now() - this.bootAt) / 1e3),
			connected: true
		};
	}
	getStats() {
		const { progress, flows, overview } = this.snapshot();
		return {
			overview,
			timeseries: this.timeseries(flows, progress)
		};
	}
	getApplications() {
		return this.applications(this.snapshot().flows);
	}
	getDomains(query = {}) {
		const { q = "", page = 1, pageSize = PAGE_SIZE_DEFAULT, sort = "packets", dir = "desc", status = "all", application } = query;
		let rows = this.domains(this.snapshot().flows);
		const needle = q.trim().toLowerCase();
		if (needle) rows = rows.filter((d) => d.domain.toLowerCase().includes(needle) || d.application.toLowerCase().includes(needle));
		if (status !== "all") rows = rows.filter((d) => d.status === status);
		if (application) rows = rows.filter((d) => d.application === application);
		rows = [...rows].sort((a, b) => compareValues(pick(a, sort), pick(b, sort), dir));
		return paginate(rows, page, pageSize);
	}
	getDomain(id) {
		return this.domains(this.snapshot().flows).find((d) => d.id === id || d.domain === id) ?? null;
	}
	getFlows(query = {}) {
		const { q = "", page = 1, pageSize = PAGE_SIZE_DEFAULT, sort = "packets", dir = "desc", status = "all", application } = query;
		let rows = this.snapshot().flows;
		const needle = q.trim().toLowerCase();
		if (needle) rows = rows.filter((f) => {
			return `${f.srcIp} ${f.dstIp} ${f.srcPort} ${f.dstPort} ${f.protocol} ${f.application} ${f.domain ?? ""} ${f.blockReason ?? ""}`.toLowerCase().includes(needle);
		});
		if (status !== "all") rows = rows.filter((f) => f.status === status);
		if (application) rows = rows.filter((f) => f.application === application);
		rows = [...rows].sort((a, b) => compareValues(pick(a, sort), pick(b, sort), dir));
		return paginate(rows, page, pageSize);
	}
	getFlow(id) {
		return this.snapshot().flows.find((f) => f.id === id) ?? null;
	}
	getRules(type) {
		const { flows } = this.snapshot();
		const rules = this.withRuleCounts(flows);
		if (!type || type === "all") return rules;
		return rules.filter((r) => r.type === type);
	}
	createRule(input) {
		const value = input.value.trim();
		this.assertRuleValue(input.type, value);
		if (this.rules.find((r) => r.type === input.type && r.value.toLowerCase() === value.toLowerCase())) {
			const err = /* @__PURE__ */ new Error("A rule with this type and value already exists");
			err.status = 409;
			throw err;
		}
		this.ruleSeq += 1;
		const now = iso(Date.now());
		const rule = {
			id: `rule-${this.ruleSeq}`,
			type: input.type,
			value,
			enabled: input.enabled ?? true,
			packetsAffected: 0,
			createdAt: now,
			updatedAt: now
		};
		this.rules = [rule, ...this.rules];
		const { flows } = this.snapshot();
		return this.withRuleCounts(flows).find((r) => r.id === rule.id);
	}
	updateRule(id, patch) {
		const idx = this.rules.findIndex((r) => r.id === id);
		if (idx < 0) {
			const err = /* @__PURE__ */ new Error("Rule not found");
			err.status = 404;
			throw err;
		}
		const current = this.rules[idx];
		const nextType = patch.type ?? current.type;
		const nextValue = (patch.value ?? current.value).trim();
		this.assertRuleValue(nextType, nextValue);
		if (this.rules.find((r) => r.id !== id && r.type === nextType && r.value.toLowerCase() === nextValue.toLowerCase())) {
			const err = /* @__PURE__ */ new Error("A rule with this type and value already exists");
			err.status = 409;
			throw err;
		}
		this.rules[idx] = {
			...current,
			type: nextType,
			value: nextValue,
			enabled: patch.enabled ?? current.enabled,
			updatedAt: iso(Date.now())
		};
		const { flows } = this.snapshot();
		return this.withRuleCounts(flows)[idx];
	}
	deleteRule(id) {
		const idx = this.rules.findIndex((r) => r.id === id);
		if (idx < 0) {
			const err = /* @__PURE__ */ new Error("Rule not found");
			err.status = 404;
			throw err;
		}
		this.rules.splice(idx, 1);
	}
	getThreads() {
		const { progress, flows } = this.snapshot();
		return this.threads(flows, progress);
	}
	getSession() {
		const { progress, flows, overview } = this.snapshot();
		return this.sessionView(flows, progress, overview);
	}
	reprocess() {
		this.phase = "processing";
		this.processStartedAt = Date.now();
		this.processDurationMs = PROCESSING_MS;
		return this.getSession();
	}
	assertRuleValue(type, value) {
		if (!value) {
			const err = /* @__PURE__ */ new Error("Rule value is required");
			err.status = 400;
			throw err;
		}
		if (type === "ip" && !IP_RE.test(value)) {
			const err = /* @__PURE__ */ new Error("Enter a valid IPv4 address");
			err.status = 400;
			throw err;
		}
		if (type === "domain" && !HOST_RE.test(value) && !HOST_RE.test(value.replace(/^\*\./, ""))) {
			const err = /* @__PURE__ */ new Error("Enter a valid domain name");
			err.status = 400;
			throw err;
		}
		if (type === "application" && value.length > 64) {
			const err = /* @__PURE__ */ new Error("Application name is too long");
			err.status = 400;
			throw err;
		}
	}
};
var globalStore = globalThis;
function getEngineStore() {
	if (!globalStore.__dpiEngineStoreV2) globalStore.__dpiEngineStoreV2 = new DpiEngineStore();
	return globalStore.__dpiEngineStoreV2;
}
var RuleBody = object({
	type: _enum([
		"ip",
		"application",
		"domain"
	]),
	value: string().min(1).max(253),
	enabled: boolean().optional()
});
var RulePatch = object({
	type: _enum([
		"ip",
		"application",
		"domain"
	]).optional(),
	value: string().min(1).max(253).optional(),
	enabled: boolean().optional()
});
function dpiPath(request) {
	return new URL(request.url).pathname.replace(/^\/api\/dpi\/?/, "").replace(/\/$/, "");
}
function json(data, status = 200) {
	return Response.json(data, { status });
}
function error(message, status = 400, code) {
	return Response.json({
		error: message,
		code
	}, { status });
}
function asDir(value) {
	return value === "asc" ? "asc" : "desc";
}
function handleError(err) {
	const status = typeof err === "object" && err && "status" in err ? Number(err.status) : 500;
	return error(err instanceof Error ? err.message : "Internal engine error", Number.isFinite(status) ? status : 500);
}
var Route = createFileRoute("/api/dpi/$")({ server: { handlers: {
	GET: async ({ request }) => {
		const store = getEngineStore();
		const path = dpiPath(request);
		const url = new URL(request.url);
		try {
			if (path === "status") return json(store.getStatus());
			if (path === "stats") return json(store.getStats());
			if (path === "applications") return json(store.getApplications());
			if (path === "threads") return json(store.getThreads());
			if (path === "session") return json(store.getSession());
			if (path === "rules") {
				const type = url.searchParams.get("type") ?? "all";
				return json(store.getRules(type));
			}
			if (path === "domains") return json(store.getDomains({
				q: url.searchParams.get("q") ?? "",
				page: Number(url.searchParams.get("page") ?? "1"),
				pageSize: Number(url.searchParams.get("pageSize") ?? "25"),
				sort: url.searchParams.get("sort") ?? "packets",
				dir: asDir(url.searchParams.get("dir")),
				status: url.searchParams.get("status") ?? "all",
				application: url.searchParams.get("application") ?? void 0
			}));
			if (path === "flows") return json(store.getFlows({
				q: url.searchParams.get("q") ?? "",
				page: Number(url.searchParams.get("page") ?? "1"),
				pageSize: Number(url.searchParams.get("pageSize") ?? "25"),
				sort: url.searchParams.get("sort") ?? "packets",
				dir: asDir(url.searchParams.get("dir")),
				status: url.searchParams.get("status") ?? "all",
				application: url.searchParams.get("application") ?? void 0
			}));
			if (path.startsWith("domains/")) {
				const id = decodeURIComponent(path.slice(8));
				const row = store.getDomain(id);
				return row ? json(row) : error("Domain not found", 404);
			}
			if (path.startsWith("flows/")) {
				const id = decodeURIComponent(path.slice(6));
				const row = store.getFlow(id);
				return row ? json(row) : error("Flow not found", 404);
			}
			return error("Unknown DPI endpoint", 404);
		} catch (err) {
			return handleError(err);
		}
	},
	POST: async ({ request }) => {
		const store = getEngineStore();
		const path = dpiPath(request);
		try {
			if (path === "session/reprocess") return json(store.reprocess());
			if (path === "rules") {
				const body = RuleBody.parse(await request.json());
				return json(store.createRule(body), 201);
			}
			return error("Unknown DPI endpoint", 404);
		} catch (err) {
			if (err instanceof ZodError) return error("Invalid rule payload", 400);
			return handleError(err);
		}
	},
	PATCH: async ({ request }) => {
		const store = getEngineStore();
		const path = dpiPath(request);
		try {
			if (path.startsWith("rules/")) {
				const id = decodeURIComponent(path.slice(6));
				const body = RulePatch.parse(await request.json());
				return json(store.updateRule(id, body));
			}
			return error("Unknown DPI endpoint", 404);
		} catch (err) {
			if (err instanceof ZodError) return error("Invalid rule payload", 400);
			return handleError(err);
		}
	},
	DELETE: async ({ request }) => {
		const store = getEngineStore();
		const path = dpiPath(request);
		try {
			if (path.startsWith("rules/")) {
				const id = decodeURIComponent(path.slice(6));
				store.deleteRule(id);
				return json({ ok: true });
			}
			return error("Unknown DPI endpoint", 404);
		} catch (err) {
			return handleError(err);
		}
	}
} } });
var DashRoute = Route$9.update({
	id: "/_dash",
	getParentRoute: () => Route$10
});
var DashIndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashRoute
});
var DashApplicationsRoute = Route$7.update({
	id: "/applications",
	path: "/applications",
	getParentRoute: () => DashRoute
});
var DashDomainsRoute = Route$6.update({
	id: "/domains",
	path: "/domains",
	getParentRoute: () => DashRoute
});
var DashFlowsRoute = Route$5.update({
	id: "/flows",
	path: "/flows",
	getParentRoute: () => DashRoute
});
var DashProcessingRoute = Route$4.update({
	id: "/processing",
	path: "/processing",
	getParentRoute: () => DashRoute
});
var DashRulesRoute = Route$3.update({
	id: "/rules",
	path: "/rules",
	getParentRoute: () => DashRoute
});
var DashSystemRoute = Route$2.update({
	id: "/system",
	path: "/system",
	getParentRoute: () => DashRoute
});
var DashTrafficRoute = Route$1.update({
	id: "/traffic",
	path: "/traffic",
	getParentRoute: () => DashRoute
});
var ApiDpiSplatRoute = Route.update({
	id: "/api/dpi/$",
	path: "/api/dpi/$",
	getParentRoute: () => Route$10
});
var DashRouteChildren = {
	DashApplicationsRoute,
	DashDomainsRoute,
	DashFlowsRoute,
	DashProcessingRoute,
	DashRulesRoute,
	DashSystemRoute,
	DashTrafficRoute,
	DashIndexRoute
};
var rootRouteChildren = {
	DashRoute: DashRoute._addFileChildren(DashRouteChildren),
	ApiDpiSplatRoute
};
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent,
		defaultNotFoundComponent: AppNotFoundComponent,
		defaultPreload: "intent",
		scrollRestoration: true
	});
}
//#endregion
export { useRules as $, ChartTooltipRow as A, formatInteger as B, EmptyState as C, PanelSkeleton as D, PageHeader as E, formatBytes as F, useDebouncedValue as G, formatRelative as H, formatClock as I, useDomains as J, useDeleteRule as K, formatCompact as L, DpiApiError as M, cn as N, Skeleton as O, formatBps as P, useReprocess as Q, formatDateTime as R, CardTitle as S, KpiSkeleton as T, useApplications as U, formatPercent as V, useCreateRule as W, useFlow as X, useEngineStatus as Y, useFlows as Z, RULE_TYPE_LABEL as _, Table as a, CardContent as b, Th as c, SessionStatusBadge as d, useSession as et, ThreadHealthBadge as f, Badge as g, useTheme as h, THead as i, Button as j, ChartTooltipFrame as k, EngineStatusBadge as l, AppDonut as m, Pagination as n, useThreads as nt, TableWrap as o, TrafficStatusBadge as p, useDomain as q, SortButton as r, useUpdateRule as rt, Td as s, router_exports as t, useStats as tt, LiveDot as u, appIcon as v, ErrorState as w, CardHeader as x, Card as y, formatDuration as z };
