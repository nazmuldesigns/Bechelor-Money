import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Calculator as CalcIcon, Delete, Equal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { roundMoney } from "@/lib/money/format";

type CalcCtx = {
  focused: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  apply: (n: number) => void;
  register: (el: HTMLInputElement | null) => void;
};

const Ctx = createContext<CalcCtx | null>(null);

export function useCalculator() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("CalculatorHost missing");
  return ctx;
}

function safeCompute(expr: string): number | null {
  const cleaned = expr.replace(/[^0-9+\-*/(). ]/g, "");
  if (!cleaned.trim()) return null;
  if (!/^[0-9+\-*/(). ]+$/.test(cleaned)) return null;
  try {
    const n = Function(`"use strict"; return (${cleaned})`)();
    if (typeof n !== "number" || !Number.isFinite(n)) return null;
    return roundMoney(n);
  } catch {
    return null;
  }
}

export function CalculatorHost({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [kb, setKb] = useState(0);
  const [expr, setExpr] = useState("0");

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const sync = () => {
      const occluded = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKb(occluded);
    };
    sync();
    vv.addEventListener("resize", sync);
    vv.addEventListener("scroll", sync);
    return () => {
      vv.removeEventListener("resize", sync);
      vv.removeEventListener("scroll", sync);
    };
  }, []);

  useEffect(() => {
    const onFocus = (e: FocusEvent) => {
      const el = e.target;
      if (!(el instanceof HTMLInputElement) && !(el instanceof HTMLTextAreaElement)) return;
      const numeric =
        el.dataset.calc === "1" ||
        el.inputMode === "decimal" ||
        el.inputMode === "numeric" ||
        el.type === "number";
      if (numeric && el instanceof HTMLInputElement) setTarget(el);
    };
    const onBlur = () => {
      window.setTimeout(() => {
        const active = document.activeElement;
        if (active instanceof HTMLInputElement && (active.dataset.calc === "1" || active.inputMode === "decimal")) {
          return;
        }
        if (!open) setTarget(null);
      }, 180);
    };
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", onBlur);
    return () => {
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", onBlur);
    };
  }, [open]);

  const apply = useCallback(
    (n: number) => {
      if (!target) return;
      const next = String(n);
      const proto = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
      proto?.set?.call(target, next);
      target.dispatchEvent(new Event("input", { bubbles: true }));
      target.dispatchEvent(new Event("change", { bubbles: true }));
      setOpen(false);
    },
    [target],
  );

  const register = useCallback((el: HTMLInputElement | null) => {
    if (el) setTarget(el);
  }, []);

  const value = useMemo<CalcCtx>(
    () => ({
      focused: Boolean(target),
      open,
      setOpen,
      apply,
      register,
    }),
    [target, open, apply, register],
  );

  const result = safeCompute(expr);
  const lift = Math.max(kb, 0);
  const showChip = Boolean(target) && !open;

  const tap = (token: string) => {
    setExpr((prev) => {
      if (token === "C") return "0";
      if (token === "⌫") {
        const next = prev.slice(0, -1);
        return next.length ? next : "0";
      }
      if (prev === "0" && /[0-9.]/.test(token)) return token === "." ? "0." : token;
      return prev + token;
    });
  };

  const keys = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "C", "+"];

  return (
    <Ctx.Provider value={value}>
      {children}
      {showChip ? (
        <button
          type="button"
          aria-label="Open calculator"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setExpr(target?.value && target.value !== "" ? target.value : "0");
            setOpen(true);
          }}
          style={{ bottom: lift + 88 }}
          className="fixed left-1/2 z-40 flex size-12 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift"
        >
          <CalcIcon className="size-5" strokeWidth={2} />
        </button>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70">
          <div className="w-full max-w-app rounded-t-3xl bg-card px-4 pb-8 pt-4 shadow-lift">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border-strong" />
            <p className="text-xs font-medium uppercase tracking-widest text-muted">Calculator</p>
            <p className="mt-2 font-display text-3xl font-semibold tabular-nums tracking-tight">
              {expr}
            </p>
            <p className="mt-1 text-sm text-muted tabular-nums">
              {result === null ? "—" : `= ${result}`}
            </p>
            <div className="mt-5 grid grid-cols-4 gap-2">
              {keys.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => tap(k)}
                  className={cn(
                    "h-14 rounded-2xl bg-card-2 text-lg font-medium tabular-nums",
                    (k === "+" || k === "-" || k === "*" || k === "/") && "text-primary",
                    k === "C" && "text-danger",
                  )}
                >
                  {k === "C" ? "C" : k}
                </button>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="muted" onClick={() => tap("⌫")}>
                <Delete className="size-4" />
                Delete
              </Button>
              <Button
                variant="primary"
                disabled={result === null}
                onClick={() => {
                  if (result === null) return;
                  apply(result);
                }}
              >
                <Equal className="size-4" />
                Use result
              </Button>
            </div>
            <Button
              variant="ghost"
              className="mt-2 w-full"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </Ctx.Provider>
  );
}
