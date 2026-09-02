import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { DEFAULT_EXPENSE, DEFAULT_INCOME } from "./categories";
import { planEntry, type EntryMode } from "./engine";
import { APP_VERSION } from "./version";
import { compareSemver, parseMoney } from "./format";
import type {
  Category,
  LedgerLine,
  Notice,
  Overview,
  Person,
  PersonDetail,
  Transaction,
} from "./types";

function monthStartISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function ensureWorkspace(userId: string, displayName?: string | null) {
  const sql = await getSql();
  await sql`
    insert into profiles (user_id, display_name)
    values (${userId}, ${displayName ?? null})
    on conflict (user_id) do nothing
  `;
  const existing = await sql<{ n: number }>`
    select count(*)::int as n from categories where user_id = ${userId}
  `;
  if ((existing[0]?.n ?? 0) === 0) {
    for (const name of DEFAULT_EXPENSE) {
      await sql`
        insert into categories (id, user_id, name, kind)
        values (${crypto.randomUUID()}, ${userId}, ${name}, ${"expense"})
      `;
    }
    for (const name of DEFAULT_INCOME) {
      await sql`
        insert into categories (id, user_id, name, kind)
        values (${crypto.randomUUID()}, ${userId}, ${name}, ${"income"})
      `;
    }
  }
}

function mapTx(row: {
  id: string;
  kind: string;
  source: string;
  amount: unknown;
  category_id: string | null;
  category_name: string | null;
  person_id: string | null;
  person_name: string | null;
  split_id: string | null;
  note: string | null;
  occurred_on: string;
  created_at: string;
}): Transaction {
  return {
    id: row.id,
    kind: row.kind as Transaction["kind"],
    source: row.source as Transaction["source"],
    amount: parseMoney(row.amount),
    categoryId: row.category_id,
    categoryName: row.category_name,
    personId: row.person_id,
    personName: row.person_name,
    splitId: row.split_id,
    note: row.note,
    occurredOn: String(row.occurred_on).slice(0, 10),
    createdAt: row.created_at,
  };
}

