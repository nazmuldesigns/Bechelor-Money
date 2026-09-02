import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as cn, t as Button } from "./logo-CvL_n660.mjs";
import { a as formatMoney } from "./format-D6213dDq.mjs";
import { i as Plus } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./server-DnAn995v.mjs";
import { a as useOverview, i as useMoneyMutations } from "./hooks-CCa1Rf6w.mjs";
import { t as Input } from "./input-DAj6SW1g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/people-F7PIOv_e.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PeoplePage() {
	const { data, isPending } = useOverview();
	const { addPerson } = useMoneyMutations();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const currency = data?.currency ?? "BDT";
	const people = data?.people ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-semibold tracking-tight",
					children: "People"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "ধার ও ধার পরিশোধ — one ledger each."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "muted",
					onClick: () => setOpen((v) => !v),
					"aria-label": "Add person",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" })
				})]
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-5 space-y-2 rounded-3xl bg-card p-4",
				onSubmit: async (e) => {
					e.preventDefault();
					if (!name.trim()) return;
					await addPerson.mutateAsync({ name: name.trim() });
					setName("");
					setOpen(false);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Name — e.g. Rahim, Roommate",
					value: name,
					onChange: (e) => setName(e.target.value),
					autoFocus: true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: addPerson.isPending,
					children: "Save person"
				})]
			}) : null,
			isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-8 h-24 animate-pulse rounded-3xl bg-card" }) : people.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-sm leading-relaxed text-muted",
				children: "Add the people you borrow from, lend to, or split bills with. Their balance nets automatically."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 divide-y divide-border",
				children: people.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/people/$personId",
					params: { personId: p.id },
					className: "flex items-center gap-3 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-11 place-items-center rounded-2xl bg-card text-sm font-medium",
							children: p.name.slice(0, 1).toUpperCase()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-sm font-medium",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted",
								children: p.balance > 0 ? "owes you" : p.balance < 0 ? "you owe" : "settled"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("text-sm font-medium tabular-nums", p.balance > 0 ? "text-primary" : p.balance < 0 ? "text-danger" : "text-muted"),
							children: p.balance === 0 ? "—" : formatMoney(Math.abs(p.balance), currency)
						})
					]
				}) }, p.id))
			})
		]
	}) });
}
//#endregion
export { PeoplePage as component };
