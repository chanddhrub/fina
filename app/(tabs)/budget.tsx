import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store/useStore';
import { COLORS, CATEGORY_META } from '../../lib/constants';
import { Card } from '../../components/ui/Card';
import { getBudgetSpend } from '../../lib/analytics';

export default function BudgetScreen() {
  const { budgets, transactions } = useStore();

  const budgetItems = useMemo(() =>
    budgets.map((b) => {
      const spent = getBudgetSpend(transactions, b.category, b.periodStart, b.periodEnd);
      const pct = Math.min((spent / b.limitAmount) * 100, 100);
      const remaining = b.limitAmount - spent;
      return { ...b, spent, pct, remaining };
    }),
    [budgets, transactions]
  );

  const totalBudget = budgets.reduce((s, b) => s + b.limitAmount, 0);
  const totalSpent = budgetItems.reduce((s, b) => s + b.spent, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Budgets</Text>

        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Budget Used</Text>
          <Text style={styles.summaryAmount}>
            ${totalSpent.toFixed(0)} / ${totalBudget.toFixed(0)}
          </Text>
          <View style={styles.barBg}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` as any,
                  backgroundColor: totalSpent > totalBudget ? COLORS.danger : COLORS.primary,
                },
              ]}
            />
          </View>
        </Card>

        {budgetItems.map((b) => {
          const meta = CATEGORY_META[b.category];
          const isOver = b.remaining < 0;
          return (
            <Card key={b.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardLeft}>
                  <Text style={styles.icon}>{meta.icon}</Text>
                  <View>
                    <Text style={styles.categoryLabel}>{meta.label}</Text>
                    <Text style={styles.period}>May 2026</Text>
                  </View>
                </View>
                <View style={styles.cardRight}>
                  <Text style={[styles.remaining, isOver && styles.over]}>
                    {isOver ? `$${Math.abs(b.remaining).toFixed(0)} over` : `$${b.remaining.toFixed(0)} left`}
                  </Text>
                  <Text style={styles.limit}>of ${b.limitAmount}</Text>
                </View>
              </View>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${b.pct}%` as any,
                      backgroundColor: isOver ? COLORS.danger : b.pct > 80 ? COLORS.warning : COLORS.success,
                    },
                  ]}
                />
              </View>
              <Text style={styles.spentLabel}>${b.spent.toFixed(2)} spent · {b.pct.toFixed(0)}%</Text>
            </Card>
          );
        })}

        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add Budget</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 32 },
  title: { color: COLORS.text, fontSize: 22, fontWeight: '700', marginBottom: 20 },
  summaryCard: { marginBottom: 20 },
  summaryLabel: { color: COLORS.textMuted, fontSize: 13, marginBottom: 4 },
  summaryAmount: { color: COLORS.text, fontSize: 24, fontWeight: '700', marginBottom: 12 },
  card: { marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardRight: { alignItems: 'flex-end' },
  icon: { fontSize: 24 },
  categoryLabel: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
  period: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  remaining: { color: COLORS.success, fontSize: 14, fontWeight: '700' },
  over: { color: COLORS.danger },
  limit: { color: COLORS.textMuted, fontSize: 11 },
  barBg: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, marginBottom: 8 },
  barFill: { height: 8, borderRadius: 4 },
  spentLabel: { color: COLORS.textMuted, fontSize: 11 },
  addBtn: {
    marginTop: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