export const getOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Overview> => {
    const userId = context.userId;
    await ensureWorkspace(userId);
    const sql = await getSql();

    const profile = await sql<{ currency: string; dismissed_version: string | null }>`
      select currency, dismissed_version from profiles where user_id = ${userId}
    `;
    const currency = profile[0]?.currency ?? "BDT";
    const dismissed = profile[0]?.dismissed_version ?? null;

    const totals = await sql<{ income: unknown; expense: unknown }>`
      select
        coalesce(sum(case when kind = 'income' then amount else 0 end), 0) as income,
        coalesce(sum(case when kind = 'expense' then amount else 0 end), 0) as expense
      from transactions
      where user_id = ${userId}
    `;
    const month = await sql<{ income: unknown; expense: unknown }>`
      select
        coalesce(sum(case when kind = 'income' then amount else 0 end), 0) as income,
        coalesce(sum(case when kind = 'expense' then amount else 0 end), 0) as expense
      from transactions
      where user_id = ${userId} and occurred_on >= ${monthStartISO()}
    `;

    const peopleRows = await sql<{
      id: string;
      name: string;
      note: string | null;
      balance: unknown;
    }>`
      select p.id, p.name, p.note, coalesce(sum(e.delta), 0) as balance
      from people p
      left join ledger_events e on e.person_id = p.id and e.user_id = p.user_id
      where p.user_id = ${userId}
      group by p.id, p.name, p.note
      order by p.name asc
    `;
    const people: Person[] = peopleRows.map((p) => ({
      id: p.id,
      name: p.name,
      note: p.note,
      balance: parseMoney(p.balance),
    }));

    const payable = people.reduce((s, p) => s + (p.balance < 0 ? -p.balance : 0), 0);
    const receivable = people.reduce((s, p) => s + (p.balance > 0 ? p.balance : 0), 0);

    const catRows = await sql<{ id: string; name: string; kind: string }>`
      select id, name, kind from categories where user_id = ${userId} order by kind, name
    `;
    const categories: Category[] = catRows.map((c) => ({
      id: c.id,
      name: c.name,
      kind: c.kind as Category["kind"],
    }));

    const recentRows = await sql<{
      id: string;
      kind: string;
      source: string;
      amount: unknown;
      category_id: string | null;
      category_name: string | null;
      person_id: string | null;
      person_name: string | null;
      split_id: string | null;
      note: string | null;
      occurred_on: string;
      created_at: string;
    }>`
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

    const notices = await sql<{
      version: string;
      title: string;
      body: string;
      cta_label: string | null;
    }>`
      select version, title, body, cta_label from app_notices order by created_at desc limit 1
    `;
    let notice: Notice | null = null;
    const latest = notices[0];
    if (latest && compareSemver(latest.version, APP_VERSION) > 0) {
      if (!dismissed || compareSemver(latest.version, dismissed) > 0) {
        notice = {
          version: latest.version,
          title: latest.title,
          body: latest.body,
          ctaLabel: latest.cta_label,
        };
      }
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
      notice,
    };
  });

export const listTransactions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Transaction[]> => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      kind: string;
      source: string;
      amount: unknown;
      category_id: string | null;
      category_name: string | null;
      person_id: string | null;
      person_name: string | null;
      split_id: string | null;
      note: string | null;
      occurred_on: string;
      created_at: string;
    }>`
      select
        t.id, t.kind, t.source, t.amount, t.category_id, c.name as category_name,
        t.person_id, p.name as person_name, t.split_id, t.note, t.occurred_on, t.created_at
      from transactions t
      left join categories c on c.id = t.category_id
      left join people p on p.id = t.person_id
      where t.user_id = ${context.userId}
      order by t.occurred_on desc, t.created_at desc
      limit 200
    `;
    return rows.map(mapTx);
  });

export const listPeople = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Person[]> => {
    await ensureWorkspace(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      name: string;
      note: string | null;
      balance: unknown;
    }>`
      select p.id, p.name, p.note, coalesce(sum(e.delta), 0) as balance
      from people p
      left join ledger_events e on e.person_id = p.id and e.user_id = p.user_id
      where p.user_id = ${context.userId}
      group by p.id, p.name, p.note
      order by p.name asc
    `;
    return rows.map((p) => ({
      id: p.id,
      name: p.name,
      note: p.note,
      balance: parseMoney(p.balance),
    }));
  });

export const getPersonLedger = createServerFn({ method: "GET" })
  .validator(z.object({ personId: z.string().min(1) }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<PersonDetail> => {
    const sql = await getSql();
    const people = await sql<{
      id: string;
      name: string;
      note: string | null;
      balance: unknown;
    }>`
      select p.id, p.name, p.note, coalesce(sum(e.delta), 0) as balance
      from people p
      left join ledger_events e on e.person_id = p.id and e.user_id = p.user_id
      where p.user_id = ${context.userId} and p.id = ${data.personId}
      group by p.id, p.name, p.note
    `;
    const row = people[0];
    if (!row) throw new Error("Person not found");
    const lines = await sql<{
      id: string;
      delta: unknown;
      transaction_id: string;
      kind: string;
      source: string;
      amount: unknown;
      note: string | null;
      occurred_on: string;
    }>`
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
        balance: parseMoney(row.balance),
      },
      lines: lines.map(
        (l): LedgerLine => ({
          id: l.id,
          delta: parseMoney(l.delta),
          transactionId: l.transaction_id,
          kind: l.kind as LedgerLine["kind"],
          source: l.source as LedgerLine["source"],
          amount: parseMoney(l.amount),
          note: l.note,
          occurredOn: String(l.occurred_on).slice(0, 10),
        }),
      ),
    };
  });

export const createPerson = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().trim().min(1).max(80),
      note: z.string().trim().max(200).optional(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    await ensureWorkspace(context.userId);
    const sql = await getSql();
    const id = crypto.randomUUID();
    await sql`
      insert into people (id, user_id, name, note)
      values (${id}, ${context.userId}, ${data.name}, ${data.note ?? null})
    `;
    return { id, name: data.name, note: data.note ?? null, balance: 0 } satisfies Person;
  });

