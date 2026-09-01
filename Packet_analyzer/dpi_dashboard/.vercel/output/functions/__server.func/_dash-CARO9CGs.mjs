import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-collection+[...].mjs";
import { I as ArrowRight, M as Boxes, N as Ban, m as Package, u as Radio, w as GitBranch } from "./_libs/lucide-react.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { B as formatInteger, C as EmptyState, D as PanelSkeleton, E as PageHeader, F as formatBytes, J as useDomains, L as formatCompact, N as cn, P as formatBps, S as CardTitle, T as KpiSkeleton, U as useApplications, V as formatPercent, a as Table, b as CardContent, c as Th, i as THead, j as Button, m as AppDonut, o as TableWrap, p as TrafficStatusBadge, s as Td, tt as useStats, v as appIcon, w as ErrorState, x as CardHeader, y as Card } from "./_ssr/router-b6nfBF91.mjs";
import { t as TrafficChart } from "./_ssr/traffic-chart-cqImgfJK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_dash-CARO9CGs.js
var import_jsx_runtime = require_jsx_runtime();
function KpiCard({ label, value, hint, icon: Icon, tone = "default" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: cn("size-4", tone === "success" && "text-success", tone === "danger" && "text-danger", tone === "info" && "text-info", tone === "default" && "text-muted-foreground"),
					"aria-hidden": true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-mono text-xl font-medium tabular-nums tracking-tight",
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			}) : null
		]
	});
}
function OverviewPage() {
	const stats = useStats();
	const apps = useApplications();
	const domains = useDomains({
		page: 1,
		pageSize: 6,
		sort: "packets",
		dir: "desc"
	});
	const overview = stats.data?.overview;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Overview",
			description: "Live view of packets, classification, and blocking from the DPI engine."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6",
			children: stats.isLoading && !overview ? Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiSkeleton, {}, i)) : stats.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sm:col-span-2 xl:col-span-3 2xl:col-span-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
					error: stats.error,
					onRetry: () => stats.refetch()
				}) })
			}) : overview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Total packets",
					value: formatInteger(overview.totalPackets),
					hint: overview.packetsPerSec != null ? `${formatCompact(overview.packetsPerSec)} pkt/s` : void 0,
					icon: Package
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Total bytes",
					value: formatBytes(overview.totalBytes),
					hint: overview.throughputBps != null ? formatBps(overview.throughputBps) : void 0,
					icon: Radio,
					tone: "info"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Forwarded",
					value: formatInteger(overview.forwardedPackets),
					hint: formatPercent(overview.forwardedPercent),
					icon: ArrowRight,
					tone: "success"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Dropped",
					value: formatInteger(overview.droppedPackets),
					hint: formatPercent(overview.droppedPercent),
					icon: Ban,
					tone: "danger"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Active flows",
					value: formatInteger(overview.activeFlows),
					hint: "Five-tuple tracked",
					icon: GitBranch
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Applications",
					value: formatInteger(overview.detectedApplications),
					hint: `${formatInteger(overview.detectedDomains)} domains`,
					icon: Boxes,
					tone: "info"
				})
			] }) : null
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-5 grid gap-4 xl:grid-cols-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "xl:col-span-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Traffic" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/traffic",
						children: ["Open traffic", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrafficChart, {
					data: stats.data?.timeseries,
					mode: "disposition",
					isLoading: stats.isLoading,
					error: stats.error,
					onRetry: () => stats.refetch()
				}) })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "xl:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Applications" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/applications",
						children: ["All apps", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppDonut, {
					data: apps.data,
					isLoading: apps.isLoading,
					error: apps.error,
					onRetry: () => apps.refetch()
				}) })]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-5 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Application mix" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: apps.isLoading && !apps.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelSkeleton, {}) : apps.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
				error: apps.error,
				onRetry: () => apps.refetch()
			}) : !apps.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No applications detected",
				description: "Classification results will appear once the engine processes traffic."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableWrap, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
				className: "min-w-[32rem]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(THead, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Application" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Packets" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Share" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Status" })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: apps.data.slice(0, 8).map((row) => {
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
								children: formatPercent(row.percent)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrafficStatusBadge, { status: row.status }) })
						]
					}, row.name);
				}) })]
			}) }) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Detected domains" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "sm",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/domains",
					children: ["All domains", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: domains.isLoading && !domains.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelSkeleton, {}) : domains.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
				error: domains.error,
				onRetry: () => domains.refetch()
			}) : !domains.data?.items.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No domains detected",
				description: "SNI and HTTP Host values extracted by the engine will appear here."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableWrap, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
				className: "min-w-[32rem]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(THead, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Domain" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "App" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Packets" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Status" })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: domains.data.items.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "hover:bg-elevated/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							mono: true,
							children: row.domain
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: row.application }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							mono: true,
							children: formatInteger(row.packets)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrafficStatusBadge, { status: row.status }) })
					]
				}, row.id)) })]
			}) }) })] })]
		})
	] });
}
//#endregion
export { OverviewPage as component };
