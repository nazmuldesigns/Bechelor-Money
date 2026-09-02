import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { a as useCurrentUserState, n as LogoMark, t as Button } from "./logo-CvL_n660.mjs";
import { t as GROK_PROVIDERS } from "./server-qIMxh2UW.mjs";
import { t as Input } from "./input-DAj6SW1g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-MB9f6g0-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GoogleIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		className: "size-4",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M21.35 11.1h-9.17v2.98h5.27c-.23 1.5-1.78 4.4-5.27 4.4-3.17 0-5.76-2.62-5.76-5.85s2.59-5.85 5.76-5.85c1.8 0 3.01.77 3.7 1.43l2.52-2.43C16.68 4.3 14.7 3.4 12.18 3.4 7.36 3.4 3.5 7.27 3.5 12.13S7.36 20.86 12.18 20.86c5.24 0 8.7-3.68 8.7-8.86 0-.6-.06-1.05-.15-1.5z"
		})
	});
}
function Login() {
	const { user, isPending } = useCurrentUserState();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!isPending && user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	const onEmail = async (e) => {
		e.preventDefault();
		setError(null);
		setBusy(true);
		try {
			if (mode === "up") {
				const res = await authClient.signUp.email({
					email,
					password,
					name: name || email.split("@")[0] || "Friend"
				});
				if (res.error) throw new Error(res.error.message || "Could not create account");
			} else {
				const res = await authClient.signIn.email({
					email,
					password
				});
				if (res.error) throw new Error(res.error.message || "Could not sign in");
			}
			await authClient.getSession();
			window.location.href = "/";
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh w-full max-w-app flex-col justify-between px-6 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rise-in pt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "size-12" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-xs font-medium uppercase tracking-[0.22em] text-muted",
					children: "Bachelor Money"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-3 font-display text-4xl font-semibold leading-tight tracking-tight",
					children: [
						"Your cash.",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Your people."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-xs text-sm leading-relaxed text-muted",
					children: "Track spend, borrow, and splits. Everything stays private to your account."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rise-in-delay space-y-3 pb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "w-full",
					variant: p.label === "Google" ? "solid" : "outline",
					onClick: () => signIn(p.providerId, { callbackURL: "/" }),
					children: [
						p.label === "Google" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleIcon, {}) : null,
						"Continue with ",
						p.label === "Google" ? "Gmail" : p.label
					]
				}, p.providerId)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] uppercase tracking-widest text-subtle",
							children: "or email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: onEmail,
					className: "space-y-2",
					children: [
						mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Your name",
							value: name,
							onChange: (e) => setName(e.target.value),
							autoComplete: "name"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							placeholder: "you@gmail.com",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							autoComplete: "email",
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							placeholder: "Password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							autoComplete: mode === "up" ? "new-password" : "current-password",
							minLength: 8,
							required: true
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-danger",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "muted",
							className: "w-full",
							disabled: busy,
							children: busy ? "Please wait…" : mode === "up" ? "Create account" : "Sign in with email"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "w-full py-2 text-center text-xs text-muted",
					onClick: () => {
						setMode(mode === "up" ? "in" : "up");
						setError(null);
					},
					children: mode === "up" ? "Already have an account? Sign in" : "New here? Create an account"
				})
			] })
		})]
	});
}
//#endregion
export { Login as component };
