import { t as APP_VERSION } from "./version-xfSkRsx-.mjs";
import { a as require_jsx_runtime, i as useQueryClient } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useCurrentUser, r as cn } from "./logo-CvL_n660.mjs";
import { a as formatMoney } from "./format-D6213dDq.mjs";
import { p as ChevronRight } from "../_libs/lucide-react.mjs";
import { f as setCurrency, n as UserButton, t as AppShell } from "./server-DnAn995v.mjs";
import { a as useOverview, r as useBreakdown, t as moneyKey } from "./hooks-CCa1Rf6w.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/more-BHLQ8g_w.js
var import_jsx_runtime = require_jsx_runtime();
var CURRENCIES = [
	"BDT",
	"USD",
	"EUR",
	"GBP",
	"INR"
];
function MorePage() {
	const user = useCurrentUser();
	const { data } = useOverview();
	const { data: bars } = useBreakdown();
	const qc = useQueryClient();
	const max = Math.max(1, ...(bars ?? []).map((b) => b.total));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold tracking-tight",
				children: "More"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-3xl bg-card px-4 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: user?.displayName ?? "You"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: user?.primaryEmail ?? "Private ledger"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "This month"
				}), !bars || bars.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted",
					children: "Spend a little and a breakdown will appear."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-3",
					children: bars.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums text-muted",
							children: formatMoney(row.total, data?.currency ?? "BDT")
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1.5 h-1.5 overflow-hidden rounded-full bg-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-primary",
							style: { width: `${Math.round(row.total / max * 100)}%` }
						})
					})] }, row.name))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Currency"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: CURRENCIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: async () => {
							await setCurrency({ data: { currency: c } });
							await qc.invalidateQueries({ queryKey: moneyKey.overview });
						},
						className: cn("h-9 rounded-full px-3 text-xs font-medium", data?.currency === c ? "bg-foreground text-background" : "bg-card text-muted"),
						children: c
					}, c))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 overflow-hidden rounded-3xl bg-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/about",
						className: "flex items-center justify-between px-4 py-4 text-sm",
						children: ["About and developer", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-muted" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Install on your phone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-relaxed text-muted",
							children: "iPhone: tap Share, then Add to Home Screen. Android: Chrome menu, then Add to Home screen. Opens full-screen like a native wallet."
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-center text-[11px] text-subtle",
				children: ["Version ", APP_VERSION]
			})
		]
	}) });
}
//#endregion
export { MorePage as component };
