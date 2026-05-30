import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store/useStore';
import { COLORS, CATEGORY_META } from '../../lib/constants';
import { Card } from '../../components/ui/Card';
import { SpendingPieChart } from '../../components/charts/SpendingPieChart';
import { MonthlyBarChart } from '../../components/charts/MonthlyBarChart';
import { computeSpendingSummary, computeMonthlyTrends } from '../../lib/analytics';

export default function AnalyticsScreen() {
  const { transactions } = useStore();

  const summary = useMemo(() => computeSpendingSummary(transactions), [transactions]);
  const trends = useMemo(() => computeMonthlyTrends(transactions), [transactions]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>All analytics computed on-device</Text>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          <SpendingPieChart data={summary} />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Monthly Overview</Text>
          <MonthlyBarChart data={trends} />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          {summary.map((s) => {
            const meta = CATEGORY_META[s.category];
            return (
              <View key={s.category} style={styles.row}>
                <Text style={styles.icon}>{meta.icon}</Text>
                <View style={styles.rowInfo}>
                  <View style={styles.rowHeader}>
                    <Text style={styles.categoryLabel}>{meta.label}</Text>
                    <Text style={styles.amount}>${s.total.toFixed(2)}</Text>
                  </View>
                  <View style={styles.barBg}>
                    <View
                      style={[styles.barFill, { width: `${s.percentage}%` as any, backgroundColor: meta.color }]}
                    />
                  </View>
                  <Text style={styles.pct}>{s.percentage.toFixed(1)}% · {s.count} transactions</Text>
                </View>
              </View>
            );
          })}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 32 },
  title: { color: COLORS.text, fontSize: 22, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: COLORS.textMuted, fontSize: 12, marginBottom: 20 },
  card: { marginBottom: 16 },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  icon: { fontSize: 22, marginRight: 12, marginTop: 2 },
  rowInfo: { flex: 1 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  categoryLabel: { color: COLORS.text, fontSize: 13 },
  amount: { color: COLORS.text, fontSize: 13, fontWeight: '600' },
  barBg: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, marginBottom: 4 },
  barFill: { height: 6, borderRadius: 3 },
  pct: { color: COLORS.textMuted, fontSize: 11 },
});
