import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as ChevronDown, j as Check } from "../_libs/lucide-react.mjs";
import { a as SelectItemIndicator, c as SelectTrigger$1, i as SelectItem$1, l as SelectValue$1, n as SelectContent$1, o as SelectItemText, r as SelectIcon, s as SelectPortal, t as Select$1, u as SelectViewport } from "../_libs/@radix-ui/react-select+[...].mjs";
import { N as cn } from "./router-b6nfBF91.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/select-CXUWZxpa.js
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-150", "focus-visible:border-primary focus-visible:outline-none", "disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
var Select = Select$1;
var SelectValue = SelectValue$1;
function SelectTrigger({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
		className: cn("flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-sm", "data-placeholder:text-muted-foreground", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 text-muted-foreground" }) })]
	});
}
function SelectContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent$1, {
		className: cn("z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-border bg-popover shadow-sm", className),
		position: "popper",
		sideOffset: 4,
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: "p-1",
			children
		})
	}) });
}
function SelectItem({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
		className: cn("relative flex cursor-pointer items-center rounded-sm py-1.5 pl-8 pr-3 text-sm outline-none", "focus:bg-elevated data-[state=checked]:text-foreground", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, {
			className: "absolute left-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
	});
}
//#endregion
export { SelectTrigger as a, SelectItem as i, Select as n, SelectValue as o, SelectContent as r, Input as t };
