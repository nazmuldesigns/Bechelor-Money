import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as cn, t as Button } from "./logo-CvL_n660.mjs";
import { a as formatMoney, r as currencyMark } from "./format-D6213dDq.mjs";
import { t as AppShell } from "./server-DnAn995v.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useOverview, i as useMoneyMutations } from "./hooks-CCa1Rf6w.mjs";
import { n as planEntry, t as describePlan } from "./engine-DFInCt5l.mjs";
import { r as Route$5 } from "./router-BFzuH9xs.mjs";
import { t as Input } from "./input-DAj6SW1g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/add-wnCnjsJc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		id: "spend",
		label: "Spend"
	},
	{
		id: "income",
		label: "Income"
	},
	{
		id: "borrow",
		label: "Borrow"
	},
	{
		id: "lend",
		label: "Lend"
	},
	{
		id: "split",
		label: "Split"
	}
];
function today() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function AddPage() {
	const search = Route$5.useSearch();
	const navigate = useNavigate();
	const { data } = useOverview();
	const { addEntry, addPerson } = useMoneyMutations();
	const [mode, setMode] = (0, import_react.useState)(search.mode ?? "spend");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [categoryId, setCategoryId] = (0, import_react.useState)("");
	const [personId, setPersonId] = (0, import_react.useState)(search.person ?? "");
	const [personIds, setPersonIds] = (0, import_react.useState)(search.person ? [search.person] : []);
	const [occurredOn, setOccurredOn] = (0, import_react.useState)(today());
	const [newName, setNewName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const currency = data?.currency ?? "BDT";
	const people = data?.people ?? [];
	const cats = (data?.categories ?? []).filter((c) => mode === "income" || mode === "borrow" || mode === "collect" ? c.kind === "income" : c.kind === "expense");
	const numeric = Number(amount);
	const preview = (0, import_react.useMemo)(() => {
		if (!(numeric > 0)) return null;
		try {
			const plan = planEntry({
				mode,
				amount: numeric,
				personId: personId || void 0,
				personIds: mode === "split" ? personIds : void 0
			});
			return {
				plan,
				lines: describePlan(plan, people)
			};
		} catch {
			return null;
		}
	}, [
		numeric,
		mode,
		personId,
		personIds,
		people
	]);
	const onSave = async () => {
		if (!(numeric > 0)) {
			toast.error("Enter an amount");
			return;
		}
		setBusy(true);
		try {
			await addEntry.mutateAsync({
				mode,
				amount: numeric,
				categoryId: categoryId || void 0,
				personId: mode === "split" ? void 0 : personId || void 0,
				personIds: mode === "split" ? personIds : void 0,
				note: note.trim() || void 0,
				occurredOn
			});
			toast.success("Saved");
			navigate({ to: "/" });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not save");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.2em] text-muted",
				children: "New entry"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl font-semibold tracking-tight",
				children: "Add money"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex gap-2 overflow-x-auto pb-1",
				children: TABS.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode(tab.id),
					className: cn("h-9 shrink-0 rounded-full px-4 text-xs font-medium", mode === tab.id ? "bg-foreground text-background" : "bg-card text-muted"),
					children: tab.label
				}, tab.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-8 block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: "Amount"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex items-baseline gap-2 rounded-3xl bg-card px-4 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-2xl text-muted",
						children: currencyMark(currency)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						"data-calc": "1",
						inputMode: "decimal",
						placeholder: "0",
						value: amount,
						onChange: (e) => setAmount(e.target.value.replace(/[^0-9.]/g, "")),
						className: "w-full bg-transparent font-display text-5xl font-semibold tracking-tight tabular-nums outline-none placeholder:text-subtle"
					})]
				})]
			}),
			mode === "spend" || mode === "income" || mode === "split" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Category"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: cats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setCategoryId(c.id === categoryId ? "" : c.id),
						className: cn("h-9 rounded-full px-3 text-xs font-medium", categoryId === c.id ? "bg-foreground text-background" : "bg-card text-muted"),
						children: c.name
					}, c.id))
				})]
			}) : null,
			mode === "spend" || mode === "borrow" || mode === "lend" || mode === "repay" || mode === "collect" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonSelect, {
				label: mode === "spend" ? "Paid for someone (optional)" : mode === "borrow" ? "Borrowed from" : mode === "lend" ? "Lent to" : mode === "repay" ? "Paying back" : "Collecting from",
				people,
				value: personId,
				onChange: setPersonId,
				newName,
				setNewName,
				onCreate: async () => {
					if (!newName.trim()) return;
					const p = await addPerson.mutateAsync({ name: newName.trim() });
					setPersonId(p.id);
					setNewName("");
				}
			}) : null,
			mode === "split" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Split equally with"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: people.map((p) => {
							const on = personIds.includes(p.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPersonIds((ids) => on ? ids.filter((x) => x !== p.id) : [...ids, p.id]),
								className: cn("h-9 rounded-full px-3 text-xs font-medium", on ? "bg-foreground text-background" : "bg-card text-muted"),
								children: p.name
							}, p.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Add a person",
							value: newName,
							onChange: (e) => setNewName(e.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "muted",
							onClick: async () => {
								if (!newName.trim()) return;
								const p = await addPerson.mutateAsync({ name: newName.trim() });
								setPersonIds((ids) => [...ids, p.id]);
								setNewName("");
							},
							children: "Add"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-subtle",
						children: "You are always included in the split."
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Note"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-2",
					placeholder: "Optional — lunch, rickshaw, rent…",
					value: note,
					onChange: (e) => setNote(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Date"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-2",
					type: "date",
					value: occurredOn,
					onChange: (e) => setOccurredOn(e.target.value)
				})]
			}),
			preview?.lines.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-3xl bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-widest text-muted",
						children: "Ledger preview"
					}),
					preview.plan.myShare != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"Your share ",
							formatMoney(preview.plan.myShare, currency),
							" of",
							" ",
							formatMoney(preview.plan.cashAmount, currency)
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2",
						children: preview.lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: line.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums text-muted",
								children: [
									formatMoney(line.before, currency, { sign: true }),
									" → ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: line.after < 0 ? "text-danger" : "text-primary",
										children: formatMoney(line.after, currency, { sign: true })
									})
								]
							})]
						}, line.personId))
					})
				]
			}) : null,
			mode === "spend" && personId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs leading-relaxed text-muted",
				children: "Tagging a person on a spend treats it as paying for them — it reduces what you owe, or grows what they owe you."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-8 w-full",
				size: "lg",
				onClick: onSave,
				disabled: busy,
				children: busy ? "Saving…" : "Save"
			})
		]
	}) });
}
function PersonSelect({ label, people, value, onChange, newName, setNewName, onCreate }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: people.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onChange(p.id === value ? "" : p.id),
					className: cn("h-9 rounded-full px-3 text-xs font-medium", value === p.id ? "bg-foreground text-background" : "bg-card text-muted"),
					children: p.name
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "New person",
					value: newName,
					onChange: (e) => setNewName(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "muted",
					onClick: onCreate,
					children: "Add"
				})]
			})
		]
	});
}
//#endregion
export { AddPage as component };
