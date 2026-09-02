import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as Navigate, f as useRouterState, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { D as _enum, F as object, P as number, R as string, k as array } from "../_libs/@better-auth/core+[...].mjs";
import { i as signOut } from "./client-B40BzJxt.mjs";
import { a as useCurrentUserState, i as useCurrentUser, n as LogoMark, r as cn, t as Button } from "./logo-CvL_n660.mjs";
import { a as hasGateSessionMarker } from "./server-qIMxh2UW.mjs";
import { s as roundMoney, t as authMiddleware } from "./format-D6213dDq.mjs";
import { d as Delete, f as CircleEllipsis, i as Plus, l as House, m as Calculator, t as Users, u as Equal, v as ArrowLeftRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-DnAn995v.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var Ctx = (0, import_react.createContext)(null);
function safeCompute(expr) {
	const cleaned = expr.replace(/[^0-9+\-*/(). ]/g, "");
	if (!cleaned.trim()) return null;
	if (!/^[0-9+\-*/(). ]+$/.test(cleaned)) return null;
	try {
		const n = Function(`"use strict"; return (${cleaned})`)();
		if (typeof n !== "number" || !Number.isFinite(n)) return null;
		return roundMoney(n);
	} catch {
		return null;
	}
}
function CalculatorHost({ children }) {
	const [target, setTarget] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [kb, setKb] = (0, import_react.useState)(0);
	const [expr, setExpr] = (0, import_react.useState)("0");
	(0, import_react.useEffect)(() => {
		const vv = window.visualViewport;
		if (!vv) return;
		const sync = () => {
			const occluded = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
			setKb(occluded);
		};
		sync();
		vv.addEventListener("resize", sync);
		vv.addEventListener("scroll", sync);
		return () => {
			vv.removeEventListener("resize", sync);
			vv.removeEventListener("scroll", sync);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const onFocus = (e) => {
			const el = e.target;
			if (!(el instanceof HTMLInputElement) && !(el instanceof HTMLTextAreaElement)) return;
			if ((el.dataset.calc === "1" || el.inputMode === "decimal" || el.inputMode === "numeric" || el.type === "number") && el instanceof HTMLInputElement) setTarget(el);
		};
		const onBlur = () => {
			window.setTimeout(() => {
				const active = document.activeElement;
				if (active instanceof HTMLInputElement && (active.dataset.calc === "1" || active.inputMode === "decimal")) return;
				if (!open) setTarget(null);
			}, 180);
		};
		document.addEventListener("focusin", onFocus);
		document.addEventListener("focusout", onBlur);
		return () => {
			document.removeEventListener("focusin", onFocus);
			document.removeEventListener("focusout", onBlur);
		};
	}, [open]);
	const apply = (0, import_react.useCallback)((n) => {
		if (!target) return;
		const next = String(n);
		Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(target, next);
		target.dispatchEvent(new Event("input", { bubbles: true }));
		target.dispatchEvent(new Event("change", { bubbles: true }));
		setOpen(false);
	}, [target]);
	const register = (0, import_react.useCallback)((el) => {
		if (el) setTarget(el);
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		focused: Boolean(target),
		open,
		setOpen,
		apply,
		register
	}), [
		target,
		open,
		apply,
		register
	]);
	const result = safeCompute(expr);
	const lift = Math.max(kb, 0);
	const showChip = Boolean(target) && !open;
	const tap = (token) => {
		setExpr((prev) => {
			if (token === "C") return "0";
			if (token === "⌫") {
				const next = prev.slice(0, -1);
				return next.length ? next : "0";
			}
			if (prev === "0" && /[0-9.]/.test(token)) return token === "." ? "0." : token;
			return prev + token;
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Ctx.Provider, {
		value,
		children: [
			children,
			showChip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Open calculator",
				onMouseDown: (e) => e.preventDefault(),
				onClick: () => {
					setExpr(target?.value && target.value !== "" ? target.value : "0");
					setOpen(true);
				},
				style: { bottom: lift + 88 },
				className: "fixed left-1/2 z-40 flex size-12 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, {
					className: "size-5",
					strokeWidth: 2
				})
			}) : null,
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-end justify-center bg-background/70",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-app rounded-t-3xl bg-card px-4 pb-8 pt-4 shadow-lift",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mb-4 h-1 w-10 rounded-full bg-border-strong" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-widest text-muted",
							children: "Calculator"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-3xl font-semibold tabular-nums tracking-tight",
							children: expr
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted tabular-nums",
							children: result === null ? "—" : `= ${result}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5 grid grid-cols-4 gap-2",
							children: [
								"7",
								"8",
								"9",
								"/",
								"4",
								"5",
								"6",
								"*",
								"1",
								"2",
								"3",
								"-",
								"0",
								".",
								"C",
								"+"
							].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => tap(k),
								className: cn("h-14 rounded-2xl bg-card-2 text-lg font-medium tabular-nums", (k === "+" || k === "-" || k === "*" || k === "/") && "text-primary", k === "C" && "text-danger"),
								children: k === "C" ? "C" : k
							}, k))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "muted",
								onClick: () => tap("⌫"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Delete, { className: "size-4" }), "Delete"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "primary",
								disabled: result === null,
								onClick: () => {
									if (result === null) return;
									apply(result);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equal, { className: "size-4" }), "Use result"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "mt-2 w-full",
							onClick: () => setOpen(false),
							children: "Close"
						})
					]
				})
			}) : null
		]
	});
}
var TABS = [
	{
		to: "/",
		label: "Home",
		icon: House
	},
	{
		to: "/activity",
		label: "Activity",
		icon: ArrowLeftRight
	},
	{
		to: "/add",
		label: "Add",
		icon: Plus,
		fab: true
	},
	{
		to: "/people",
		label: "People",
		icon: Users
	},
	{
		to: "/more",
		label: "More",
		icon: CircleEllipsis
	}
];
function BootScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "size-12" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-xl font-semibold tracking-tight",
				children: "Bachelor Money"
			})]
		})
	});
}
function AppShell({ children }) {
	const { user, isPending } = useCurrentUserState();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BootScreen, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalculatorHost, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-background text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto flex min-h-dvh w-full max-w-app flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 pb-28",
				children
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed bottom-0 left-1/2 z-30 w-full max-w-app -translate-x-1/2 border-t border-border bg-background/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid grid-cols-5 px-2 pt-1",
					children: TABS.map((tab) => {
						const active = tab.to === "/" ? pathname === "/" : pathname === tab.to || pathname.startsWith(`${tab.to}/`);
						const Icon = tab.icon;
						if ("fab" in tab && tab.fab) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: tab.to,
								"aria-label": "Add",
								className: "relative -top-4 grid size-14 place-items-center rounded-full bg-foreground text-background shadow-lift",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
									className: "size-6",
									strokeWidth: 2.2
								})
							})
						}, tab.to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: tab.to,
							className: cn("flex flex-col items-center gap-1 py-2 text-[11px] font-medium", active ? "text-foreground" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-5",
								strokeWidth: active ? 2.2 : 1.8
							}), tab.label]
						}) }, tab.to);
					})
				})
			})]
		})
	}) });
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("86c62d49851032aa8909ebb4f64230f0ee6ffef4de96c4f1016916a68fb069da"));
var listTransactions = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("88e35282823d111956c7cc26c9b9ef4d4aad782bcd8f414c42f9bd06d17a8358"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e82a9690ff3f24b182b81b26efd7eb017623e14a50c7ae1c2253e87b6e462da3"));
var getPersonLedger = createServerFn({ method: "GET" }).validator(object({ personId: string().min(1) })).middleware([authMiddleware]).handler(createSsrRpc("3e14896ec3b7561abb0ec1006f29db181a13a54492049fa8cb5c603ff60c04b9"));
var createPerson = createServerFn({ method: "POST" }).validator(object({
	name: string().trim().min(1).max(80),
	note: string().trim().max(200).optional()
})).middleware([authMiddleware]).handler(createSsrRpc("77ac553f5b3435cadbfeb8d8fb4c588e49c1ac98818a2e4300495bccb13bde5d"));
var deletePerson = createServerFn({ method: "POST" }).validator(object({ personId: string().min(1) })).middleware([authMiddleware]).handler(createSsrRpc("d7d89ea25455090a7b6b712d26bf9c91898ff0cd5ec2b2d3a80436e8253398f4"));
var createEntry = createServerFn({ method: "POST" }).validator(object({
	mode: _enum([
		"spend",
		"income",
		"borrow",
		"lend",
		"repay",
		"collect",
		"split"
	]),
	amount: number().positive(),
	categoryId: string().optional(),
	personId: string().optional(),
	personIds: array(string()).optional(),
	note: string().trim().max(240).optional(),
	occurredOn: string().regex(/^\d{4}-\d{2}-\d{2}$/)
})).middleware([authMiddleware]).handler(createSsrRpc("271e4a2e7a7798aa3122ef46b6c46238af51c3764970671edf6c0b7baa89312e"));
var deleteTransaction = createServerFn({ method: "POST" }).validator(object({ id: string().min(1) })).middleware([authMiddleware]).handler(createSsrRpc("86b5aef9d7923c193c59c9affb402c483f377848e47815d59e368f3718fec8cc"));
var dismissNotice = createServerFn({ method: "POST" }).validator(object({ version: string().min(1) })).middleware([authMiddleware]).handler(createSsrRpc("858578a0968df950d9ed66d13a07843710cc8bacf91a7c5dfd97a9fbcbdbed99"));
var submitFeedback = createServerFn({ method: "POST" }).validator(object({ message: string().trim().min(4).max(2e3) })).middleware([authMiddleware]).handler(createSsrRpc("5c691a7790ffa5bb3f379e4f5130d48c87fc5af4d4686361b367af591ef58dc2"));
var setCurrency = createServerFn({ method: "POST" }).validator(object({ currency: _enum([
	"BDT",
	"USD",
	"EUR",
	"GBP",
	"INR"
]) })).middleware([authMiddleware]).handler(createSsrRpc("d793291a1bf5fba4753326a837d054a18b6393f19dbbc4b05ca5bdb570506225"));
var monthBreakdown = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("8965312a28af4257f8383071dfcdc228a5ca517b0d47d235834165c3c1092072"));
//#endregion
export { deletePerson as a, getOverview as c, monthBreakdown as d, setCurrency as f, createPerson as i, getPersonLedger as l, UserButton as n, deleteTransaction as o, submitFeedback as p, createEntry as r, dismissNotice as s, AppShell as t, listTransactions as u };
