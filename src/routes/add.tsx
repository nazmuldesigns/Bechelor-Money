import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { describePlan, planEntry, type EntryMode } from "@/lib/money/engine";
import { currencyMark, formatMoney } from "@/lib/money/format";
import { useMoneyMutations, useOverview } from "@/lib/money/hooks";
import { cn } from "@/lib/utils";
import { z } from "zod";

const searchSchema = z.object({
  mode: z
    .enum(["spend", "income", "borrow", "lend", "repay", "collect", "split"])
    .optional(),
  person: z.string().optional(),
});

export const Route = createFileRoute("/add")({
  validateSearch: (search: Record<string, unknown>) => {
    const parsed = searchSchema.safeParse(search);
    return parsed.success ? parsed.data : {};
  },
  component: AddPage,
});

const TABS: { id: EntryMode; label: string }[] = [
  { id: "spend", label: "Spend" },
  { id: "income", label: "Income" },
  { id: "borrow", label: "Borrow" },
  { id: "lend", label: "Lend" },
  { id: "repay", label: "Repay" },
  { id: "collect", label: "Collect" },
  { id: "split", label: "Split" },
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function AddPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { data } = useOverview();
  const { addEntry, addPerson } = useMoneyMutations();
  const [mode, setMode] = useState<EntryMode>(search.mode ?? "spend");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [personId, setPersonId] = useState(search.person ?? "");
  const [personIds, setPersonIds] = useState<string[]>(search.person ? [search.person] : []);
  const [occurredOn, setOccurredOn] = useState(today());
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);

  const currency = data?.currency ?? "BDT";
  const people = data?.people ?? [];
  const cats = (data?.categories ?? []).filter((c) =>
    mode === "income" || mode === "borrow" || mode === "collect" ? c.kind === "income" : c.kind === "expense",
  );

  const numeric = Number(amount);
  const preview = useMemo(() => {
    if (!(numeric > 0)) return null;
    try {
      const plan = planEntry({
        mode,
        amount: numeric,
        personId: personId || undefined,
        personIds: mode === "split" ? personIds : undefined,
      });
      return { plan, lines: describePlan(plan, people) };
    } catch {
      return null;
    }
  }, [numeric, mode, personId, personIds, people]);

  const onSave = async () => {
    if (!(numeric > 0)) {
      toast.error("Enter an amount");
      return;
    }
    setBusy(true);
    try {
      await addEntry.mutateAsync({
        mode,
        amount: numeric,
        categoryId: categoryId || undefined,
        personId: mode === "split" ? undefined : personId || undefined,
        personIds: mode === "split" ? personIds : undefined,
        note: note.trim() || undefined,
        occurredOn,
      });
      toast.success("Saved");
      navigate({ to: "/" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <div className="px-5 pt-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">New entry</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">Add money</h1>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id)}
              className={cn(
                "h-9 shrink-0 rounded-full px-4 text-xs font-medium",
                mode === tab.id ? "bg-foreground text-background" : "bg-card text-muted",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <label className="mt-8 block">
          <span className="text-xs text-muted">Amount</span>
          <div className="mt-2 flex items-baseline gap-2 rounded-3xl bg-card px-4 py-4">
            <span className="font-display text-2xl text-muted">{currencyMark(currency)}</span>
            <input
              data-calc="1"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              className="w-full bg-transparent font-display text-5xl font-semibold tracking-tight tabular-nums outline-none placeholder:text-subtle"
            />
          </div>
        </label>

        {mode === "spend" || mode === "income" || mode === "split" ? (
          <div className="mt-5">
            <p className="text-xs text-muted">Category</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {cats.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategoryId(c.id === categoryId ? "" : c.id)}
                  className={cn(
                    "h-9 rounded-full px-3 text-xs font-medium",
                    categoryId === c.id ? "bg-foreground text-background" : "bg-card text-muted",
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {mode === "spend" || mode === "borrow" || mode === "lend" || mode === "repay" || mode === "collect" ? (
          <PersonSelect
            label={
              mode === "spend"
                ? "Paid for someone (optional)"
                : mode === "borrow"
                  ? "Borrowed from"
                  : mode === "lend"
                    ? "Lent to"
                    : mode === "repay"
                      ? "Paying back"
                      : "Collecting from"
            }
            people={people}
            value={personId}
            onChange={setPersonId}
            newName={newName}
            setNewName={setNewName}
            onCreate={async () => {
              if (!newName.trim()) return;
              const p = await addPerson.mutateAsync({ name: newName.trim() });
              setPersonId(p.id);
              setNewName("");
            }}
          />
        ) : null}

        {mode === "split" ? (
          <div className="mt-5">
            <p className="text-xs text-muted">Split equally with</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {people.map((p) => {
                const on = personIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() =>
                      setPersonIds((ids) =>
                        on ? ids.filter((x) => x !== p.id) : [...ids, p.id],
                      )
                    }
                    className={cn(
                      "h-9 rounded-full px-3 text-xs font-medium",
                      on ? "bg-foreground text-background" : "bg-card text-muted",
                    )}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                placeholder="Add a person"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <Button
                variant="muted"
                onClick={async () => {
                  if (!newName.trim()) return;
                  const p = await addPerson.mutateAsync({ name: newName.trim() });
                  setPersonIds((ids) => [...ids, p.id]);
                  setNewName("");
                }}
              >
                Add
              </Button>
            </div>
            <p className="mt-2 text-xs text-subtle">You are always included in the split.</p>
          </div>
        ) : null}

        <div className="mt-5">
          <p className="text-xs text-muted">Note</p>
          <Input
            className="mt-2"
            placeholder="Optional — lunch, rickshaw, rent…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="mt-5">
          <p className="text-xs text-muted">Date</p>
          <Input
            className="mt-2"
            type="date"
            value={occurredOn}
            onChange={(e) => setOccurredOn(e.target.value)}
          />
        </div>

        {preview?.lines.length ? (
          <div className="mt-6 rounded-3xl bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-widest text-muted">
              Ledger preview
            </p>
            {preview.plan.myShare != null ? (
              <p className="mt-2 text-sm text-muted">
                Your share {formatMoney(preview.plan.myShare, currency)} of{" "}
                {formatMoney(preview.plan.cashAmount, currency)}
              </p>
            ) : null}
            <ul className="mt-3 space-y-2">
              {preview.lines.map((line) => (
                <li key={line.personId} className="flex justify-between text-sm">
                  <span>{line.name}</span>
                  <span className="tabular-nums text-muted">
                    {formatMoney(line.before, currency, { sign: true })}
                    {" → "}
                    <span className={line.after < 0 ? "text-danger" : "text-primary"}>
                      {formatMoney(line.after, currency, { sign: true })}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {mode === "spend" && personId ? (
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Tagging a person on a spend treats it as paying for them — it reduces what you owe,
            or grows what they owe you.
          </p>
        ) : null}

        <Button className="mt-8 w-full" size="lg" onClick={onSave} disabled={busy}>
          {busy ? "Saving…" : "Save"}
        </Button>
      </div>
    </AppShell>
  );
}

function PersonSelect({
  label,
  people,
  value,
  onChange,
  newName,
  setNewName,
  onCreate,
}: {
  label: string;
  people: { id: string; name: string }[];
  value: string;
  onChange: (id: string) => void;
  newName: string;
  setNewName: (v: string) => void;
  onCreate: () => void;
}) {
  return (
    <div className="mt-5">
      <p className="text-xs text-muted">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {people.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id === value ? "" : p.id)}
            className={cn(
              "h-9 rounded-full px-3 text-xs font-medium",
              value === p.id ? "bg-foreground text-background" : "bg-card text-muted",
            )}
          >
            {p.name}
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <Input
          placeholder="New person"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button variant="muted" onClick={onCreate}>
          Add
        </Button>
      </div>
    </div>
  );
}
