import { MonthlyTrend, SpendingSummary, Transaction, TransactionCategory } from '../types';
import { format } from 'date-fns';

export function computeSpendingSummary(transactions: Transaction[]): SpendingSummary[] {
  const debits = transactions.filter((t) => t.isDebit);
  const total = debits.reduce((sum, t) => sum + t.amount, 0);

  const byCategory: Partial<Record<TransactionCategory, { total: number; count: number }>> = {};
  for (const t of debits) {
    if (!byCategory[t.category]) byCategory[t.category] = { total: 0, count: 0 };
    byCategory[t.category]!.total += t.amount;
    byCategory[t.category]!.count += 1;
  }

  return (Object.entries(byCategory) as [TransactionCategory, { total: number; count: number }][])
    .map(([category, { total: catTotal, count }]) => ({
      category,
      total: catTotal,
      count,
      percentage: total > 0 ? (catTotal / total) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export function computeMonthlyTrends(transactions: Transaction[]): MonthlyTrend[] {
  const byMonth: Record<string, { income: number; expenses: number }> = {};

  for (const t of transactions) {
    const month = format(new Date(t.date), 'yyyy-MM');
    if (!byMonth[month]) byMonth[month] = { income: 0, expenses: 0 };
    if (t.isDebit) byMonth[month].expenses += t.amount;
    else byMonth[month].income += t.amount;
  }

  return Object.entries(byMonth)
    .map(([month, { income, expenses }]) => ({ month, income, expenses }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function getBudgetSpend(
  transactions: Transaction[],
  category: TransactionCategory,
  periodStart: string,
  periodEnd: string
): number {
  return transactions
    .filter(
      (t) =>
        t.isDebit &&
        t.category === category &&
        t.date >= periodStart &&
        t.date <= periodEnd + 'T23:59:59Z'
    )
    .reduce((sum, t) => sum + t.amount, 0);
}
