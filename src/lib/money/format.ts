const CURRENCY_MARK: Record<string, string> = {
  BDT: "৳",
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
};

export function currencyMark(code = "BDT") {
  return CURRENCY_MARK[code] ?? `${code} `;
}

export function roundMoney(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function parseMoney(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const n = parseFloat(String(v ?? "0"));
  return Number.isFinite(n) ? n : 0;
}

export function formatMoney(amount: number, code = "BDT", opts?: { sign?: boolean }) {
  const mark = currencyMark(code);
  const abs = Math.abs(amount);
  const body = abs.toLocaleString("en-US", {
    minimumFractionDigits: abs % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  const signed = opts?.sign ? (amount > 0 ? "+" : amount < 0 ? "−" : "") : amount < 0 ? "−" : "";
  return `${signed}${mark}${body}`;
}

export function formatDateLabel(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  const today = new Date();
  const yday = new Date();
  yday.setDate(today.getDate() - 1);
  const key = (x: Date) => x.toISOString().slice(0, 10);
  if (iso === key(today)) return "Today";
  if (iso === key(yday)) return "Yesterday";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function compareSemver(a: string, b: string) {
  const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i += 1) {
    const da = pa[i] ?? 0;
    const db = pb[i] ?? 0;
    if (da > db) return 1;
    if (da < db) return -1;
  }
  return 0;
}
