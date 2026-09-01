import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { B as formatInteger, C as EmptyState, D as PanelSkeleton, E as PageHeader, F as formatBytes, G as useDebouncedValue, J as useDomains, R as formatDateTime, a as Table, b as CardContent, c as Th, g as Badge, i as THead, n as Pagination, o as TableWrap, p as TrafficStatusBadge, q as useDomain, r as SortButton, s as Td, w as ErrorState, y as Card } from "./router-b6nfBF91.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as Input } from "./select-CXUWZxpa.mjs";
import { a as SheetTitle, i as SheetHeader, n as SheetContent, r as SheetDescription, t as Sheet } from "./sheet-C_FcHZ8j.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/domains-vdsKD_y2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DomainsPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const debouncedQ = useDebouncedValue(q);
	const [status, setStatus] = (0, import_react.useState)("all");
	const [sort, setSort] = (0, import_react.useState)("packets");
	const [dir, setDir] = (0, import_react.useState)("desc");
	const [page, setPage] = (0, import_react.useState)(1);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const domains = useDomains({
		q: debouncedQ,
		status,
		sort,
		dir,
		page,
		pageSize: 12
	});
	const detail = useDomain(selected);
	function toggle(key) {
		if (sort === key) setDir((d) => d === "asc" ? "desc" : "asc");
		else {
			setSort(key);
			setDir(key === "domain" || key === "application" ? "asc" : "desc");
		}
		setPage(1);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Detected domains",
			description: "SNI and HTTP Host values extracted from TLS and HTTP traffic."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "pt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => {
						setQ(e.target.value);
						setPage(1);
					},
					placeholder: "Search domain or application",
					className: "max-w-xs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: status,
					onValueChange: (v) => {
						setStatus(v);
						setPage(1);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All statuses"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "allowed",
							children: "Allowed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "blocked",
							children: "Blocked"
						})
					] })]
				})]
			}), domains.isLoading && !domains.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelSkeleton, { rows: 8 }) : domains.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
				error: domains.error,
				onRetry: () => domains.refetch()
			}) : !domains.data?.items.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No domains detected",
				description: "No SNI or HTTP Host records match the current filters."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableWrap, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(THead, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortButton, {
					label: "Domain",
					active: sort === "domain",
					dir,
					onClick: () => toggle("domain")
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortButton, {
					label: "Application",
					active: sort === "application",
					dir,
					onClick: () => toggle("application")
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortButton, {
					label: "Packets",
					active: sort === "packets",
					dir,
					onClick: () => toggle("packets")
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Source" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Status" })
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: domains.data.items.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "cursor-pointer hover:bg-elevated/60",
				onClick: () => setSelected(row.id),
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: row.source === "both" ? "SNI + Host" : row.source === "sni" ? "TLS SNI" : "HTTP Host"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrafficStatusBadge, { status: row.status }) })
				]
			}, row.id)) })] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
				page: domains.data.page,
				pageSize: domains.data.pageSize,
				total: domains.data.total,
				onPage: setPage
			})] })]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
			open: Boolean(selected),
			onOpenChange: (open) => !open && setSelected(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: detail.data?.domain ?? "Domain" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, { children: "Extracted by the DPI engine from TLS SNI or HTTP Host." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-auto px-5 py-4",
				children: detail.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelSkeleton, { rows: 6 }) : detail.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
					error: detail.error,
					onRetry: () => detail.refetch()
				}) : detail.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid grid-cols-2 gap-x-4 gap-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							label: "Application",
							value: detail.data.application
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							label: "Status",
							value: detail.data.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							label: "Packets",
							value: formatInteger(detail.data.packets),
							mono: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							label: "Bytes",
							value: formatBytes(detail.data.bytes),
							mono: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							label: "Flows",
							value: formatInteger(detail.data.flows),
							mono: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							label: "Source",
							value: detail.data.source
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							label: "First seen",
							value: formatDateTime(detail.data.firstSeen)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							label: "Last seen",
							value: formatDateTime(detail.data.lastSeen)
						})
					]
				}) : null
			})] })
		})
	] });
}
function Meta({ label, value, mono }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: mono ? "font-mono text-xs tabular-nums" : "",
		children: value
	})] });
}
//#endregion
export { DomainsPage as component };
