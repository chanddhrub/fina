export type TransactionCategory =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'entertainment'
  | 'health'
  | 'utilities'
  | 'income'
  | 'other';

export interface Transaction {
  id: string;
  merchantName: string;
  amount: number;
  date: string; // ISO string
  category: TransactionCategory;
  accountId: string;
  note?: string;
  isDebit: boolean;
}

export interface Account {
  id: string;
  name: string;
  institution: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  lastSynced: string;
  masked: string; // last 4 digits
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  limitAmount: number;
  periodStart: string;
  periodEnd: string;
}

export interface SpendingSummary {
  category: TransactionCategory;
  total: number;
  count: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string; // 'YYYY-MM'
  income: number;
  expenses: number;
}

export interface PlaidLinkedAccount {
  plaidAccountId: string;
  name: string;
  mask: string | null;
  type: string;
  subtype: string | null;
  balance: number;
}

export interface PlaidItem {
  itemId: string;
  institutionName: string;
  linkedAt: string;
  accounts: PlaidLinkedAccount[];
}
