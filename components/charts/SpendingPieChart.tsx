import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { SpendingSummary } from '../../types';
import { CATEGORY_META, COLORS } from '../../lib/constants';

interface Props {
  data: SpendingSummary[];
}

export function SpendingPieChart({ data }: Props) {
  if (data.length === 0) return null;

  const pieData = data.slice(0, 6).map((d) => ({
    value: d.total,
    color: CATEGORY_META[d.category].color,
    label: CATEGORY_META[d.category].label,
  }));

  const total = data.reduce((s, d) => s + d.total, 0);

  return (
    <View style={styles.container}>
      <PieChart
        data={pieData}
        donut
        radius={90}
        innerRadius={58}
        centerLabelComponent={() => (
          <View style={styles.center}>
            <Text style={styles.centerLabel}>Total</Text>
            <Text style={styles.centerAmount}>${total.toFixed(0)}</Text>
          </View>
        )}
      />
      <View style={styles.legend}>
        {pieData.map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  center: { alignItems: 'center' },
  centerLabel: { color: COLORS.textMuted, fontSize: 11 },
  centerAmount: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: COLORS.textMuted, fontSize: 11 },
});
