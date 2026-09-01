import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { f as Play } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as formatInteger, E as PageHeader, F as formatBytes, Q as useReprocess, R as formatDateTime, S as CardTitle, T as KpiSkeleton, V as formatPercent, b as CardContent, d as SessionStatusBadge, et as useSession, j as Button, w as ErrorState, x as CardHeader, y as Card, z as formatDuration } from "./router-b6nfBF91.mjs";
import { t as Progress } from "./progress-CNiPrK1c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/processing-DtjBuClv.js
var import_jsx_runtime = require_jsx_runtime();
function ProcessingPage() {
	const session = useSession();
	const reprocess = useReprocess();
	const data = session.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Processing session",
		description: "Current PCAP inspection run: input, output, duration, and engine-reported totals.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			disabled: reprocess.isPending || data?.status === "processing",
			onClick: () => reprocess.mutate(void 0, {
				onSuccess: () => toast("Reprocess started"),
				onError: (err) => toast.error(err instanceof Error ? err.message : "Unable to start")
			}),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" }), "Reprocess capture"]
		})
	}), session.isLoading && !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
		children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiSkeleton, {}, i))
	}) : session.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		error: session.error,
		onRetry: () => session.refetch()
	}) }) : data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { children: ["Session ", data.id] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionStatusBadge, { status: data.status })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
					label: "Input PCAP",
					value: data.inputPcap,
					mono: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
					label: "Output PCAP",
					value: data.outputPcap ?? "—",
					mono: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
					label: "Started",
					value: formatDateTime(data.startTime)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
					label: "Ended",
					value: formatDateTime(data.endTime)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
					label: "Duration",
					value: formatDuration(data.durationMs)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
					label: "Active rules",
					value: formatInteger(data.activeRules)
				})
			]
		}), data.progress != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: data.status === "processing" ? "Processing capture" : "Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono tabular-nums",
					children: formatPercent(data.progress, 0)
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: data.progress })]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted-foreground",
			children: "No processing session is currently loaded."
		})] })]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Total packets",
				value: formatInteger(data.totalPackets)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Total bytes",
				value: formatBytes(data.totalBytes)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Forwarded",
				value: formatInteger(data.forwardedPackets)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Dropped",
				value: formatInteger(data.droppedPackets)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Flows",
				value: formatInteger(data.flows)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Applications",
				value: formatInteger(data.applications)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Detected domains",
				value: formatInteger(data.domains)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Active rules",
				value: formatInteger(data.activeRules)
			})
		]
	})] }) : null] });
}
function Meta({ label, value, mono }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: `mt-1 ${mono ? "font-mono text-xs" : "text-sm"}`,
		children: value
	})] });
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-mono text-lg tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { ProcessingPage as component };
