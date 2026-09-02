import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { a as deletePerson, c as getOverview, d as monthBreakdown, i as createPerson, l as getPersonLedger, o as deleteTransaction, r as createEntry, u as listTransactions } from "./server-DnAn995v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hooks-CCa1Rf6w.js
var moneyKey = {
	overview: ["money", "overview"],
	activity: ["money", "activity"],
	people: ["money", "people"],
	person: (id) => [
		"money",
		"person",
		id
	],
	breakdown: ["money", "breakdown"]
};
function useOverview() {
	return useQuery({
		queryKey: moneyKey.overview,
		queryFn: () => getOverview()
	});
}
function useActivity() {
	return useQuery({
		queryKey: moneyKey.activity,
		queryFn: () => listTransactions()
	});
}
function usePerson(personId) {
	return useQuery({
		queryKey: moneyKey.person(personId),
		queryFn: () => getPersonLedger({ data: { personId } }),
		enabled: Boolean(personId)
	});
}
function useBreakdown() {
	return useQuery({
		queryKey: moneyKey.breakdown,
		queryFn: () => monthBreakdown()
	});
}
function useMoneyMutations() {
	const qc = useQueryClient();
	const invalidate = () => qc.invalidateQueries({ queryKey: ["money"] });
	return {
		addEntry: useMutation({
			mutationFn: (data) => createEntry({ data }),
			onSuccess: invalidate
		}),
		addPerson: useMutation({
			mutationFn: (data) => createPerson({ data }),
			onSuccess: invalidate
		}),
		removeTxn: useMutation({
			mutationFn: (id) => deleteTransaction({ data: { id } }),
			onSuccess: invalidate
		}),
		removePerson: useMutation({
			mutationFn: (personId) => deletePerson({ data: { personId } }),
			onSuccess: invalidate
		}),
		invalidate
	};
}
//#endregion
export { useOverview as a, useMoneyMutations as i, useActivity as n, usePerson as o, useBreakdown as r, moneyKey as t };
