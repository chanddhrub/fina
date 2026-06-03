import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { create, LinkExit, LinkSuccess, open } from 'react-native-plaid-link-sdk';
import { useStore } from '../../store/useStore';
import { COLORS } from '../../lib/constants';
import { Card } from '../../components/ui/Card';
import { createLinkToken, exchangePublicToken, fetchPlaidAccounts } from '../../lib/plaidApi';
import {
  loadPlaidItems,
  removePlaidItem,
  StoredPlaidItem,
  storePlaidItem,
} from '../../lib/plaidStorage';
import { PlaidItem, PlaidLinkedAccount } from '../../types';

const INSTITUTION_ICONS: Record<string, string> = {
  Chase: '🏛️',
  'Bank of America': '🏦',
  'Wells Fargo': '🐴',
  Citi: '🌆',
};

export default function AccountsScreen() {
  const { accounts, plaidItems, addPlaidItem, removePlaidItem: removeFromStore, setPlaidItems } =
    useStore();

  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loadingLink, setLoadingLink] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null); // itemId being synced

  const totalMockBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const totalPlaidBalance = plaidItems
    .flatMap((i) => i.accounts)
    .reduce((s, a) => s + a.balance, 0);

  // ── Restore persisted Plaid items on mount ──────────────────────────────────
  useEffect(() => {
    loadPlaidItems().then(async (stored: StoredPlaidItem[]) => {
      if (!stored.length) return;
      const restored: PlaidItem[] = await Promise.all(
        stored.map(async (s) => {
          try {
            const { accounts: raw } = await fetchPlaidAccounts(s.accessToken);
            const accounts: PlaidLinkedAccount[] = raw.map((a: any) => ({
              plaidAccountId: a.account_id,
              name: a.name,
              mask: a.mask,
              type: a.type,
              subtype: a.subtype,
              balance: a.balances.current ?? 0,
            }));
            return { itemId: s.itemId, institutionName: s.institutionName, linkedAt: s.linkedAt, accounts };
          } catch {
            return { itemId: s.itemId, institutionName: s.institutionName, linkedAt: s.linkedAt, accounts: [] };
          }
        })
      );
      setPlaidItems(restored);
    });
  }, []);

  // ── Fetch a fresh link token and pre-create the Link session ───────────────
  const initPlaidLink = useCallback(async () => {
    setLoadingLink(true);
    try {
      const token = await createLinkToken();
      setLinkToken(token);
      create({ token });
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Could not reach Fina server.');
    } finally {
      setLoadingLink(false);
    }
  }, []);

  // ── Open Plaid Link ────────────────────────────────────────────────────────
  const handleConnectBank = useCallback(async () => {
    if (!linkToken) {
      // fetch token first, then open on next press
      await initPlaidLink();
      return;
    }

    open({
      onSuccess: async (success: LinkSuccess) => {
        try {
          const institutionName =
            success.metadata.institution?.name ?? 'Unknown Bank';

          const { accessToken, itemId } = await exchangePublicToken(
            success.publicToken
          );

          await storePlaidItem({
            itemId,
            accessToken,
            institutionName,
            linkedAt: new Date().toISOString(),
          });

          const { accounts: raw } = await fetchPlaidAccounts(accessToken);
          const linkedAccounts: PlaidLinkedAccount[] = raw.map((a: any) => ({
            plaidAccountId: a.account_id,
            name: a.name,
            mask: a.mask,
            type: a.type,
            subtype: a.subtype,
            balance: a.balances.current ?? 0,
          }));

          addPlaidItem({ itemId, institutionName, linkedAt: new Date().toISOString(), accounts: linkedAccounts });
          setLinkToken(null); // reset so next press gets a fresh token
          Alert.alert('Linked!', `${institutionName} connected successfully.`);
        } catch (err: any) {
          Alert.alert('Error', err.message ?? 'Failed to link account.');
        }
      },
      onExit: (exit: LinkExit) => {
        if (exit.error) {
          Alert.alert('Plaid Error', exit.error.displayMessage ?? exit.error.errorMessage);
        }
        setLinkToken(null);
      },
    });
  }, [linkToken, addPlaidItem, initPlaidLink]);

  // ── Remove a linked bank ───────────────────────────────────────────────────
  const handleRemoveItem = useCallback(
    (item: PlaidItem) => {
      Alert.alert(
        'Remove Account',
        `Disconnect ${item.institutionName}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              await removePlaidItem(item.itemId);
              removeFromStore(item.itemId);
            },
          },
        ]
      );
    },
    [removeFromStore]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Accounts</Text>

        {/* Net Worth */}
        <Card style={styles.totalCard}>
          <Text style={styles.totalLabel}>Net Worth</Text>
          <Text style={styles.totalAmount}>
            ${(totalMockBalance + totalPlaidBalance).toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })}
          </Text>
        </Card>

        {/* Mock / local accounts */}
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
              <Text style={styles.badge}>{account.type}</Text>
            </View>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Balance</Text>
              <Text style={styles.balance}>
                ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </Card>
        ))}

        {/* Plaid-linked institutions */}
        {plaidItems.map((item) => (
          <View key={item.itemId}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>🏦 {item.institutionName}</Text>
              <TouchableOpacity onPress={() => handleRemoveItem(item)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>

            {item.accounts.map((acc) => (
              <Card key={acc.plaidAccountId} style={styles.accountCard}>
                <View style={styles.accountHeader}>
                  <Text style={styles.institutionIcon}>🏦</Text>
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountName}>{acc.name}</Text>
                    <Text style={styles.accountMeta}>
                      {item.institutionName}
                      {acc.mask ? ` ···· ${acc.mask}` : ''}
                    </Text>
                  </View>
                  <Text style={styles.badge}>{acc.subtype ?? acc.type}</Text>
                </View>
                <View style={styles.balanceRow}>
                  <Text style={styles.balanceLabel}>Balance</Text>
                  <Text style={styles.balance}>
                    ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        ))}

        {/* Link a Bank Account */}
        <Card style={styles.linkCard}>
          <Text style={styles.linkTitle}>🔗 Link a Bank Account</Text>
          <Text style={styles.linkDesc}>
            Securely connect your bank via Plaid. Your credentials are stored in
            iOS Keychain / Android Keystore and never leave your device.
          </Text>
          <TouchableOpacity
            style={[styles.linkBtn, loadingLink && styles.linkBtnDisabled]}
            onPress={handleConnectBank}
            disabled={loadingLink}
          >
            {loadingLink ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.linkBtnText}>
                {linkToken ? 'Open Plaid Link' : 'Connect Account'}
              </Text>
            )}
          </TouchableOpacity>

          {linkToken && (
            <Text style={styles.readyHint}>Ready — tap again to open Plaid.</Text>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 40 },
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

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  sectionLabel: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },
  removeText: { color: COLORS.danger, fontSize: 12 },

  linkCard: { marginTop: 8, borderStyle: 'dashed' },
  linkTitle: { color: COLORS.text, fontSize: 15, fontWeight: '700', marginBottom: 8 },
  linkDesc: { color: COLORS.textMuted, fontSize: 13, marginBottom: 16, lineHeight: 20 },
  linkBtn: { backgroundColor: COLORS.primary, borderRadius: 10, padding: 12, alignItems: 'center' },
  linkBtnDisabled: { opacity: 0.6 },
  linkBtnText: { color: '#fff', fontWeight: '700' },
  readyHint: { color: COLORS.textMuted, fontSize: 12, textAlign: 'center', marginTop: 8 },
});
