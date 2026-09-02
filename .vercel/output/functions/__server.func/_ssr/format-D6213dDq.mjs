import { n as createMiddleware } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/format-D6213dDq.js
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out with auth on (live preview included) -> throws `UnauthorizedError`
* (see `verify.server.ts`). With auth disabled (`VITE_AUTH_ENABLED=false`, the
* shipped default) it resolves the shared dev user — but throws instead when a
* `DATABASE_URL` is also set, so an app without sign-in must not use this at
* all. On the auth-on path, use it on every server function that touches
* per-user data and scope every query by `context.userId`.
*/
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-B40BzJxt.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-CGNg1r0B.mjs");
	const { requireUserId } = await import("./verify.server-BOirgtlS.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
var CURRENCY_MARK = {
	BDT: "৳",
	USD: "$",
	EUR: "€",
	GBP: "£",
	INR: "₹"
};
function currencyMark(code = "BDT") {
	return CURRENCY_MARK[code] ?? `${code} `;
}
function roundMoney(n) {
	return Math.round((n + Number.EPSILON) * 100) / 100;
}
function parseMoney(v) {
	if (typeof v === "number") return Number.isFinite(v) ? v : 0;
	const n = parseFloat(String(v ?? "0"));
	return Number.isFinite(n) ? n : 0;
}
function formatMoney(amount, code = "BDT", opts) {
	const mark = currencyMark(code);
	const abs = Math.abs(amount);
	const body = abs.toLocaleString("en-US", {
		minimumFractionDigits: abs % 1 === 0 ? 0 : 2,
		maximumFractionDigits: 2
	});
	return `${opts?.sign ? amount > 0 ? "+" : amount < 0 ? "−" : "" : amount < 0 ? "−" : ""}${mark}${body}`;
}
function formatDateLabel(iso) {
	const d = /* @__PURE__ */ new Date(`${iso}T00:00:00`);
	if (Number.isNaN(d.getTime())) return iso;
	const today = /* @__PURE__ */ new Date();
	const yday = /* @__PURE__ */ new Date();
	yday.setDate(today.getDate() - 1);
	const key = (x) => x.toISOString().slice(0, 10);
	if (iso === key(today)) return "Today";
	if (iso === key(yday)) return "Yesterday";
	return d.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short"
	});
}
function compareSemver(a, b) {
	const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
	const pb = b.split(".").map((n) => parseInt(n, 10) || 0);
	const len = Math.max(pa.length, pb.length);
	for (let i = 0; i < len; i += 1) {
		const da = pa[i] ?? 0;
		const db = pb[i] ?? 0;
		if (da > db) return 1;
		if (da < db) return -1;
	}
	return 0;
}
//#endregion
export { formatMoney as a, formatDateLabel as i, compareSemver as n, parseMoney as o, currencyMark as r, roundMoney as s, authMiddleware as t };
