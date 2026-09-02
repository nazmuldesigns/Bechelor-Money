import { s as roundMoney } from "./format-D6213dDq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/engine-DFInCt5l.js
/**
* Equal split using largest-remainder on integer cents.
* Index 0 is always "me"; remaining indexes map to `personIds` in order.
* Remainder pennies go to others first so my share never silently grows.
*/
function equalShares(total, n) {
	if (n <= 0) return [];
	const cents = Math.round(roundMoney(total) * 100);
	const base = Math.floor(cents / n);
	let rem = cents - base * n;
	const out = Array.from({ length: n }, () => base);
	for (let i = 1; rem > 0; i += 1, rem -= 1) out[i % n] += 1;
	return out.map((c) => c / 100);
}
/**
* Smart debt engine.
*
* Ledger convention (single signed number per person):
*   +balance  → receivable (they owe me)
*   −balance  → payable    (I owe them)
*
* Cash = sum(income) − sum(expense). Borrowed cash is income; paying it
* back is expense. True position = cash − payable + receivable, which stays
* unchanged for pure debt movements and drops only by my own share of spend.
*
* Cases from the product spec:
* 1. Borrow 500 from X
*      income +500, ledger[X] −500  → cash up, payable to X up
* 2. Spend 40 for X (direct repayment via expense)
*      expense +40,  ledger[X] +40  → cash down, payable to X down
*      (same math if I did not owe them — it becomes a receivable)
* 3. Split 90 equally Me / A / B, I paid
*      expense +90,  ledger[A] +30, ledger[B] +30
*      If A is someone I owe, +30 nets against payable.
*      If B already owes me, +30 grows receivable.
*/
function planEntry(input) {
	const amount = roundMoney(input.amount);
	if (!(amount > 0)) throw new Error("Amount must be greater than zero");
	switch (input.mode) {
		case "income": return {
			kind: "income",
			source: "plain",
			cashAmount: amount,
			ledger: []
		};
		case "spend": return {
			kind: "expense",
			source: input.personId ? "repay" : "plain",
			cashAmount: amount,
			ledger: input.personId ? [{
				personId: input.personId,
				delta: amount
			}] : []
		};
		case "borrow": return {
			kind: "income",
			source: "borrow",
			cashAmount: amount,
			ledger: [{
				personId: needPerson(input.personId, "Pick who you borrowed from"),
				delta: -amount
			}]
		};
		case "lend": return {
			kind: "expense",
			source: "lend",
			cashAmount: amount,
			ledger: [{
				personId: needPerson(input.personId, "Pick who you lent to"),
				delta: amount
			}]
		};
		case "repay": return {
			kind: "expense",
			source: "repay",
			cashAmount: amount,
			ledger: [{
				personId: needPerson(input.personId, "Pick who you are paying back"),
				delta: amount
			}]
		};
		case "collect": return {
			kind: "income",
			source: "collect",
			cashAmount: amount,
			ledger: [{
				personId: needPerson(input.personId, "Pick who is paying you back"),
				delta: -amount
			}]
		};
		case "split": {
			const others = input.personIds ?? [];
			if (others.length < 1) throw new Error("Add at least one person to split with");
			const shares = equalShares(amount, others.length + 1);
			return {
				kind: "expense",
				source: "split",
				cashAmount: amount,
				myShare: shares[0],
				ledger: others.map((personId, i) => ({
					personId,
					delta: shares[i + 1] ?? 0
				}))
			};
		}
	}
}
function needPerson(id, message) {
	if (!id) throw new Error(message);
	return id;
}
/** Preview copy for the composer — no I/O, safe to run on the client. */
function describePlan(plan, people) {
	const byId = new Map(people.map((p) => [p.id, p]));
	return plan.ledger.map((row) => {
		const person = byId.get(row.personId);
		const before = person?.balance ?? 0;
		const after = roundMoney(before + row.delta);
		return {
			personId: row.personId,
			name: person?.name ?? "Someone",
			before,
			after,
			delta: row.delta
		};
	});
}
//#endregion
export { planEntry as n, describePlan as t };
