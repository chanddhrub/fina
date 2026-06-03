import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { format } from 'date-fns';
import { Transaction } from '../../types';
import { CATEGORY_META, COLORS } from '../../lib/constants';
import { AmountText } from '../ui/AmountText';

interface Props {
  transaction: Transaction;
  onPress?: () => void;
}

export function TransactionRow({ transaction, onPress }: Props) {
  const meta = CATEGORY_META[transaction.category];
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.icon, { backgroundColor: meta.color + '22' }]}>
        <Text style={styles.emoji}>{meta.icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.merchant} numberOfLines={1}>
          {transaction.merchantName}
        </Text>
        <Text style={styles.meta}>
          {meta.label} · {format(new Date(transaction.date), 'MMM d')}
        </Text>
      </View>
      <AmountText amount={transaction.amount} isDebit={transaction.isDebit} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emoji: { fontSize: 20 },
  info: { flex: 1 },
  merchant: { color: COLORS.text, fontWeight: '600', fontSize: 14 },
  meta: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
});
