import type { TxKind, TxSource } from "./engine";

export type Person = {
  id: string;
  name: string;
  note: string | null;
  balance: number;
};

export type Category = {
  id: string;
  name: string;
  kind: TxKind;
};

export type Transaction = {
  id: string;
  kind: TxKind;
  source: TxSource;
  amount: number;
  categoryId: string | null;
  categoryName: string | null;
  personId: string | null;
  personName: string | null;
  splitId: string | null;
  note: string | null;
  occurredOn: string;
  createdAt: string;
};

export type LedgerLine = {
  id: string;
  delta: number;
  transactionId: string;
  kind: TxKind;
  source: TxSource;
  amount: number;
  note: string | null;
  occurredOn: string;
};

export type Notice = {
  version: string;
  title: string;
  body: string;
  ctaLabel: string | null;
};

export type Overview = {
  currency: string;
  cash: number;
  dayIncome: number;
  dayExpense: number;
  monthIncome: number;
  monthExpense: number;
  monthBorrow: number;
  monthRepay: number;
  monthLend: number;
  monthCollect: number;
  payable: number;
  receivable: number;
  people: Person[];
  categories: Category[];
  recent: Transaction[];
  notice: Notice | null;
};

export type PersonDetail = {
  person: Person;
  lines: LedgerLine[];
};
