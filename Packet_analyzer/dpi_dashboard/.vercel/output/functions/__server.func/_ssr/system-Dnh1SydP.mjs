import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { L as ArrowDown } from "../_libs/lucide-react.mjs";
import { B as formatInteger, C as EmptyState, D as PanelSkeleton, E as PageHeader, L as formatCompact, N as cn, S as CardTitle, V as formatPercent, b as CardContent, f as ThreadHealthBadge, nt as useThreads, w as ErrorState, x as CardHeader, y as Card } from "./router-b6nfBF91.mjs";
import { t as Progress } from "./progress-CNiPrK1c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/system-Dnh1SydP.js
var import_jsx_runtime = require_jsx_runtime();
function SystemPage() {
	const threads = useThreads();
	const byId = new Map((threads.data ?? []).map((t) => [t.id, t]));
	const reader = byId.get("reader");
	const lbs = [byId.get("lb-0"), byId.get("lb-1")].filter(Boolean);
	const fps = [
		"fp-0",
		"fp-1",
		"fp-2",
		"fp-3"
	].map((id) => byId.get(id)).filter(Boolean);
	const writer = byId.get("writer");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "System performance",
		description: "Reader, load-balancer, fast-path, and writer threads as reported by the engine."
	}), threads.isLoading && !threads.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelSkeleton, { rows: 8 }) : threads.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		error: threads.error,
		onRetry: () => threads.refetch()
	}) }) : !threads.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "No thread statistics",
		description: "The engine has not published LB/FP telemetry for this session."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-3",
		children: [
			reader ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThreadCard, {
				thread: reader,
				className: "w-full max-w-md"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, {
				className: "size-4 text-muted-foreground",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid w-full gap-3 md:grid-cols-2",
				children: lbs.map((lb) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThreadCard, {
							thread: lb,
							className: "w-full"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, {
							className: "size-4 text-muted-foreground",
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid w-full grid-cols-2 gap-3",
							children: fps.filter((fp) => fp.parentId === lb.id).map((fp) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThreadCard, { thread: fp }, fp.id))
						})
					]
				}, lb.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, {
				className: "size-4 text-muted-foreground",
				"aria-hidden": true
			}),
			writer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThreadCard, {
				thread: writer,
				className: "w-full max-w-md"
			}) : null
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mt-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Thread table" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[40rem] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Thread"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Role"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Packets"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Rate"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Utilization"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Queue"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Status"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: threads.data.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 font-medium",
							children: t.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-muted-foreground",
							children: roleLabel(t.role)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 font-mono text-xs tabular-nums",
							children: formatInteger(t.packets)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 font-mono text-xs tabular-nums",
							children: t.rate != null ? `${formatCompact(t.rate)} pkt/s` : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 font-mono text-xs tabular-nums",
							children: formatPercent(t.utilization, 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 font-mono text-xs tabular-nums",
							children: t.queueDepth != null && t.queueCapacity != null ? `${t.queueDepth}/${t.queueCapacity}` : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThreadHealthBadge, { status: t.status })
						})
					]
				}, t.id)) })]
			})
		}) })]
	})] })] });
}
function roleLabel(role) {
	if (role === "load_balancer") return "Load balancer";
	if (role === "fast_path") return "Fast path";
	if (role === "reader") return "Reader";
	return "Writer";
}
function ThreadCard({ thread, className }) {
	const queuePct = thread.queueDepth != null && thread.queueCapacity ? thread.queueDepth / thread.queueCapacity * 100 : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: cn(thread.status === "warning" && "border-warning/40", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: thread.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: roleLabel(thread.role)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThreadHealthBadge, { status: thread.status })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-3 grid grid-cols-2 gap-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted-foreground",
						children: "Packets"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-mono tabular-nums",
						children: formatInteger(thread.packets)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted-foreground",
						children: "Rate"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-mono tabular-nums",
						children: thread.rate != null ? `${formatCompact(thread.rate)} pkt/s` : "—"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex justify-between text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Utilization" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono tabular-nums",
							children: formatPercent(thread.utilization, 0)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: thread.utilization })]
				}),
				queuePct != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex justify-between text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Queue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono tabular-nums",
							children: [
								thread.queueDepth,
								"/",
								thread.queueCapacity
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
						value: queuePct,
						className: queuePct >= 70 ? "[&>div]:bg-warning" : void 0
					})]
				}) : null
			]
		})
	});
}
//#endregion
export { SystemPage as component };
