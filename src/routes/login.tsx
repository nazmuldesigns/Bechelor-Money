import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoMark } from "@/components/brand/logo";

export const Route = createFileRoute("/login")({ component: Login });

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.35 11.1h-9.17v2.98h5.27c-.23 1.5-1.78 4.4-5.27 4.4-3.17 0-5.76-2.62-5.76-5.85s2.59-5.85 5.76-5.85c1.8 0 3.01.77 3.7 1.43l2.52-2.43C16.68 4.3 14.7 3.4 12.18 3.4 7.36 3.4 3.5 7.27 3.5 12.13S7.36 20.86 12.18 20.86c5.24 0 8.7-3.68 8.7-8.86 0-.6-.06-1.05-.15-1.5z"
      />
    </svg>
  );
}

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isPending && user) return <Navigate to="/" />;

  const onEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const res = await authClient.signUp.email({
          email,
          password,
          name: name || email.split("@")[0] || "Friend",
        });
        if (res.error) throw new Error(res.error.message || "Could not create account");
      } else {
        const res = await authClient.signIn.email({ email, password });
        if (res.error) throw new Error(res.error.message || "Could not sign in");
      }
      await authClient.getSession();
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-app flex-col justify-between px-6 py-10">
      <div className="rise-in pt-8">
        <LogoMark className="size-12" />
        <p className="mt-8 text-xs font-medium uppercase tracking-[0.22em] text-muted">
          Bachelor Money
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight">
          Your cash.
          <br />
          Your people.
        </h1>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
          Track spend, borrow, and splits. Everything stays private to your account.
        </p>
      </div>

      <div className="rise-in-delay space-y-3 pb-4">
        {authEnabled ? (
          <>
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                className="w-full"
                variant={p.label === "Google" ? "solid" : "outline"}
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
              >
                {p.label === "Google" ? <GoogleIcon /> : null}
                Continue with {p.label === "Google" ? "Gmail" : p.label}
              </Button>
            ))}

            <div className="flex items-center gap-3 py-2">
              <span className="h-px flex-1 bg-border" />
              <span className="text-[11px] uppercase tracking-widest text-subtle">or email</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={onEmail} className="space-y-2">
              {mode === "up" ? (
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  id="name"
                />
              ) : null}
              <Input
                id="email"
                type="email"
                placeholder="you@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "up" ? "new-password" : "current-password"}
                minLength={8}
                required
              />
              {error ? <p className="text-xs text-danger">{error}</p> : null}
              <Button type="submit" variant="muted" className="w-full" disabled={busy}>
                {busy ? "Please wait…" : mode === "up" ? "Create account" : "Sign in with email"}
              </Button>
            </form>
            <button
              type="button"
              className="w-full py-2 text-center text-xs text-muted"
              onClick={() => {
                setMode(mode === "up" ? "in" : "up");
                setError(null);
              }}
            >
              {mode === "up" ? "Already have an account? Sign in" : "New here? Create an account"}
            </button>
          </>
        ) : (
          <p className="text-sm text-muted">Sign-in is disabled.</p>
        )}
      </div>
    </main>
  );
}
