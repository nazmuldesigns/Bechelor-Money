import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { formatDateLabel, formatMoney } from "@/lib/money/format";
import { useMoneyMutations, useOverview, usePerson } from "@/lib/money/hooks";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/people/$personId")({ component: PersonPage });

function PersonPage() {
  const { personId } = Route.useParams();
  const { data: overview } = useOverview();
  const { data, isPending, error } = usePerson(personId);
  const { removePerson } = useMoneyMutations();
  const navigate = useNavigate();
  const currency = overview?.currency ?? "BDT";

  return (
    <AppShell>
      <div className="px-5 pt-6">
        <Link to="/people" className="inline-flex items-center gap-1 text-sm text-muted">
          <ArrowLeft className="size-4" />
          People
        </Link>

        {isPending ? (
          <div className="mt-8 h-32 animate-pulse rounded-3xl bg-card" />
        ) : error || !data ? (
          <p className="mt-8 text-sm text-danger">Could not load this person.</p>
        ) : (
          <>
            <section className="mt-6 rounded-3xl bg-card px-5 py-6">
              <p className="text-xs font-medium uppercase tracking-widest text-muted">Ledger</p>
              <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
                {data.person.name}
              </h1>
              <p
                className={cn(
                  "mt-4 font-display text-4xl font-semibold tabular-nums tracking-tight",
                  data.person.balance > 0
                    ? "text-primary"
                    : data.person.balance < 0
                      ? "text-danger"
                      : "text-muted",
                )}
              >
                {data.person.balance === 0
                  ? "Settled"
                  : formatMoney(Math.abs(data.person.balance), currency)}
              </p>
              <p className="mt-2 text-sm text-muted">
                {data.person.balance > 0
                  ? "They owe you"
                  : data.person.balance < 0
                    ? "You owe them"
                    : "Nothing open"}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Link
                  to="/add"
                  search={{ person: personId, mode: data.person.balance < 0 ? "repay" : "lend" }}
                  className="flex h-11 items-center justify-center rounded-xl bg-foreground text-sm font-medium text-background"
                >
                  {data.person.balance < 0 ? "Pay back" : "Lend / cover"}
                </Link>
                <Link
                  to="/add"
                  search={{ person: personId, mode: data.person.balance > 0 ? "collect" : "borrow" }}
                  className="flex h-11 items-center justify-center rounded-xl bg-card-2 text-sm font-medium"
                >
                  {data.person.balance > 0 ? "Collect" : "Borrow"}
                </Link>
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-sm font-medium">History</h2>
              {data.lines.length === 0 ? (
                <p className="mt-4 text-sm text-muted">No ledger events yet.</p>
              ) : (
                <ul className="mt-3 divide-y divide-border">
                  {data.lines.map((line) => (
                    <li key={line.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {line.note || line.source}
                        </p>
                        <p className="text-xs text-muted">
                          {formatDateLabel(line.occurredOn)} · {line.kind}
                        </p>
                      </div>
                      <p
                        className={cn(
                          "text-sm font-medium tabular-nums",
                          line.delta > 0 ? "text-primary" : "text-danger",
                        )}
                      >
                        {line.delta > 0 ? "+" : "−"}
                        {formatMoney(Math.abs(line.delta), currency)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <Button
              variant="ghost"
              className="mt-8 w-full text-danger"
              onClick={async () => {
                try {
                  await removePerson.mutateAsync(personId);
                  navigate({ to: "/people" });
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Could not remove");
                }
              }}
            >
              Remove person
            </Button>
          </>
        )}
      </div>
    </AppShell>
  );
}
