import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { formatMoney } from "@/lib/money/format";
import { moneyKey, useBreakdown, useOverview } from "@/lib/money/hooks";
import { setCurrency } from "@/lib/money/server";
import { APP_VERSION } from "@/lib/money/version";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/more")({ component: MorePage });

const CURRENCIES = ["BDT", "USD", "EUR", "GBP", "INR"] as const;

function MorePage() {
  const user = useCurrentUser();
  const { data } = useOverview();
  const { data: bars } = useBreakdown();
  const qc = useQueryClient();
  const max = Math.max(1, ...(bars ?? []).map((b) => b.total));

  return (
    <AppShell>
      <div className="px-5 pt-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight">More</h1>
        <div className="mt-6 rounded-3xl bg-card px-4 py-4">
          <p className="text-sm font-medium">{user?.displayName ?? "You"}</p>
          <p className="text-xs text-muted">{user?.primaryEmail ?? "Private ledger"}</p>
          <div className="mt-3">
            <UserButton />
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-sm font-medium">This month</h2>
          {!bars || bars.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Spend a little and a breakdown will appear.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {bars.map((row) => (
                <li key={row.name}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span>{row.name}</span>
                    <span className="tabular-nums text-muted">
                      {formatMoney(row.total, data?.currency ?? "BDT")}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-card">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.round((row.total / max) * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-medium">Currency</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {CURRENCIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={async () => {
                  await setCurrency({ data: { currency: c } });
                  await qc.invalidateQueries({ queryKey: moneyKey.overview });
                }}
                className={cn(
                  "h-9 rounded-full px-3 text-xs font-medium",
                  data?.currency === c ? "bg-foreground text-background" : "bg-card text-muted",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl bg-card">
          <Link
            to="/about"
            className="flex items-center justify-between px-4 py-4 text-sm"
          >
            About and developer
            <ChevronRight className="size-4 text-muted" />
          </Link>
          <div className="h-px bg-border" />
          <div className="px-4 py-4">
            <p className="text-sm font-medium">Install on your phone</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              iPhone: tap Share, then Add to Home Screen. Android: Chrome menu, then Add to Home
              screen. Opens full-screen like a native wallet.
            </p>
          </div>
        </section>

        <p className="mt-6 text-center text-[11px] text-subtle">Version {APP_VERSION}</p>
      </div>
    </AppShell>
  );
}
