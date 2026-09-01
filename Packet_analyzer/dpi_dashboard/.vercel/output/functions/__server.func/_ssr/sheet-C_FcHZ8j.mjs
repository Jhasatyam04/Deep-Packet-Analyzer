import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as X } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { N as cn } from "./router-b6nfBF91.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sheet-C_FcHZ8j.js
var import_jsx_runtime = require_jsx_runtime();
var Sheet = Dialog;
function SheetContent({ className, children, side = "right", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-background/70 transition-opacity duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: cn("fixed z-50 flex h-full w-[min(100%,28rem)] flex-col border-border bg-card shadow-sm transition-transform duration-300 ease-out", side === "right" ? "right-0 top-0 border-l" : "left-0 top-0 border-r", className),
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
function SheetHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("border-b border-border px-5 py-4 pr-12", className),
		...props
	});
}
function SheetTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
		className: cn("text-base font-semibold", className),
		...props
	});
}
function SheetDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
//#endregion
export { SheetTitle as a, SheetHeader as i, SheetContent as n, SheetDescription as r, Sheet as t };
