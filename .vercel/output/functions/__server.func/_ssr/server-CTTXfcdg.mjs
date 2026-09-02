import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { D as _enum, F as object, P as number, R as string, k as array } from "../_libs/@better-auth/core+[...].mjs";
import { r as getSql } from "./db-hDevtRgi.mjs";
import { n as compareSemver, o as parseMoney, t as authMiddleware } from "./format-D6213dDq.mjs";
import { n as planEntry } from "./engine-DFInCt5l.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-CTTXfcdg.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var DEFAULT_EXPENSE = [
	"Food",
	"Transport",
	"Rent",
	"Bills",
	"Shopping",
	"Fun",
	"Health",
	"Study",
	"Other"
];
var DEFAULT_INCOME = [
	"Salary",
	"Freelance",
	"Family",
	"Gift",
	"Other"
];
function monthStartISO() {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}
async function ensureWorkspace(userId, displayName) {
	const sql = await getSql();
	await sql`
    insert into profiles (user_id, display_name)
    values (${userId}, ${displayName ?? null})
    on conflict (user_id) do nothing
  `;
	if (((await sql`
    select count(*)::int as n from categories where user_id = ${userId}
  `)[0]?.n ?? 0) === 0) {
		for (const name of DEFAULT_EXPENSE) await sql`
        insert into categories (id, user_id, name, kind)
        values (${crypto.randomUUID()}, ${userId}, ${name}, ${"expense"})
      `;
		for (const name of DEFAULT_INCOME) await sql`
        insert into categories (id, user_id, name, kind)
        values (${crypto.randomUUID()}, ${userId}, ${name}, ${"income"})
      `;
	}
}
function mapTx(row) {
	return {
		id: row.id,
		kind: row.kind,
		source: row.source,
		amount: parseMoney(row.amount),
		categoryId: row.category_id,
		categoryName: row.category_name,
		personId: row.person_id,
		personName: row.person_name,
		splitId: row.split_id,
		note: row.note,
		occurredOn: String(row.occurred_on).slice(0, 10),
		createdAt: row.created_at
	};
}
var getOverview_createServerFn_handler = createServerRpc({
	id: "86c62d49851032aa8909ebb4f64230f0ee6ffef4de96c4f1016916a68fb069da",
	name: "getOverview",
	filename: "src/lib/money/server.ts"
}, (opts) => getOverview.__executeServer(opts));
var getOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getOverview_createServerFn_handler, async ({ context }) => {
	const userId = context.userId;
	await ensureWorkspace(userId);
	const sql = await getSql();
	const profile = await sql`
      select currency, dismissed_version from profiles where user_id = ${userId}
    `;
	const currency = profile[0]?.currency ?? "BDT";
	const dismissed = profile[0]?.dismissed_version ?? null;
	const totals = await sql`
      select
        coalesce(sum(case when kind = 'income' then amount else 0 end), 0) as income,
        coalesce(sum(case when kind = 'expense' then amount else 0 end), 0) as expense
      from transactions
      where user_id = ${userId}
    `;
	const month = await sql`
      select
        coalesce(sum(case when kind = 'income' then amount else 0 end), 0) as income,
        coalesce(sum(case when kind = 'expense' then amount else 0 end), 0) as expense
      from transactions
      where user_id = ${userId} and occurred_on >= ${monthStartISO()}
    `;
	const people = (await sql`
      select p.id, p.name, p.note, coalesce(sum(e.delta), 0) as balance
      from people p
      left join ledger_events e on e.person_id = p.id and e.user_id = p.user_id
      where p.user_id = ${userId}
      group by p.id, p.name, p.note
      order by p.name asc
    `).map((p) => ({
		id: p.id,
		name: p.name,
		note: p.note,
		balance: parseMoney(p.balance)
	}));
	const payable = people.reduce((s, p) => s + (p.balance < 0 ? -p.balance : 0), 0);
	const receivable = people.reduce((s, p) => s + (p.balance > 0 ? p.balance : 0), 0);
	const categories = (await sql`
      select id, name, kind from categories where user_id = ${userId} order by kind, name
    `).map((c) => ({
		id: c.id,
		name: c.name,
		kind: c.kind
	}));
	const recentRows = await sql`
      select
        t.id, t.kind, t.source, t.amount, t.category_id, c.name as category_name,
        t.person_id, p.name as person_name, t.split_id, t.note, t.occurred_on, t.created_at
      from transactions t
      left join categories c on c.id = t.category_id
      left join people p on p.id = t.person_id
      where t.user_id = ${userId}
      order by t.occurred_on desc, t.created_at desc
      limit 8
    `;
	const notices = await sql`
      select version, title, body, cta_label from app_notices order by created_at desc limit 1
    `;
	let notice = null;
	const latest = notices[0];
	if (latest && compareSemver(latest.version, "1.0.0") > 0) {
		if (!dismissed || compareSemver(latest.version, dismissed) > 0) notice = {
			version: latest.version,
			title: latest.title,
			body: latest.body,
			ctaLabel: latest.cta_label
		};
	}
	return {
		currency,
		cash: parseMoney(totals[0]?.income) - parseMoney(totals[0]?.expense),
		monthIncome: parseMoney(month[0]?.income),
		monthExpense: parseMoney(month[0]?.expense),
		payable,
		receivable,
		people,
		categories,
		recent: recentRows.map(mapTx),
		notice
	};
});
var listTransactions_createServerFn_handler = createServerRpc({
	id: "88e35282823d111956c7cc26c9b9ef4d4aad782bcd8f414c42f9bd06d17a8358",
	name: "listTransactions",
	filename: "src/lib/money/server.ts"
}, (opts) => listTransactions.__executeServer(opts));
var listTransactions = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listTransactions_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select
        t.id, t.kind, t.source, t.amount, t.category_id, c.name as category_name,
        t.person_id, p.name as person_name, t.split_id, t.note, t.occurred_on, t.created_at
      from transactions t
      left join categories c on c.id = t.category_id
      left join people p on p.id = t.person_id
      where t.user_id = ${context.userId}
      order by t.occurred_on desc, t.created_at desc
      limit 200
    `).map(mapTx);
});
var listPeople_createServerFn_handler = createServerRpc({
	id: "e82a9690ff3f24b182b81b26efd7eb017623e14a50c7ae1c2253e87b6e462da3",
	name: "listPeople",
	filename: "src/lib/money/server.ts"
}, (opts) => listPeople.__executeServer(opts));
var listPeople = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listPeople_createServerFn_handler, async ({ context }) => {
	await ensureWorkspace(context.userId);
	return (await (await getSql())`
      select p.id, p.name, p.note, coalesce(sum(e.delta), 0) as balance
      from people p
      left join ledger_events e on e.person_id = p.id and e.user_id = p.user_id
      where p.user_id = ${context.userId}
      group by p.id, p.name, p.note
      order by p.name asc
    `).map((p) => ({
		id: p.id,
		name: p.name,
		note: p.note,
		balance: parseMoney(p.balance)
	}));
});
var getPersonLedger_createServerFn_handler = createServerRpc({
	id: "3e14896ec3b7561abb0ec1006f29db181a13a54492049fa8cb5c603ff60c04b9",
	name: "getPersonLedger",
	filename: "src/lib/money/server.ts"
}, (opts) => getPersonLedger.__executeServer(opts));
var getPersonLedger = createServerFn({ method: "GET" }).validator(object({ personId: string().min(1) })).middleware([authMiddleware]).handler(getPersonLedger_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const row = (await sql`
      select p.id, p.name, p.note, coalesce(sum(e.delta), 0) as balance
      from people p
      left join ledger_events e on e.person_id = p.id and e.user_id = p.user_id
      where p.user_id = ${context.userId} and p.id = ${data.personId}
      group by p.id, p.name, p.note
    `)[0];
	if (!row) throw new Error("Person not found");
	const lines = await sql`
      select
        e.id, e.delta, e.transaction_id, t.kind, t.source, t.amount, t.note, t.occurred_on
      from ledger_events e
      join transactions t on t.id = e.transaction_id
      where e.user_id = ${context.userId} and e.person_id = ${data.personId}
      order by t.occurred_on desc, e.created_at desc
    `;
	return {
		person: {
			id: row.id,
			name: row.name,
			note: row.note,
			balance: parseMoney(row.balance)
		},
		lines: lines.map((l) => ({
			id: l.id,
			delta: parseMoney(l.delta),
			transactionId: l.transaction_id,
			kind: l.kind,
			source: l.source,
			amount: parseMoney(l.amount),
			note: l.note,
			occurredOn: String(l.occurred_on).slice(0, 10)
		}))
	};
});
var createPerson_createServerFn_handler = createServerRpc({
	id: "77ac553f5b3435cadbfeb8d8fb4c588e49c1ac98818a2e4300495bccb13bde5d",
	name: "createPerson",
	filename: "src/lib/money/server.ts"
}, (opts) => createPerson.__executeServer(opts));
var createPerson = createServerFn({ method: "POST" }).validator(object({
	name: string().trim().min(1).max(80),
	note: string().trim().max(200).optional()
})).middleware([authMiddleware]).handler(createPerson_createServerFn_handler, async ({ context, data }) => {
	await ensureWorkspace(context.userId);
	const sql = await getSql();
	const id = crypto.randomUUID();
	await sql`
      insert into people (id, user_id, name, note)
      values (${id}, ${context.userId}, ${data.name}, ${data.note ?? null})
    `;
	return {
		id,
		name: data.name,
		note: data.note ?? null,
		balance: 0
	};
});
var deletePerson_createServerFn_handler = createServerRpc({
	id: "d7d89ea25455090a7b6b712d26bf9c91898ff0cd5ec2b2d3a80436e8253398f4",
	name: "deletePerson",
	filename: "src/lib/money/server.ts"
}, (opts) => deletePerson.__executeServer(opts));
var deletePerson = createServerFn({ method: "POST" }).validator(object({ personId: string().min(1) })).middleware([authMiddleware]).handler(deletePerson_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const bal = await sql`
      select coalesce(sum(delta), 0) as balance
      from ledger_events
      where user_id = ${context.userId} and person_id = ${data.personId}
    `;
	if (parseMoney(bal[0]?.balance) !== 0) throw new Error("Settle this ledger before removing the person");
	await sql`
      delete from people where id = ${data.personId} and user_id = ${context.userId}
    `;
	return { ok: true };
});
var createEntry_createServerFn_handler = createServerRpc({
	id: "271e4a2e7a7798aa3122ef46b6c46238af51c3764970671edf6c0b7baa89312e",
	name: "createEntry",
	filename: "src/lib/money/server.ts"
}, (opts) => createEntry.__executeServer(opts));
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
})).middleware([authMiddleware]).handler(createEntry_createServerFn_handler, async ({ context, data }) => {
	await ensureWorkspace(context.userId);
	const plan = planEntry({
		mode: data.mode,
		amount: data.amount,
		personId: data.personId,
		personIds: data.personIds
	});
	const sql = await getSql();
	const userId = context.userId;
	const ownedPeople = new Set((await sql`
          select id from people where user_id = ${userId}
        `).map((p) => p.id));
	for (const row of plan.ledger) if (!ownedPeople.has(row.personId)) throw new Error("Unknown person");
	if (data.categoryId) {
		if (!(await sql`
        select id from categories where id = ${data.categoryId} and user_id = ${userId}
      `)[0]) throw new Error("Unknown category");
	}
	const txnId = crypto.randomUUID();
	let splitId = null;
	if (plan.source === "split" && data.personIds) {
		splitId = crypto.randomUUID();
		await sql`
        insert into splits (id, user_id, total, my_share)
        values (${splitId}, ${userId}, ${plan.cashAmount}, ${plan.myShare ?? 0})
      `;
		await sql`
        insert into split_shares (id, split_id, user_id, person_id, share)
        values (${crypto.randomUUID()}, ${splitId}, ${userId}, ${null}, ${plan.myShare ?? 0})
      `;
		for (const row of plan.ledger) await sql`
          insert into split_shares (id, split_id, user_id, person_id, share)
          values (${crypto.randomUUID()}, ${splitId}, ${userId}, ${row.personId}, ${row.delta})
        `;
	}
	const primaryPerson = data.personId ?? (plan.ledger.length === 1 ? plan.ledger[0]?.personId : null) ?? null;
	await sql`
      insert into transactions (
        id, user_id, kind, source, amount, category_id, person_id, split_id, note, occurred_on
      ) values (
        ${txnId}, ${userId}, ${plan.kind}, ${plan.source}, ${plan.cashAmount},
        ${data.categoryId ?? null}, ${primaryPerson}, ${splitId},
        ${data.note ?? null}, ${data.occurredOn}
      )
    `;
	for (const row of plan.ledger) await sql`
        insert into ledger_events (id, user_id, person_id, transaction_id, delta)
        values (${crypto.randomUUID()}, ${userId}, ${row.personId}, ${txnId}, ${row.delta})
      `;
	return { id: txnId };
});
var deleteTransaction_createServerFn_handler = createServerRpc({
	id: "86b5aef9d7923c193c59c9affb402c483f377848e47815d59e368f3718fec8cc",
	name: "deleteTransaction",
	filename: "src/lib/money/server.ts"
}, (opts) => deleteTransaction.__executeServer(opts));
var deleteTransaction = createServerFn({ method: "POST" }).validator(object({ id: string().min(1) })).middleware([authMiddleware]).handler(deleteTransaction_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const txn = (await sql`
      select id, split_id from transactions
      where id = ${data.id} and user_id = ${context.userId}
    `)[0];
	if (!txn) throw new Error("Transaction not found");
	await sql`
      delete from ledger_events
      where transaction_id = ${txn.id} and user_id = ${context.userId}
    `;
	if (txn.split_id) {
		await sql`
        delete from split_shares where split_id = ${txn.split_id} and user_id = ${context.userId}
      `;
		await sql`
        delete from splits where id = ${txn.split_id} and user_id = ${context.userId}
      `;
	}
	await sql`
      delete from transactions where id = ${txn.id} and user_id = ${context.userId}
    `;
	return { ok: true };
});
var dismissNotice_createServerFn_handler = createServerRpc({
	id: "858578a0968df950d9ed66d13a07843710cc8bacf91a7c5dfd97a9fbcbdbed99",
	name: "dismissNotice",
	filename: "src/lib/money/server.ts"
}, (opts) => dismissNotice.__executeServer(opts));
var dismissNotice = createServerFn({ method: "POST" }).validator(object({ version: string().min(1) })).middleware([authMiddleware]).handler(dismissNotice_createServerFn_handler, async ({ context, data }) => {
	await ensureWorkspace(context.userId);
	await (await getSql())`
      update profiles
      set dismissed_version = ${data.version}
      where user_id = ${context.userId}
    `;
	return { ok: true };
});
var submitFeedback_createServerFn_handler = createServerRpc({
	id: "5c691a7790ffa5bb3f379e4f5130d48c87fc5af4d4686361b367af591ef58dc2",
	name: "submitFeedback",
	filename: "src/lib/money/server.ts"
}, (opts) => submitFeedback.__executeServer(opts));
var submitFeedback = createServerFn({ method: "POST" }).validator(object({ message: string().trim().min(4).max(2e3) })).middleware([authMiddleware]).handler(submitFeedback_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`
      insert into feedback (user_id, message) values (${context.userId}, ${data.message})
    `;
	return { ok: true };
});
var setCurrency_createServerFn_handler = createServerRpc({
	id: "d793291a1bf5fba4753326a837d054a18b6393f19dbbc4b05ca5bdb570506225",
	name: "setCurrency",
	filename: "src/lib/money/server.ts"
}, (opts) => setCurrency.__executeServer(opts));
var setCurrency = createServerFn({ method: "POST" }).validator(object({ currency: _enum([
	"BDT",
	"USD",
	"EUR",
	"GBP",
	"INR"
]) })).middleware([authMiddleware]).handler(setCurrency_createServerFn_handler, async ({ context, data }) => {
	await ensureWorkspace(context.userId);
	await (await getSql())`
      update profiles set currency = ${data.currency} where user_id = ${context.userId}
    `;
	return { ok: true };
});
var monthBreakdown_createServerFn_handler = createServerRpc({
	id: "8965312a28af4257f8383071dfcdc228a5ca517b0d47d235834165c3c1092072",
	name: "monthBreakdown",
	filename: "src/lib/money/server.ts"
}, (opts) => monthBreakdown.__executeServer(opts));
var monthBreakdown = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(monthBreakdown_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select coalesce(c.name, 'Other') as name, coalesce(sum(t.amount), 0) as total
      from transactions t
      left join categories c on c.id = t.category_id
      where t.user_id = ${context.userId}
        and t.kind = 'expense'
        and t.occurred_on >= ${monthStartISO()}
      group by coalesce(c.name, 'Other')
      order by total desc
    `).map((r) => ({
		name: r.name,
		total: parseMoney(r.total)
	}));
});
//#endregion
export { createEntry_createServerFn_handler, createPerson_createServerFn_handler, deletePerson_createServerFn_handler, deleteTransaction_createServerFn_handler, dismissNotice_createServerFn_handler, getOverview_createServerFn_handler, getPersonLedger_createServerFn_handler, listPeople_createServerFn_handler, listTransactions_createServerFn_handler, monthBreakdown_createServerFn_handler, setCurrency_createServerFn_handler, submitFeedback_createServerFn_handler };