export const deletePerson = createServerFn({ method: "POST" })
  .validator(z.object({ personId: z.string().min(1) }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const bal = await sql<{ balance: unknown }>`
      select coalesce(sum(delta), 0) as balance
      from ledger_events
      where user_id = ${context.userId} and person_id = ${data.personId}
    `;
    if (parseMoney(bal[0]?.balance) !== 0) {
      throw new Error("Settle this ledger before removing the person");
    }
    await sql`
      delete from people where id = ${data.personId} and user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const createEntry = createServerFn({ method: "POST" })
  .validator(
    z.object({
      mode: z.enum(["spend", "income", "borrow", "lend", "repay", "collect", "split"]),
      amount: z.number().positive(),
      categoryId: z.string().optional(),
      personId: z.string().optional(),
      personIds: z.array(z.string()).optional(),
      note: z.string().trim().max(240).optional(),
      occurredOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    await ensureWorkspace(context.userId);
    const plan = planEntry({
      mode: data.mode as EntryMode,
      amount: data.amount,
      personId: data.personId,
      personIds: data.personIds,
    });
    const sql = await getSql();
    const userId = context.userId;

    const ownedPeople = new Set(
      (
        await sql<{ id: string }>`
          select id from people where user_id = ${userId}
        `
      ).map((p) => p.id),
    );
    for (const row of plan.ledger) {
      if (!ownedPeople.has(row.personId)) throw new Error("Unknown person");
    }
    if (data.categoryId) {
      const cat = await sql<{ id: string }>`
        select id from categories where id = ${data.categoryId} and user_id = ${userId}
      `;
      if (!cat[0]) throw new Error("Unknown category");
    }

    const txnId = crypto.randomUUID();
    let splitId: string | null = null;
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
      for (const row of plan.ledger) {
        await sql`
          insert into split_shares (id, split_id, user_id, person_id, share)
          values (${crypto.randomUUID()}, ${splitId}, ${userId}, ${row.personId}, ${row.delta})
        `;
      }
    }

    const primaryPerson =
      data.personId ?? (plan.ledger.length === 1 ? plan.ledger[0]?.personId : null) ?? null;

    await sql`
      insert into transactions (
        id, user_id, kind, source, amount, category_id, person_id, split_id, note, occurred_on
      ) values (
        ${txnId}, ${userId}, ${plan.kind}, ${plan.source}, ${plan.cashAmount},
        ${data.categoryId ?? null}, ${primaryPerson}, ${splitId},
        ${data.note ?? null}, ${data.occurredOn}
      )
    `;

    for (const row of plan.ledger) {
      await sql`
        insert into ledger_events (id, user_id, person_id, transaction_id, delta)
        values (${crypto.randomUUID()}, ${userId}, ${row.personId}, ${txnId}, ${row.delta})
      `;
    }

    return { id: txnId };
  });

export const deleteTransaction = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1) }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{ id: string; split_id: string | null }>`
      select id, split_id from transactions
      where id = ${data.id} and user_id = ${context.userId}
    `;
    const txn = rows[0];
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

export const dismissNotice = createServerFn({ method: "POST" })
  .validator(z.object({ version: z.string().min(1) }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    await ensureWorkspace(context.userId);
    const sql = await getSql();
    await sql`
      update profiles
      set dismissed_version = ${data.version}
      where user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const submitFeedback = createServerFn({ method: "POST" })
  .validator(z.object({ message: z.string().trim().min(4).max(2000) }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into feedback (user_id, message) values (${context.userId}, ${data.message})
    `;
    return { ok: true };
  });

export const setCurrency = createServerFn({ method: "POST" })
  .validator(z.object({ currency: z.enum(["BDT", "USD", "EUR", "GBP", "INR"]) }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    await ensureWorkspace(context.userId);
    const sql = await getSql();
    await sql`
      update profiles set currency = ${data.currency} where user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const monthBreakdown = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ name: string; total: unknown }>`
      select coalesce(c.name, 'Other') as name, coalesce(sum(t.amount), 0) as total
      from transactions t
      left join categories c on c.id = t.category_id
      where t.user_id = ${context.userId}
        and t.kind = 'expense'
        and t.occurred_on >= ${monthStartISO()}
      group by coalesce(c.name, 'Other')
      order by total desc
    `;
    return rows.map((r) => ({ name: r.name, total: parseMoney(r.total) }));
  });
