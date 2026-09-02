import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { TxnRow } from "@/components/money/txn-row";
import { formatDateLabel } from "@/lib/money/format";
import { useActivity, useMoneyMutations, useOverview } from "@/lib/money/hooks";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/activity")({ component: Activity });

const FILTERS = ["all", "in", "out", "people"] as const;

function Activity() {
  const { data: overview } = useOverview();
  const { data, isPending } = useActivity();
  const { removeTxn } = useMoneyMutations();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const currency = overview?.currency ?? "BDT";

  const filtered = useMemo(() => {
    const rows = data ?? [];
    if (filter === "in") return rows.filter((t) => t.kind === "income");
    if (filter === "out") return rows.filter((t) => t.kind === "expense");
    if (filter === "people") return rows.filter((t) => t.source !== "plain");
    return rows;
  }, [data, filter]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const row of filtered) {
      const list = map.get(row.occurredOn) ?? [];
      list.push(row);
      map.set(row.occurredOn, list);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <AppShell>
      <div className="px-5 pt-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Activity</h1>
        <p className="mt-1 text-sm text-muted">Every move, newest first.</p>

        <div className="mt-5 flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "h-9 shrink-0 rounded-full px-4 text-xs font-medium capitalize",
                filter === f ? "bg-foreground text-background" : "bg-card text-muted",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {isPending ? (
          <div className="mt-8 space-y-3">
            <div className="h-16 animate-pulse rounded-2xl bg-card" />
            <div className="h-16 animate-pulse rounded-2xl bg-card" />
          </div>
        ) : groups.length === 0 ? (
          <p className="mt-10 text-sm text-muted">No activity in this view yet.</p>
        ) : (
          <div className="mt-6 space-y-6">
            {groups.map(([day, rows]) => (
              <section key={day}>
                <h2 className="text-xs font-medium uppercase tracking-widest text-subtle">
                  {formatDateLabel(day)}
                </h2>
                <div className="divide-y divide-border">
                  {rows.map((txn) => (
                    <TxnRow
                      key={txn.id}
                      txn={txn}
                      currency={currency}
                      onDelete={() => removeTxn.mutate(txn.id)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
