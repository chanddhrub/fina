import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format } from 'date-fns';
import { useStore } from '../../store/useStore';
import { COLORS, CATEGORY_META } from '../../lib/constants';
import { AmountText } from '../../components/ui/AmountText';
import { Card } from '../../components/ui/Card';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { transactions, accounts } = useStore();

  const tx = transactions.find((t) => t.id === id);
  if (!tx) return null;

  const meta = CATEGORY_META[tx.category];
  const account = accounts.find((a) => a.id === tx.accountId);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction</Text>
        <View style={styles.back} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={[styles.heroIcon, { backgroundColor: meta.color + '22' }]}>
            <Text style={styles.heroEmoji}>{meta.icon}</Text>
          </View>
          <Text style={styles.merchant}>{tx.merchantName}</Text>
          <AmountText amount={tx.amount} isDebit={tx.isDebit} size="xl" style={styles.amount} />
          <Text style={styles.date}>{format(new Date(tx.date), 'MMMM d, yyyy · h:mm a')}</Text>
        </View>

        <Card style={styles.card}>
          <DetailRow label="Category" value={`${meta.icon} ${meta.label}`} />
          <DetailRow label="Account" value={account ? `${account.name} ···· ${account.masked}` : '—'} />
          <DetailRow label="Status" value="Completed ✓" />
          {tx.note && <DetailRow label="Note" value={tx.note} />}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={detailStyles.row}>
      <Text style={detailStyles.label}>{label}</Text>
      <Text style={detailStyles.value}>{value}</Text>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: { color: COLORS.textMuted, fontSize: 14 },
  value: { color: COLORS.text, fontSize: 14, fontWeight: '500' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  back: { width: 60 },
  backText: { color: COLORS.primary, fontSize: 15 },
  headerTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  content: { padding: 20 },
  hero: { alignItems: 'center', marginBottom: 28 },
  heroIcon: { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  heroEmoji: { fontSize: 30 },
  merchant: { color: COLORS.text, fontSize: 20, fontWeight: '700', marginBottom: 8 },
  amount: { marginBottom: 6 },
  date: { color: COLORS.textMuted, fontSize: 13 },
  card: {},
});
