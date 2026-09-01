import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { N as cn } from "./router-b6nfBF91.mjs";
import { n as Root2, r as Trigger, t as List } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tabs-BDGJeLx7.js
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("inline-flex h-9 items-center gap-1 rounded-md border border-border bg-elevated p-0.5", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		className: cn("inline-flex items-center rounded-sm px-3 py-1 text-xs font-medium text-muted-foreground transition-colors duration-150", "data-[state=active]:bg-background data-[state=active]:text-foreground", className),
		...props
	});
}
//#endregion
export { TabsList as n, TabsTrigger as r, Tabs as t };
