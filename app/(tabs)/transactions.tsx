import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { COLORS, CATEGORY_META } from '../../lib/constants';
import { TransactionRow } from '../../components/transactions/TransactionRow';
import { TransactionCategory } from '../../types';

const ALL = 'all' as const;
type Filter = TransactionCategory | typeof ALL;

const FILTERS: Filter[] = [ALL, 'food', 'transport', 'shopping', 'entertainment', 'health', 'utilities', 'income', 'other'];

export default function TransactionsScreen() {
  const { transactions } = useStore();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>(ALL);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.merchantName.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filter === ALL || t.category === filter;
      return matchesSearch && matchesCategory;
    });
  }, [transactions, search, filter]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <TextInput
          style={styles.search}
          placeholder="Search..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={(f) => f}
        style={styles.filterList}
        contentContainerStyle={styles.filterContent}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, filter === item && styles.chipActive]}
            onPress={() => setFilter(item)}
          >
            <Text style={[styles.chipText, filter === item && styles.chipTextActive]}>
              {item === ALL ? 'All' : CATEGORY_META[item].icon + ' ' + CATEGORY_META[item].label}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <TransactionRow transaction={item} onPress={() => router.push(`/transaction/${item.id}`)} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No transactions found</Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, paddingBottom: 12 },
  title: { color: COLORS.text, fontSize: 22, fontWeight: '700', marginBottom: 12 },
  search: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterList: { maxHeight: 44 },
  filterContent: { paddingHorizontal: 20, gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.textMuted, fontSize: 12 },
  chipTextActive: { color: '#fff' },
  listContent: { paddingBottom: 32 },
  empty: { color: COLORS.textMuted, textAlign: 'center', marginTop: 48 },
});
