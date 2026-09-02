import { t as APP_VERSION } from "./version-xfSkRsx-.mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useCurrentUser, r as cn, t as Button } from "./logo-CvL_n660.mjs";
import { a as formatMoney } from "./format-D6213dDq.mjs";
import { h as Bell } from "../_libs/lucide-react.mjs";
import { s as dismissNotice, t as AppShell } from "./server-DnAn995v.mjs";
import { t as TxnRow } from "./txn-row-B7bro2G0.mjs";
import { a as useOverview, i as useMoneyMutations } from "./hooks-CCa1Rf6w.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dsy2r-K9.js
var import_jsx_runtime = require_jsx_runtime();
function UpdateModal({ notice, onDismissed }) {
	if (!notice) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-background/75 p-4 sm:items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-app rise-in rounded-3xl bg-card p-6 shadow-lift",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
						className: "size-5",
						strokeWidth: 2
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-xs font-medium uppercase tracking-widest text-muted",
					children: ["Update ", notice.version]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-2xl font-semibold tracking-tight",
					children: notice.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: notice.body
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-xs text-subtle",
					children: ["You are on ", APP_VERSION]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6 w-full",
					variant: "solid",
					onClick: async () => {
						await dismissNotice({ data: { version: notice.version } });
						onDismissed();
					},
					children: notice.ctaLabel ?? "Got it"
				})
			]
		})
	});
}
function Home() {
	const user = useCurrentUser();
	const { data, isPending, error, refetch } = useOverview();
	const { removeTxn } = useMoneyMutations();
	const first = (user?.displayName || "there").split(" ")[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.2em] text-muted",
				children: "Bachelor Money"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "mt-1 font-display text-2xl font-semibold tracking-tight",
				children: ["hey, ", first.toLowerCase()]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid size-11 place-items-center overflow-hidden rounded-full bg-card text-sm font-medium",
				children: user?.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: user.profileImageUrl,
					alt: "",
					className: "size-full object-cover"
				}) : first.slice(0, 1).toUpperCase()
			})]
		}), isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-8 h-40 animate-pulse rounded-3xl bg-card" }) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-8 text-sm text-danger",
			children: "Could not load your ledger."
		}) : data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rise-in mt-8 rounded-3xl bg-card px-5 py-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-widest text-muted",
						children: "Cash on hand"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("mt-2 font-display text-5xl font-semibold tracking-tight tabular-nums", data.cash < 0 && "text-danger"),
						children: formatMoney(data.cash, data.currency)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "In this month",
							value: formatMoney(data.monthIncome, data.currency),
							tone: "in"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Out this month",
							value: formatMoney(data.monthExpense, data.currency),
							tone: "out"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/people",
					className: "rounded-3xl bg-card px-4 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "You owe"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-xl font-semibold tabular-nums text-danger",
						children: formatMoney(data.payable, data.currency)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/people",
					className: "rounded-3xl bg-card px-4 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Owed to you"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-xl font-semibold tabular-nums text-primary",
						children: formatMoney(data.receivable, data.currency)
					})]
				})]
			}),
			data.people.filter((p) => p.balance !== 0).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "People"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/people",
						className: "text-xs text-muted",
						children: "See all"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex gap-2 overflow-x-auto pb-1",
					children: data.people.filter((p) => p.balance !== 0).slice(0, 8).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/people/$personId",
						params: { personId: p.id },
						className: "min-w-28 shrink-0 rounded-2xl bg-card px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: cn("mt-1 text-xs tabular-nums", p.balance > 0 ? "text-primary" : "text-danger"),
							children: [p.balance > 0 ? "gets " : "you owe ", formatMoney(Math.abs(p.balance), data.currency)]
						})]
					}, p.id))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Recent"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/activity",
						className: "text-xs text-muted",
						children: "Activity"
					})]
				}), data.recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm leading-relaxed text-muted",
					children: "Nothing yet. Tap the plus to log a spend, a borrow, or a split."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 divide-y divide-border",
					children: data.recent.map((txn) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TxnRow, {
						txn,
						currency: data.currency,
						onDelete: () => removeTxn.mutate(txn.id)
					}, txn.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UpdateModal, {
				notice: data.notice,
				onDismissed: () => refetch()
			})
		] }) : null]
	}) });
}
function Stat({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-card-2 px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("mt-1 text-sm font-medium tabular-nums", tone === "in" ? "text-primary" : "text-foreground"),
			children: value
		})]
	});
}
//#endregion
export { Home as component };
