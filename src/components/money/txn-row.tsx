import { ArrowDownLeft, ArrowUpRight, Layers, Landmark } from "lucide-react";
import { formatDateLabel, formatMoney } from "@/lib/money/format";
import type { Transaction } from "@/lib/money/types";
import { cn } from "@/lib/utils";

const SOURCE_LABEL: Record<Transaction["source"], string> = {
  plain: "",
  borrow: "Borrowed",
  lend: "Lent",
  repay: "Paid for",
  collect: "Collected",
  split: "Split",
};

export function TxnRow({
  txn,
  currency,
  onDelete,
}: {
  txn: Transaction;
  currency: string;
  onDelete?: () => void;
}) {
  const inflow = txn.kind === "income";
  const title =
    txn.note ||
    txn.categoryName ||
    SOURCE_LABEL[txn.source] ||
    (inflow ? "Income" : "Expense");
  const meta = [
    SOURCE_LABEL[txn.source] || (inflow ? "In" : "Out"),
    txn.personName,
    formatDateLabel(txn.occurredOn),
  ]
    .filter(Boolean)
    .join(" · ");

  const Icon =
    txn.source === "split"
      ? Layers
      : txn.source === "borrow" || txn.source === "lend"
        ? Landmark
        : inflow
          ? ArrowDownLeft
          : ArrowUpRight;

  return (
    <div className="flex items-center gap-3 py-3">
      <div
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-2xl",
          inflow ? "bg-primary/15 text-primary" : "bg-danger/12 text-danger",
        )}
      >
        <Icon className="size-4" strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="truncate text-xs text-muted">{meta}</p>
      </div>
      <div className="text-right">
        <p
          className={cn(
            "font-medium tabular-nums",
            inflow ? "text-primary" : "text-foreground",
          )}
        >
          {inflow ? "+" : "−"}
          {formatMoney(txn.amount, currency)}
        </p>
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="text-[11px] text-muted hover:text-danger"
          >
            Undo
          </button>
        ) : null}
      </div>
    </div>
  );
}
