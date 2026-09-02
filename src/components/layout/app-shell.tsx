import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  Home,
  Plus,
  Users,
  CircleEllipsis,
} from "lucide-react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { CalculatorHost } from "@/components/money/calculator";
import { LogoMark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const TABS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/activity", label: "Activity", icon: ArrowLeftRight },
  { to: "/add", label: "Add", icon: Plus, fab: true },
  { to: "/people", label: "People", icon: Users },
  { to: "/more", label: "More", icon: CircleEllipsis },
] as const;

function BootScreen() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <LogoMark className="size-12" />
        <p className="font-display text-xl font-semibold tracking-tight">Bachelor Money</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (isPending) return <BootScreen />;
  if (!user) return <RedirectToSignIn />;

  return (
    <CalculatorHost>
      <div className="min-h-dvh bg-background text-foreground">
        <div className="relative mx-auto flex min-h-dvh w-full max-w-app flex-col">
          <div className="flex-1 pb-28">{children}</div>
          <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-app -translate-x-1/2 border-t border-border bg-background/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
            <ul className="grid grid-cols-5 px-2 pt-1">
              {TABS.map((tab) => {
                const active =
                  tab.to === "/"
                    ? pathname === "/"
                    : pathname === tab.to || pathname.startsWith(`${tab.to}/`);
                const Icon = tab.icon;
                if ("fab" in tab && tab.fab) {
                  return (
                    <li key={tab.to} className="flex justify-center">
                      <Link
                        to={tab.to}
                        aria-label="Add"
                        className="relative -top-4 grid size-14 place-items-center rounded-full bg-foreground text-background shadow-lift"
                      >
                        <Plus className="size-6" strokeWidth={2.2} />
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={tab.to}>
                    <Link
                      to={tab.to}
                      className={cn(
                        "flex flex-col items-center gap-1 py-2 text-[11px] font-medium",
                        active ? "text-foreground" : "text-muted",
                      )}
                    >
                      <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
                      {tab.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </CalculatorHost>
  );
}
