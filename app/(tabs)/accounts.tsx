import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store/useStore';
import { COLORS } from '../../lib/constants';
import { Card } from '../../components/ui/Card';

const INSTITUTION_ICONS: Record<string, string> = {
  Chase: '🏛️',
  'Bank of America': '🏦',
  'Wells Fargo': '🐴',
  Citi: '🌆',
};

export default function AccountsScreen() {
  const { accounts } = useStore();

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Accounts</Text>

        <Card style={styles.totalCard}>
          <Text style={styles.totalLabel}>Net Worth</Text>
          <Text style={styles.totalAmount}>
            ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
        </Card>

        {accounts.map((account) => (
          <Card key={account.id} style={styles.accountCard}>
            <View style={styles.accountHeader}>
              <Text style={styles.institutionIcon}>
                {INSTITUTION_ICONS[account.institution] ?? '🏦'}
              </Text>
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>{account.name}</Text>
                <Text style={styles.accountMeta}>
                  {account.institution} ···· {account.masked}
                </Text>
              </View>
              <View style={styles.badgeContainer}>
                <Text style={styles.badge}>{account.type}</Text>
              </View>
            </View>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Balance</Text>
              <Text style={styles.balance}>
                ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </Card>
        ))}

        <Card style={styles.linkCard}>
          <Text style={styles.linkTitle}>🔗 Link a Bank Account</Text>
          <Text style={styles.linkDesc}>
            Securely connect your bank using Plaid. Your credentials never leave your device.
          </Text>
          <TouchableOpacity style={styles.linkBtn}>
            <Text style={styles.linkBtnText}>Connect Account</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 32 },
  title: { color: COLORS.text, fontSize: 22, fontWeight: '700', marginBottom: 20 },
  totalCard: { marginBottom: 20, alignItems: 'center', paddingVertical: 24 },
  totalLabel: { color: COLORS.textMuted, fontSize: 13, marginBottom: 4 },
  totalAmount: { color: COLORS.text, fontSize: 34, fontWeight: '800' },
  accountCard: { marginBottom: 12 },
  accountHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  institutionIcon: { fontSize: 28, marginRight: 12 },
  accountInfo: { flex: 1 },
  accountName: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  accountMeta: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  badgeContainer: {},
  badge: {
    backgroundColor: COLORS.surfaceLight,
    color: COLORS.textMuted,
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    textTransform: 'capitalize',
  },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { color: COLORS.textMuted, fontSize: 13 },
  balance: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  linkCard: { marginTop: 8, borderStyle: 'dashed' },
  linkTitle: { color: COLORS.text, fontSize: 15, fontWeight: '700', marginBottom: 8 },
  linkDesc: { color: COLORS.textMuted, fontSize: 13, marginBottom: 16, lineHeight: 20 },
  linkBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  linkBtnText: { color: '#fff', fontWeight: '700' },
});
