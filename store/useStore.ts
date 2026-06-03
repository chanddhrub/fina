import { create } from 'zustand';
import { Account, Budget, PlaidItem, Transaction } from '../types';
import { MOCK_ACCOUNTS, MOCK_BUDGETS, MOCK_TRANSACTIONS } from '../lib/mockData';

interface FinaState {
  transactions: Transaction[];
  accounts: Account[];
  budgets: Budget[];
  selectedAccountId: string | null;
  plaidItems: PlaidItem[];

  addTransaction: (tx: Transaction) => void;
  addAccount: (account: Account) => void;
  upsertBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  setSelectedAccount: (id: string | null) => void;
  addPlaidItem: (item: PlaidItem) => void;
  removePlaidItem: (itemId: string) => void;
  setPlaidItems: (items: PlaidItem[]) => void;
}

export const useStore = create<FinaState>((set) => ({
  transactions: MOCK_TRANSACTIONS,
  accounts: MOCK_ACCOUNTS,
  budgets: MOCK_BUDGETS,
  selectedAccountId: null,
  plaidItems: [],

  addTransaction: (tx) =>
    set((s) => ({ transactions: [tx, ...s.transactions] })),

  addAccount: (account) =>
    set((s) => ({ accounts: [...s.accounts, account] })),

  upsertBudget: (budget) =>
    set((s) => ({
      budgets: s.budgets.some((b) => b.id === budget.id)
        ? s.budgets.map((b) => (b.id === budget.id ? budget : b))
        : [...s.budgets, budget],
    })),

  deleteBudget: (id) =>
    set((s) => ({ budgets: s.budgets.filter((b) => b.id !== id) })),

  setSelectedAccount: (id) => set({ selectedAccountId: id }),

  addPlaidItem: (item) =>
    set((s) => ({
      plaidItems: [
        ...s.plaidItems.filter((i) => i.itemId !== item.itemId),
        item,
      ],
    })),

  removePlaidItem: (itemId) =>
    set((s) => ({
      plaidItems: s.plaidItems.filter((i) => i.itemId !== itemId),
    })),

  setPlaidItems: (items) => set({ plaidItems: items }),
}));
