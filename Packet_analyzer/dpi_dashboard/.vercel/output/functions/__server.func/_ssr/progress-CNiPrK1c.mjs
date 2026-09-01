import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { N as cn } from "./router-b6nfBF91.mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/progress-CNiPrK1c.js
var import_jsx_runtime = require_jsx_runtime();
function Progress({ className, value, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		className: cn("relative h-1.5 w-full overflow-hidden rounded-full bg-elevated", className),
		value,
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
			className: "h-full bg-primary transition-[transform] duration-300 ease-out",
			style: { transform: `translateX(-${100 - (value ?? 0)}%)` }
		})
	});
}
//#endregion
export { Progress as t };
