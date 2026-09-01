import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Area, i as XAxis, l as ResponsiveContainer, o as CartesianGrid, r as YAxis, t as AreaChart, u as Tooltip } from "../_libs/recharts+[...].mjs";
import { A as ChartTooltipRow, B as formatInteger, C as EmptyState, F as formatBytes, I as formatClock, O as Skeleton, k as ChartTooltipFrame, w as ErrorState } from "./router-b6nfBF91.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/traffic-chart-cqImgfJK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TrafficChart({ data, mode, isLoading, error, onRetry }) {
	const rows = (0, import_react.useMemo)(() => (data ?? []).map((p) => ({
		...p,
		label: formatClock(p.ts)
	})), [data]);
	if (isLoading && !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-72 w-full" });
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		error,
		onRetry
	});
	if (!rows.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "No traffic series",
		description: "The engine has not published time-series statistics for this session."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-72 w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data: rows,
				margin: {
					top: 8,
					right: 8,
					left: 0,
					bottom: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { vertical: false }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "label",
						tick: { fontSize: 11 },
						tickLine: false,
						axisLine: false,
						minTickGap: 28
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						tick: { fontSize: 11 },
						tickLine: false,
						axisLine: false,
						width: 56,
						tickFormatter: (v) => mode === "bytes" ? formatBytes(v) : formatInteger(v)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload, label }) => {
						if (!active || !payload?.length) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipFrame, {
							label: String(label),
							children: payload.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipRow, {
								color: String(item.color),
								name: String(item.name),
								value: mode === "bytes" ? formatBytes(Number(item.value ?? 0)) : formatInteger(Number(item.value ?? 0))
							}, String(item.dataKey)))
						});
					} }),
					mode === "disposition" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "forwarded",
						name: "Forwarded",
						stroke: "var(--color-success)",
						fill: "var(--color-success)",
						fillOpacity: .18,
						strokeWidth: 1.5
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "dropped",
						name: "Dropped",
						stroke: "var(--color-danger)",
						fill: "var(--color-danger)",
						fillOpacity: .18,
						strokeWidth: 1.5
					})] }) : mode === "bytes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "bytes",
						name: "Bytes",
						stroke: "var(--color-brand)",
						fill: "var(--color-brand)",
						fillOpacity: .16,
						strokeWidth: 1.5
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "packets",
						name: "Packets",
						stroke: "var(--color-brand)",
						fill: "var(--color-brand)",
						fillOpacity: .16,
						strokeWidth: 1.5
					})
				]
			})
		})
	});
}
//#endregion
export { TrafficChart as t };
