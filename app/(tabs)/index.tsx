import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store/useStore';
import { COLORS } from '../../lib/constants';
import { Card } from '../../components/ui/Card';
import { AmountText } from '../../components/ui/AmountText';
import { TransactionRow } from '../../components/transactions/TransactionRow';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { transactions, accounts } = useStore();
  const router = useRouter();

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const thisMonth = transactions.filter((t) => t.date.startsWith('2026-05'));
  const monthlyExpenses = thisMonth.filter((t) => t.isDebit).reduce((s, t) => s + t.amount, 0);
  const monthlyIncome = thisMonth.filter((t) => !t.isDebit).reduce((s, t) => s + t.amount, 0);
  const recent = transactions.slice(0, 5);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Good morning 👋</Text>
        <Text style={styles.subtitle}>Here's your financial overview</Text>

        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceStat}>
              <Text style={styles.statLabel}>Income</Text>
              <AmountText amount={monthlyIncome} isDebit={false} size="sm" />
            </View>
            <View style={styles.divider} />
            <View style={styles.balanceStat}>
              <Text style={styles.statLabel}>Expenses</Text>
              <AmountText amount={monthlyExpenses} isDebit size="sm" />
            </View>
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Text
            style={styles.seeAll}
            onPress={() => router.push('/(tabs)/transactions')}
          >
            See all
          </Text>
        </View>

        <Card style={styles.txCard}>
          {recent.map((tx) => (
            <TransactionRow
              key={tx.id}
              transaction={tx}
              onPress={() => router.push(`/transaction/${tx.id}`)}
            />
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 32 },
  greeting: { color: COLORS.text, fontSize: 22, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: COLORS.textMuted, fontSize: 14, marginBottom: 20 },
  balanceCard: { marginBottom: 24 },
  balanceLabel: { color: COLORS.textMuted, fontSize: 13, marginBottom: 4 },
  balanceAmount: { color: COLORS.text, fontSize: 32, fontWeight: '800', marginBottom: 16 },
  balanceRow: { flexDirection: 'row', alignItems: 'center' },
  balanceStat: { flex: 1, alignItems: 'center' },
  statLabel: { color: COLORS.textMuted, fontSize: 12, marginBottom: 4 },
  divider: { width: 1, height: 32, backgroundColor: COLORS.border },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  seeAll: { color: COLORS.primary, fontSize: 13 },
  txCard: { padding: 0, overflow: 'hidden' },
});
