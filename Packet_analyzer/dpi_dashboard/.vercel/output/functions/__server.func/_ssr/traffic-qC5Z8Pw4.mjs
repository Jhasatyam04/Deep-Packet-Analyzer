import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { B as formatInteger, E as PageHeader, F as formatBytes, L as formatCompact, P as formatBps, S as CardTitle, V as formatPercent, b as CardContent, tt as useStats, x as CardHeader, y as Card } from "./router-b6nfBF91.mjs";
import { t as TrafficChart } from "./traffic-chart-cqImgfJK.mjs";
import { n as TabsList, r as TabsTrigger, t as Tabs } from "./tabs-BDGJeLx7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/traffic-qC5Z8Pw4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TrafficPage() {
	const stats = useStats();
	const [mode, setMode] = (0, import_react.useState)("packets");
	const overview = stats.data?.overview;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Traffic",
			description: "Packets and bytes processed by the engine over the current session."
		}),
		overview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid gap-3 sm:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					label: "Packets",
					value: formatInteger(overview.totalPackets),
					hint: `${formatCompact(overview.packetsPerSec ?? 0)} pkt/s`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					label: "Bytes",
					value: formatBytes(overview.totalBytes),
					hint: formatBps(overview.throughputBps ?? 0)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					label: "Forwarded",
					value: formatPercent(overview.forwardedPercent, 0),
					hint: formatInteger(overview.forwardedPackets)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					label: "Dropped",
					value: formatPercent(overview.droppedPercent, 0),
					hint: formatInteger(overview.droppedPackets)
				})
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Session series" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
			value: mode,
			onValueChange: (v) => setMode(v),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "packets",
					children: "Packets"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "bytes",
					children: "Bytes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "disposition",
					children: "Forwarded / dropped"
				})
			] })
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrafficChart, {
			data: stats.data?.timeseries,
			mode,
			isLoading: stats.isLoading,
			error: stats.error,
			onRetry: () => stats.refetch()
		}) })] })
	] });
}
function MiniStat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card px-4 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-mono text-lg tabular-nums",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
//#endregion
export { TrafficPage as component };
