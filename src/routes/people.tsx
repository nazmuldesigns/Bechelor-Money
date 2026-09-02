import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/money/format";
import { useMoneyMutations, useOverview } from "@/lib/money/hooks";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/people")({ component: PeoplePage });

function PeoplePage() {
  const { data, isPending } = useOverview();
  const { addPerson, removePerson } = useMoneyMutations();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const currency = data?.currency ?? "BDT";
  const people = data?.people ?? [];

  const onDelete = async (personId: string, personName: string, balance: number) => {
    if (balance !== 0) {
      toast.error("Settle the balance before deleting");
      return;
    }
    if (!confirm(`Remove ${personName}?`)) return;
    try {
      await removePerson.mutateAsync(personId);
      toast.success("Removed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not remove");
    }
  };

  return (
    <AppShell>
      <div className="px-5 pt-8 pb-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight">People</h1>
            <p className="mt-1 text-sm text-muted">ধার ও ধার পরিশোধ — one ledger each.</p>
          </div>
          <Button
            size="icon"
            variant="muted"
            onClick={() => setOpen((v) => !v)}
            aria-label="Add person"
            className="ring-1 ring-border"
          >
            <Plus className="size-5" />
          </Button>
        </div>

        {open ? (
          <form
            className="mt-5 space-y-2 rounded-3xl bg-card p-4 ring-1 ring-border"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!name.trim()) return;
              await addPerson.mutateAsync({ name: name.trim() });
              setName("");
              setOpen(false);
            }}
          >
            <Input
              placeholder="Name — e.g. Rahim, Roommate"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <Button type="submit" className="w-full" disabled={addPerson.isPending}>
              Save person
            </Button>
          </form>
        ) : null}

        {isPending ? (
          <div className="mt-8 h-24 animate-pulse rounded-3xl bg-card" />
        ) : people.length === 0 ? (
          <p className="mt-10 text-sm leading-relaxed text-muted">
            Add the people you borrow from, lend to, or split bills with. Their balance nets
            automatically.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-border">
            {people.map((p) => (
              <li key={p.id} className="flex items-center gap-2 py-3">
                <Link
                  to="/people/$personId"
                  params={{ personId: p.id }}
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-card text-sm font-medium ring-1 ring-border">
                    {p.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{p.name}</span>
                    <span className="block text-xs text-muted">
                      {p.balance > 0
                        ? "owes you"
                        : p.balance < 0
                          ? "you owe"
                          : "settled"}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium tabular-nums",
                      p.balance > 0
                        ? "text-primary"
                        : p.balance < 0
                          ? "text-danger"
                          : "text-muted",
                    )}
                  >
                    {p.balance === 0
                      ? "—"
                      : formatMoney(Math.abs(p.balance), currency)}
                  </span>
                </Link>
                <button
                  type="button"
                  aria-label={`Delete ${p.name}`}
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-xl ring-1 ring-border",
                    p.balance === 0
                      ? "text-danger hover:bg-danger/10"
                      : "text-subtle opacity-40",
                  )}
                  onClick={() => onDelete(p.id, p.name, p.balance)}
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-6 text-xs text-subtle">
          Delete only works when balance is settled (0). Open a person for Pay back / Collect.
        </p>
      </div>
    </AppShell>
  );
}    </AppShell>
  );
}
