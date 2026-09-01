import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQueryClient } from "./_libs/tanstack__react-query.mjs";
import { E as Cpu, R as AppWindow, S as Globe, T as FileSearch, _ as Menu, a as ShieldBan, b as LayoutDashboard, g as Moon, i as Sun, l as RefreshCw, t as X, w as GitBranch, z as Activity } from "./_libs/lucide-react.mjs";
import { _ as Link, p as Outlet } from "./_libs/@tanstack/react-router+[...].mjs";
import { H as formatRelative, N as cn, Y as useEngineStatus, h as useTheme, j as Button, l as EngineStatusBadge, u as LiveDot } from "./_ssr/router-b6nfBF91.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_dash-BM4DlaVb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Header({ onMenu }) {
	const status = useEngineStatus();
	const queryClient = useQueryClient();
	const { theme, toggle } = useTheme();
	const [now, setNow] = (0, import_react.useState)(Date.now());
	(0, import_react.useEffect)(() => {
		const t = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => window.clearInterval(t);
	}, []);
	const engine = status.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex min-h-12 items-center gap-3 border-b border-border bg-card px-3 py-2 md:px-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				className: "size-11 md:size-9 md:hidden",
				onClick: onMenu,
				"aria-label": "Open menu",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-x-3 gap-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-sm font-semibold tracking-wide",
						children: "DPI Engine"
					}), engine ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDot, { active: engine.status === "online" || engine.status === "processing" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EngineStatusBadge, { status: engine.status })]
					}) : status.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EngineStatusBadge, { status: "error" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Connecting…"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "truncate text-[0.6875rem] text-muted-foreground",
					children: [
						engine?.capture ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Capture ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-foreground/80",
							children: engine.capture
						})] }) : "No active capture",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-2 text-border",
							children: "·"
						}),
						"Updated ",
						engine ? formatRelative(engine.lastUpdated, now) : "—"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					className: "h-11 md:h-8",
					onClick: () => queryClient.invalidateQueries({ queryKey: ["dpi"] }),
					disabled: status.isFetching,
					"aria-label": "Refresh",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: status.isFetching ? "animate-spin" : void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "Refresh"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					className: "size-11 md:size-9",
					onClick: toggle,
					"aria-label": "Toggle theme",
					children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" })
				})]
			})
		]
	});
}
var NAV = [
	{
		to: "/",
		label: "Overview",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/traffic",
		label: "Traffic",
		icon: Activity,
		exact: false
	},
	{
		to: "/flows",
		label: "Flows",
		icon: GitBranch,
		exact: false
	},
	{
		to: "/applications",
		label: "Applications",
		icon: AppWindow,
		exact: false
	},
	{
		to: "/domains",
		label: "Domains",
		icon: Globe,
		exact: false
	},
	{
		to: "/rules",
		label: "Rules",
		icon: ShieldBan,
		exact: false
	},
	{
		to: "/processing",
		label: "Processing",
		icon: FileSearch,
		exact: false
	},
	{
		to: "/system",
		label: "System",
		icon: Cpu,
		exact: false
	}
];
function Brand({ onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: "flex min-w-0 items-center gap-2",
		onClick,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-7 items-center justify-center rounded-md border border-border bg-elevated",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-brand" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block truncate text-xs font-semibold tracking-widest text-muted-foreground",
				children: "DPI ENGINE"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-xs text-muted-foreground/80",
				children: "Inspection console"
			})]
		})]
	});
}
function NavLinks({ onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-1 flex-col gap-0.5 p-2",
		children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: item.to,
			onClick,
			activeOptions: { exact: item.exact },
			className: "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-elevated hover:text-foreground data-[status=active]:bg-elevated data-[status=active]:text-foreground data-[status=active]:shadow-[inset_2px_0_0_0_var(--color-brand)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4 shrink-0" }), item.label]
		}, item.to))
	});
}
function Sidebar({ mobileOpen, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden w-56 shrink-0 flex-col border-r border-border bg-card md:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-12 items-center border-b border-border px-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "border-t border-border px-4 py-3 text-xs text-muted-foreground",
					children: "PCAP in · filtered PCAP out"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("fixed inset-0 z-40 bg-background/70 md:hidden transition-opacity duration-200", mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"),
			onClick: onClose,
			"aria-hidden": !mobileOpen
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: cn("fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r border-border bg-card md:hidden", "transition-transform duration-300 ease-out", mobileOpen ? "translate-x-0" : "-translate-x-full"),
			"aria-hidden": !mobileOpen,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-12 items-center justify-between gap-2 border-b border-border px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, { onClick: onClose }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					className: "size-8",
					onClick: onClose,
					"aria-label": "Close menu",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, { onClick: onClose })]
		})
	] });
}
function AppShell({ children }) {
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-svh bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {
			mobileOpen,
			onClose: () => setMobileOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, { onMenu: () => setMobileOpen(true) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 overflow-auto p-4 pb-16 md:p-6 md:pb-16",
				children
			})]
		})]
	});
}
function DashboardLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
//#endregion
export { DashboardLayout as component };
