import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEntry,
  createPerson,
  deletePerson,
  deleteTransaction,
  getOverview,
  getPersonLedger,
  listTransactions,
  monthBreakdown,
} from "./server";
import type { EntryMode } from "./engine";

export const moneyKey = {
  overview: ["money", "overview"] as const,
  activity: ["money", "activity"] as const,
  people: ["money", "people"] as const,
  person: (id: string) => ["money", "person", id] as const,
  breakdown: ["money", "breakdown"] as const,
};

export function useOverview() {
  return useQuery({
    queryKey: moneyKey.overview,
    queryFn: () => getOverview(),
  });
}

export function useActivity() {
  return useQuery({
    queryKey: moneyKey.activity,
    queryFn: () => listTransactions(),
  });
}

export function usePerson(personId: string) {
  return useQuery({
    queryKey: moneyKey.person(personId),
    queryFn: () => getPersonLedger({ data: { personId } }),
    enabled: Boolean(personId),
  });
}

export function useBreakdown() {
  return useQuery({
    queryKey: moneyKey.breakdown,
    queryFn: () => monthBreakdown(),
  });
}

type EntryInput = {
  mode: EntryMode;
  amount: number;
  categoryId?: string;
  personId?: string;
  personIds?: string[];
  note?: string;
  occurredOn: string;
};

export function useMoneyMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["money"] });

  const addEntry = useMutation({
    mutationFn: (data: EntryInput) => createEntry({ data }),
    onSuccess: invalidate,
  });
  const addPerson = useMutation({
    mutationFn: (data: { name: string; note?: string }) => createPerson({ data }),
    onSuccess: invalidate,
  });
  const removeTxn = useMutation({
    mutationFn: (id: string) => deleteTransaction({ data: { id } }),
    onSuccess: invalidate,
  });
  const removePerson = useMutation({
    mutationFn: (personId: string) => deletePerson({ data: { personId } }),
    onSuccess: invalidate,
  });

  return { addEntry, addPerson, removeTxn, removePerson, invalidate };
}
