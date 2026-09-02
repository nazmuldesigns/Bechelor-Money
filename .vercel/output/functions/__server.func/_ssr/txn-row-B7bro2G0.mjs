import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { r as cn } from "./logo-CvL_n660.mjs";
import { a as formatMoney, i as formatDateLabel } from "./format-D6213dDq.mjs";
import { c as Landmark, g as ArrowUpRight, s as Layers, y as ArrowDownLeft } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/txn-row-B7bro2G0.js
var import_jsx_runtime = require_jsx_runtime();
var SOURCE_LABEL = {
	plain: "",
	borrow: "Borrowed",
	lend: "Lent",
	repay: "Paid for",
	collect: "Collected",
	split: "Split"
};
function TxnRow({ txn, currency, onDelete }) {
	const inflow = txn.kind === "income";
	const title = txn.note || txn.categoryName || SOURCE_LABEL[txn.source] || (inflow ? "Income" : "Expense");
	const meta = [
		SOURCE_LABEL[txn.source] || (inflow ? "In" : "Out"),
		txn.personName,
		formatDateLabel(txn.occurredOn)
	].filter(Boolean).join(" · ");
	const Icon = txn.source === "split" ? Layers : txn.source === "borrow" || txn.source === "lend" ? Landmark : inflow ? ArrowDownLeft : ArrowUpRight;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("grid size-11 shrink-0 place-items-center rounded-2xl", inflow ? "bg-primary/15 text-primary" : "bg-danger/12 text-danger"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "size-4",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm font-medium",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-xs text-muted",
					children: meta
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cn("font-medium tabular-nums", inflow ? "text-primary" : "text-foreground"),
					children: [inflow ? "+" : "−", formatMoney(txn.amount, currency)]
				}), onDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onDelete,
					className: "text-[11px] text-muted hover:text-danger",
					children: "Undo"
				}) : null]
			})
		]
	});
}
//#endregion
export { TxnRow as t };
