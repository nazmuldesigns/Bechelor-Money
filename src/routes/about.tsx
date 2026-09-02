import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail, MessageSquare, Share2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LogoMark } from "@/components/brand/logo";
import { submitFeedback } from "@/lib/money/server";
import { APP_VERSION } from "@/lib/money/version";

export const Route = createFileRoute("/about")({ component: AboutPage });

const DEVELOPER = {
  name: "Md. Nazmul Hasan",
  role: "Lead App Developer / Designer",
  email: "md.nazmul.hasan.contact@gmail.com",
};

function AboutPage() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <AppShell>
      <div className="px-5 pt-6 pb-8">
        <Link to="/more" className="inline-flex items-center gap-1 text-sm text-muted">
          <ArrowLeft className="size-4" />
          More
        </Link>

        <div className="mt-8 flex flex-col items-center text-center">
          <LogoMark className="size-14" />
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">
            Bachelor Money
          </h1>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
            A quiet wallet for students, bachelors, and anyone splitting life with other people.
          </p>
          <p className="mt-2 text-xs text-subtle">Version {APP_VERSION}</p>
        </div>

        <section className="mt-10 rounded-3xl bg-card px-5 py-6">
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            Built by
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
            {DEVELOPER.name}
          </h2>
          <p className="mt-1 text-sm text-muted">{DEVELOPER.role}</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <a
              href={`mailto:${DEVELOPER.email}?subject=Bachelor%20Money`}
              className="flex h-20 flex-col items-center justify-center gap-1.5 rounded-2xl bg-card-2 text-xs font-medium"
            >
              <Mail className="size-4" />
              Email
            </a>
            <a
              href={`https://x.com/intent/tweet?text=${encodeURIComponent("Bachelor Money — cash, debts, splits.")}`}
              target="_blank"
              rel="noreferrer"
              className="flex h-20 flex-col items-center justify-center gap-1.5 rounded-2xl bg-card-2 text-xs font-medium"
            >
              <Share2 className="size-4" />
              Socials
            </a>
            <button
              type="button"
              onClick={() => document.getElementById("feedback")?.scrollIntoView({ behavior: "smooth" })}
              className="flex h-20 flex-col items-center justify-center gap-1.5 rounded-2xl bg-card-2 text-xs font-medium"
            >
              <MessageSquare className="size-4" />
              Feedback
            </button>
          </div>
        </section>

        <section id="feedback" className="mt-8">
          <h2 className="text-sm font-medium">Send feedback</h2>
          <p className="mt-1 text-xs text-muted">
            Ideas, bugs, or a hello — it lands in Nazmul's inbox inside the app.
          </p>
          <Textarea
            className="mt-3"
            placeholder="Tell us what to build next…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            className="mt-3 w-full"
            disabled={busy || sent}
            onClick={async () => {
              setBusy(true);
              try {
                await submitFeedback({ data: { message } });
                setSent(true);
                setMessage("");
                toast.success("Feedback sent");
              } catch (e) {
                toast.error(e instanceof Error ? e.message : "Could not send");
              } finally {
                setBusy(false);
              }
            }}
          >
            {sent ? "Sent" : "Send"}
          </Button>
        </section>
      </div>
    </AppShell>
  );
}
