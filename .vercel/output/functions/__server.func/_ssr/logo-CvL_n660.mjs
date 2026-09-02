import "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as authClient } from "./client-B40BzJxt.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("press inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-opacity duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60", {
	variants: {
		variant: {
			primary: "bg-primary text-primary-foreground",
			solid: "bg-foreground text-background",
			ghost: "bg-transparent text-foreground hover:bg-card",
			outline: "hairline bg-transparent text-foreground",
			danger: "bg-danger text-danger-foreground",
			muted: "bg-card text-foreground"
		},
		size: {
			default: "h-12 rounded-xl px-5 text-sm",
			sm: "h-10 rounded-lg px-3.5 text-sm",
			lg: "h-14 rounded-2xl px-6 text-base",
			icon: "size-12 rounded-xl",
			pill: "h-9 rounded-full px-3.5 text-xs"
		}
	},
	defaultVariants: {
		variant: "solid",
		size: "default"
	}
});
function Button({ className, variant, size, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function LogoMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("size-8", className),
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "32",
			height: "32",
			rx: "9",
			fill: "currentColor",
			className: "text-primary"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M9.2 8.4h7.1c3.2 0 5.4 1.7 5.4 4.3 0 1.8-1.1 3.2-2.9 3.8 2.2.5 3.6 2.1 3.6 4.3 0 2.9-2.4 4.8-6 4.8H9.2V8.4zm3.5 6.7h3.4c1.5 0 2.4-.8 2.4-1.9s-.9-1.8-2.4-1.8h-3.4v3.7zm0 7.1h4c1.7 0 2.7-.9 2.7-2.1s-1-2-2.7-2H12.7v4.1z",
			fill: "#07140c"
		})]
	});
}
//#endregion
export { useCurrentUserState as a, useCurrentUser as i, LogoMark as n, cn as r, Button as t };
