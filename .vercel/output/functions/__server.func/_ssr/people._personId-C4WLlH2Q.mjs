import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as cn, t as Button } from "./logo-CvL_n660.mjs";
import { a as formatMoney, i as formatDateLabel } from "./format-D6213dDq.mjs";
import { _ as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./server-DnAn995v.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useOverview, i as useMoneyMutations, o as usePerson } from "./hooks-CCa1Rf6w.mjs";
import { n as Route$1 } from "./router-BFzuH9xs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/people._personId-C4WLlH2Q.js
var import_jsx_runtime = require_jsx_runtime();
function PersonPage() {
	const { personId } = Route$1.useParams();
	const { data: overview } = useOverview();
	const { data, isPending, error } = usePerson(personId);
	const { removePerson } = useMoneyMutations();
	const navigate = useNavigate();
	const currency = overview?.currency ?? "BDT";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/people",
			className: "inline-flex items-center gap-1 text-sm text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "People"]
		}), isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-8 h-32 animate-pulse rounded-3xl bg-card" }) : error || !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-8 text-sm text-danger",
			children: "Could not load this person."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-3xl bg-card px-5 py-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-widest text-muted",
						children: "Ledger"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl font-semibold tracking-tight",
						children: data.person.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("mt-4 font-display text-4xl font-semibold tabular-nums tracking-tight", data.person.balance > 0 ? "text-primary" : data.person.balance < 0 ? "text-danger" : "text-muted"),
						children: data.person.balance === 0 ? "Settled" : formatMoney(Math.abs(data.person.balance), currency)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: data.person.balance > 0 ? "They owe you" : data.person.balance < 0 ? "You owe them" : "Nothing open"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/add",
							search: {
								person: personId,
								mode: data.person.balance < 0 ? "repay" : "lend"
							},
							className: "flex h-11 items-center justify-center rounded-xl bg-foreground text-sm font-medium text-background",
							children: data.person.balance < 0 ? "Pay back" : "Lend / cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/add",
							search: {
								person: personId,
								mode: data.person.balance > 0 ? "collect" : "borrow"
							},
							className: "flex h-11 items-center justify-center rounded-xl bg-card-2 text-sm font-medium",
							children: data.person.balance > 0 ? "Collect" : "Borrow"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "History"
				}), data.lines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted",
					children: "No ledger events yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-border",
					children: data.lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium capitalize",
							children: line.note || line.source
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								formatDateLabel(line.occurredOn),
								" · ",
								line.kind
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: cn("text-sm font-medium tabular-nums", line.delta > 0 ? "text-primary" : "text-danger"),
							children: [line.delta > 0 ? "+" : "−", formatMoney(Math.abs(line.delta), currency)]
						})]
					}, line.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "mt-8 w-full text-danger",
				onClick: async () => {
					try {
						await removePerson.mutateAsync(personId);
						navigate({ to: "/people" });
					} catch (e) {
						toast.error(e instanceof Error ? e.message : "Could not remove");
					}
				},
				children: "Remove person"
			})
		] })]
	}) });
}
//#endregion
export { PersonPage as component };
