import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { TxnRow } from "@/components/money/txn-row";
import { UpdateModal } from "@/components/money/update-modal";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { formatMoney } from "@/lib/money/format";
import { useMoneyMutations, useOverview } from "@/lib/money/hooks";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const user = useCurrentUser();
  const { data, isPending, error, refetch } = useOverview();
  const { removeTxn } = useMoneyMutations();
  const first = (user?.displayName || "there").split(" ")[0];

  return (
    <AppShell>
      <div className="px-5 pt-8 pb-4">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/80">
              Bachelor Money
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
              hey, {first.toLowerCase()}
            </h1>
          </div>
          <div className="grid size-11 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-primary/30 to-card text-sm font-medium ring-1 ring-primary/20">
            {user?.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="" className="size-full object-cover" />
            ) : (
              first.slice(0, 1).toUpperCase()
            )}
          </div>
        </header>

        {isPending ? (
          <div className="mt-8 h-40 animate-pulse rounded-3xl bg-card" />
        ) : error ? (
          <p className="mt-8 text-sm text-danger">Could not load your ledger.</p>
        ) : data ? (
          <>
            <section className="rise-in mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-primary/10 px-5 py-6 ring-1 ring-border">
              <p className="text-xs font-medium uppercase tracking-widest text-muted">
                This month
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] text-muted">Income</p>
                  <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-primary">
                    {formatMoney(data.monthIncome, data.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted">Expense</p>
                  <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-danger">
                    {formatMoney(data.monthExpense, data.currency)}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-card-2/80 px-3 py-3">
                <span className="text-xs text-muted">Net (income − expense)</span>
                <span
                  className={cn(
                    "font-display text-lg font-semibold tabular-nums",
                    data.monthIncome - data.monthExpense < 0 ? "text-danger" : "text-primary",
                  )}
                >
                  {formatMoney(data.monthIncome - data.monthExpense, data.currency)}
                </span>
              </div>
            </section>

            <section className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-3xl bg-card px-4 py-4 ring-1 ring-border">
                <p className="text-[11px] text-muted">Today · in</p>
                <p className="mt-1 font-display text-xl font-semibold tabular-nums text-primary">
                  {formatMoney(data.dayIncome, data.currency)}
                </p>
              </div>
              <div className="rounded-3xl bg-card px-4 py-4 ring-1 ring-border">
                <p className="text-[11px] text-muted">Today · out</p>
                <p className="mt-1 font-display text-xl font-semibold tabular-nums text-danger">
                  {formatMoney(data.dayExpense, data.currency)}
                </p>
              </div>
            </section>

            <section className="mt-4 rounded-3xl bg-card px-4 py-4 ring-1 ring-border">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-widest text-muted">
                  Debt this month
                </p>
                <Link to="/people" className="text-[11px] text-primary">
                  People
                </Link>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <MiniStat label="Borrowed" value={formatMoney(data.monthBorrow, data.currency)} />
                <MiniStat label="Repaid" value={formatMoney(data.monthRepay, data.currency)} />
                <MiniStat label="Lent" value={formatMoney(data.monthLend, data.currency)} />
                <MiniStat label="Collected" value={formatMoney(data.monthCollect, data.currency)} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3">
                <Link to="/people" className="rounded-2xl bg-card-2 px-3 py-3">
                  <p className="text-[11px] text-muted">You owe</p>
                  <p className="mt-0.5 font-display text-lg font-semibold tabular-nums text-danger">
                    {formatMoney(data.payable, data.currency)}
                  </p>
                </Link>
                <Link to="/people" className="rounded-2xl bg-card-2 px-3 py-3">
                  <p className="text-[11px] text-muted">Owed to you</p>
                  <p className="mt-0.5 font-display text-lg font-semibold tabular-nums text-primary">
                    {formatMoney(data.receivable, data.currency)}
                  </p>
                </Link>
              </div>
            </section>

            {data.people.filter((p) => p.balance !== 0).length > 0 ? (
              <section className="mt-8">
                <div className="flex items-end justify-between">
                  <h2 className="text-sm font-medium">Open balances</h2>
                  <Link to="/people" className="text-xs text-primary">
                    See all
                  </Link>
                </div>
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {data.people
                    .filter((p) => p.balance !== 0)
                    .slice(0, 8)
                    .map((p) => (
                      <Link
                        key={p.id}
                        to="/people/$personId"
                        params={{ personId: p.id }}
                        className="min-w-28 shrink-0 rounded-2xl bg-card px-3 py-3 ring-1 ring-border"
                      >
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p
                          className={cn(
                            "mt-1 text-xs tabular-nums",
                            p.balance > 0 ? "text-primary" : "text-danger",
                          )}
                        >
                          {p.balance > 0 ? "gets " : "you owe "}
                          {formatMoney(Math.abs(p.balance), data.currency)}
                        </p>
                      </Link>
                    ))}
                </div>
              </section>
            ) : null}

            <section className="mt-8">
              <div className="flex items-end justify-between">
                <h2 className="text-sm font-medium">Recent</h2>
                <Link to="/activity" className="text-xs text-primary">
                  Activity
                </Link>
              </div>
              {data.recent.length === 0 ? (
                <p className="mt-6 text-sm leading-relaxed text-muted">
                  Nothing yet. Tap + to log spend, borrow, or repay.
                </p>
              ) : (
                <div className="mt-2 divide-y divide-border">
                  {data.recent.map((txn) => (
                    <TxnRow
                      key={txn.id}
                      txn={txn}
                      currency={data.currency}
                      onDelete={() => removeTxn.mutate(txn.id)}
                    />
                  ))}
                </div>
              )}
            </section>

            <UpdateModal notice={data.notice} onDismissed={() => refetch()} />
          </>
        ) : null}
      </div>
    </AppShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card-2 px-3 py-2.5">
      <p className="text-[11px] text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-medium tabular-nums">{value}</p>
    </div>
  );
}
