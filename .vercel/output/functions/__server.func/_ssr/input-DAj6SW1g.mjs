import "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { r as cn } from "./logo-CvL_n660.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-12 w-full rounded-xl bg-card px-4 text-sm text-foreground outline-none hairline placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-primary/50", className),
		...props
	});
}
//#endregion
export { Input as t };
