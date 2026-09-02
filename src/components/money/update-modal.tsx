import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dismissNotice } from "@/lib/money/server";
import type { Notice } from "@/lib/money/types";
import { APP_VERSION } from "@/lib/money/version";

export function UpdateModal({
  notice,
  onDismissed,
}: {
  notice: Notice | null;
  onDismissed: () => void;
}) {
  if (!notice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/75 p-4 sm:items-center">
      <div className="w-full max-w-app rise-in rounded-3xl bg-card p-6 shadow-lift">
        <div className="grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary">
          <Bell className="size-5" strokeWidth={2} />
        </div>
        <p className="mt-4 text-xs font-medium uppercase tracking-widest text-muted">
          Update {notice.version}
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
          {notice.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{notice.body}</p>
        <p className="mt-3 text-xs text-subtle">You are on {APP_VERSION}</p>
        <Button
          className="mt-6 w-full"
          variant="solid"
          onClick={async () => {
            await dismissNotice({ data: { version: notice.version } });
            onDismissed();
          }}
        >
          {notice.ctaLabel ?? "Got it"}
        </Button>
      </div>
    </div>
  );
}
