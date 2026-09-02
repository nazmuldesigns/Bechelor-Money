import { o as __toESM } from "../_runtime.mjs";
import { t as APP_VERSION } from "./version-xfSkRsx-.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as LogoMark, r as cn, t as Button } from "./logo-CvL_n660.mjs";
import { _ as ArrowLeft, a as MessageSquare, o as Mail, r as Share2 } from "../_libs/lucide-react.mjs";
import { p as submitFeedback, t as AppShell } from "./server-DnAn995v.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-jVMUbqcv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-28 w-full resize-none rounded-2xl bg-card px-4 py-3 text-sm text-foreground outline-none hairline placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-primary/50", className),
		...props
	});
}
var DEVELOPER = {
	name: "Md. Nazmul Hasan",
	role: "Lead App Developer / Designer",
	email: "md.nazmul.hasan.contact@gmail.com"
};
function AboutPage() {
	const [message, setMessage] = (0, import_react.useState)("");
	const [sent, setSent] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-6 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/more",
				className: "inline-flex items-center gap-1 text-sm text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "More"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col items-center text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "size-14" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-5 font-display text-3xl font-semibold tracking-tight",
						children: "Bachelor Money"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xs text-sm leading-relaxed text-muted",
						children: "A quiet wallet for students, bachelors, and anyone splitting life with other people."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-subtle",
						children: ["Version ", APP_VERSION]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 rounded-3xl bg-card px-5 py-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-widest text-muted",
						children: "Built by"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-2xl font-semibold tracking-tight",
						children: DEVELOPER.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: DEVELOPER.role
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `mailto:${DEVELOPER.email}?subject=Bachelor%20Money`,
								className: "flex h-20 flex-col items-center justify-center gap-1.5 rounded-2xl bg-card-2 text-xs font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4" }), "Email"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `https://x.com/intent/tweet?text=${encodeURIComponent("Bachelor Money — cash, debts, splits.")}`,
								target: "_blank",
								rel: "noreferrer",
								className: "flex h-20 flex-col items-center justify-center gap-1.5 rounded-2xl bg-card-2 text-xs font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), "Socials"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => document.getElementById("feedback")?.scrollIntoView({ behavior: "smooth" }),
								className: "flex h-20 flex-col items-center justify-center gap-1.5 rounded-2xl bg-card-2 text-xs font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4" }), "Feedback"]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "feedback",
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Send feedback"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: "Ideas, bugs, or a hello — it lands in Nazmul's inbox inside the app."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						className: "mt-3",
						placeholder: "Tell us what to build next…",
						value: message,
						onChange: (e) => setMessage(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3 w-full",
						disabled: busy || sent,
						onClick: async () => {
							setBusy(true);
							try {
								await submitFeedback({ data: { message } });
								setSent(true);
								setMessage("");
								toast.success("Feedback sent");
							} catch (e) {
								toast.error(e instanceof Error ? e.message : "Could not send");
							} finally {
								setBusy(false);
							}
						},
						children: sent ? "Sent" : "Send"
					})
				]
			})
		]
	}) });
}
//#endregion
export { AboutPage as component };
