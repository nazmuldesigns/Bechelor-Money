import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { r as cn } from "./logo-CvL_n660.mjs";
import { i as formatDateLabel } from "./format-D6213dDq.mjs";
import { t as AppShell } from "./server-DnAn995v.mjs";
import { t as TxnRow } from "./txn-row-B7bro2G0.mjs";
import { a as useOverview, i as useMoneyMutations, n as useActivity } from "./hooks-CCa1Rf6w.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/activity-B6sGlVuC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FILTERS = [
	"all",
	"in",
	"out",
	"people"
];
function Activity() {
	const { data: overview } = useOverview();
	const { data, isPending } = useActivity();
	const { removeTxn } = useMoneyMutations();
	const [filter, setFilter] = (0, import_react.useState)("all");
	const currency = overview?.currency ?? "BDT";
	const filtered = (0, import_react.useMemo)(() => {
		const rows = data ?? [];
		if (filter === "in") return rows.filter((t) => t.kind === "income");
		if (filter === "out") return rows.filter((t) => t.kind === "expense");
		if (filter === "people") return rows.filter((t) => t.source !== "plain");
		return rows;
	}, [data, filter]);
	const groups = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const row of filtered) {
			const list = map.get(row.occurredOn) ?? [];
			list.push(row);
			map.set(row.occurredOn, list);
		}
		return [...map.entries()];
	}, [filtered]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold tracking-tight",
				children: "Activity"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Every move, newest first."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex gap-2 overflow-x-auto",
				children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setFilter(f),
					className: cn("h-9 shrink-0 rounded-full px-4 text-xs font-medium capitalize", filter === f ? "bg-foreground text-background" : "bg-card text-muted"),
					children: f
				}, f))
			}),
			isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 animate-pulse rounded-2xl bg-card" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 animate-pulse rounded-2xl bg-card" })]
			}) : groups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-sm text-muted",
				children: "No activity in this view yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 space-y-6",
				children: groups.map(([day, rows]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xs font-medium uppercase tracking-widest text-subtle",
					children: formatDateLabel(day)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border",
					children: rows.map((txn) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TxnRow, {
						txn,
						currency,
						onDelete: () => removeTxn.mutate(txn.id)
					}, txn.id))
				})] }, day))
			})
		]
	}) });
}
//#endregion
export { Activity as component };
