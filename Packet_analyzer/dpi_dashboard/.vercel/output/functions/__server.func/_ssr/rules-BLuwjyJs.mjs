import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as Plus, p as Pencil, r as Trash2, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogOverlay, i as DialogDescription$1, n as DialogClose, o as DialogPortal, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { $ as useRules, B as formatInteger, C as EmptyState, D as PanelSkeleton, E as PageHeader, K as useDeleteRule, M as DpiApiError, N as cn, R as formatDateTime, W as useCreateRule, _ as RULE_TYPE_LABEL, a as Table, b as CardContent, c as Th, g as Badge, i as THead, j as Button, o as TableWrap, rt as useUpdateRule, s as Td, w as ErrorState, y as Card } from "./router-b6nfBF91.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as Input } from "./select-CXUWZxpa.mjs";
import { n as TabsList, r as TabsTrigger, t as Tabs } from "./tabs-BDGJeLx7.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rules-BLuwjyJs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-background/70 data-[state=open]:opacity-100 data-[state=closed]:opacity-0 transition-opacity duration-200" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed left-1/2 top-1/2 z-50 w-[min(100%-2rem,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-5 shadow-sm", "data-[state=open]:opacity-100 data-[state=closed]:opacity-0 transition-opacity duration-200", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute right-3 top-3 rounded-sm p-1 text-muted-foreground hover:bg-elevated hover:text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mb-4 space-y-1", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("text-base font-semibold", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		className: cn("text-xs font-medium text-muted-foreground", className),
		...props
	});
}
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-border transition-colors duration-150", "data-[state=checked]:bg-primary data-[state=unchecked]:bg-elevated", "disabled:cursor-not-allowed disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-4 rounded-full bg-foreground shadow-sm transition-transform duration-150 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5 data-[state=checked]:bg-primary-foreground" })
	});
}
function RulesPage() {
	const [tab, setTab] = (0, import_react.useState)("all");
	const rules = useRules(tab);
	const createRule = useCreateRule();
	const updateRule = useUpdateRule();
	const deleteRule = useDeleteRule();
	const [editor, setEditor] = (0, import_react.useState)(null);
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Blocking rules",
			description: "IP, application, and domain rules evaluated by the engine. The dashboard only submits changes — the engine remains the source of truth.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => setEditor({ mode: "create" }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add rule"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "pt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
				value: tab,
				onValueChange: (v) => setTab(v),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "all",
						children: "All"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "ip",
						children: "IP"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "application",
						children: "Application"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "domain",
						children: "Domain"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: rules.isLoading && !rules.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelSkeleton, { rows: 6 }) : rules.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
					error: rules.error,
					onRetry: () => rules.refetch()
				}) : !rules.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No rules",
					description: "There are no blocking rules in this filter. Add an IP, application, or domain rule to drop matching traffic."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableWrap, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(THead, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Type" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Value" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Traffic affected" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Updated" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, {})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rules.data.map((rule) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "hover:bg-elevated/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: RULE_TYPE_LABEL[rule.type]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							mono: true,
							children: rule.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: rule.enabled,
								disabled: updateRule.isPending,
								onCheckedChange: (enabled) => {
									updateRule.mutate({
										id: rule.id,
										patch: { enabled }
									}, {
										onSuccess: () => toast(enabled ? "Rule enabled" : "Rule disabled"),
										onError: (err) => toast.error(err instanceof Error ? err.message : "Update failed")
									});
								},
								"aria-label": `Toggle ${rule.value}`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: rule.enabled ? "Enabled" : "Disabled"
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							mono: true,
							children: formatInteger(rule.packetsAffected)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-xs text-muted-foreground",
							children: formatDateTime(rule.updatedAt)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "size-8",
								onClick: () => setEditor({
									mode: "edit",
									rule
								}),
								"aria-label": "Edit rule",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "size-8",
								onClick: () => setPendingDelete(rule),
								"aria-label": "Delete rule",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5 text-danger" })
							})]
						}) })
					]
				}, rule.id)) })] }) })
			})]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleEditor, {
			open: Boolean(editor),
			initial: editor?.mode === "edit" ? editor.rule : null,
			pending: createRule.isPending || updateRule.isPending,
			onOpenChange: (open) => !open && setEditor(null),
			onSubmit: (input) => {
				if (editor?.mode === "edit") updateRule.mutate({
					id: editor.rule.id,
					patch: input
				}, {
					onSuccess: () => {
						toast("Rule updated");
						setEditor(null);
					},
					onError: (err) => toast.error(messageOf(err))
				});
				else createRule.mutate(input, {
					onSuccess: () => {
						toast("Rule created");
						setEditor(null);
					},
					onError: (err) => toast.error(messageOf(err))
				});
			}
		}, editor ? editor.mode === "edit" ? editor.rule.id : "create" : "closed"),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: Boolean(pendingDelete),
			onOpenChange: (open) => !open && setPendingDelete(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Delete rule" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
				"Remove ",
				pendingDelete ? `${RULE_TYPE_LABEL[pendingDelete.type]} ${pendingDelete.value}` : "this rule",
				"? The engine will stop matching it on the next evaluation."
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setPendingDelete(null),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "destructive",
					disabled: deleteRule.isPending,
					onClick: () => {
						if (!pendingDelete) return;
						deleteRule.mutate(pendingDelete.id, {
							onSuccess: () => {
								toast("Rule deleted");
								setPendingDelete(null);
							},
							onError: (err) => toast.error(messageOf(err))
						});
					},
					children: "Delete"
				})]
			})] })
		})
	] });
}
function messageOf(err) {
	if (err instanceof DpiApiError) return err.message;
	if (err instanceof Error) return err.message;
	return "Request failed";
}
function RuleEditor({ open, initial, pending, onOpenChange, onSubmit }) {
	const [type, setType] = (0, import_react.useState)(initial?.type ?? "domain");
	const [value, setValue] = (0, import_react.useState)(initial?.value ?? "");
	const [enabled, setEnabled] = (0, import_react.useState)(initial?.enabled ?? true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (next) => {
			onOpenChange(next);
			if (next) {
				setType(initial?.type ?? "domain");
				setValue(initial?.value ?? "");
				setEnabled(initial?.enabled ?? true);
			}
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: initial ? "Edit rule" : "Add rule" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Rules are stored and enforced by the DPI engine, not the dashboard." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-4",
			onSubmit: (e) => {
				e.preventDefault();
				onSubmit({
					type,
					value: value.trim(),
					enabled
				});
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "rule-type",
						children: "Type"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: type,
						onValueChange: (v) => setType(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							id: "rule-type",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "ip",
								children: "IP"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "application",
								children: "Application"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "domain",
								children: "Domain"
							})
						] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "rule-value",
						children: "Value"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "rule-value",
						value,
						onChange: (e) => setValue(e.target.value),
						placeholder: {
							ip: "203.0.113.77",
							application: "YouTube",
							domain: "tiktok"
						}[type],
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between rounded-md border border-border px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "rule-enabled",
						children: "Enabled"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						id: "rule-enabled",
						checked: enabled,
						onCheckedChange: setEnabled
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => onOpenChange(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: pending || !value.trim(),
						children: initial ? "Save" : "Create"
					})]
				})
			]
		})] })
	});
}
//#endregion
export { RulesPage as component };
