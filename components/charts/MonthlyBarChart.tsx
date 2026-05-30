import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { MonthlyTrend } from '../../types';
import { COLORS } from '../../lib/constants';
import { format } from 'date-fns';

interface Props {
  data: MonthlyTrend[];
}

export function MonthlyBarChart({ data }: Props) {
  if (data.length === 0) return null;

  const barData = data.flatMap((d) => [
    {
      value: d.income,
      label: format(new Date(d.month + '-01'), 'MMM'),
      frontColor: COLORS.income,
      spacing: 2,
    },
    {
      value: d.expenses,
      frontColor: COLORS.expense,
      spacing: 16,
    },
  ]);

  return (
    <View>
      <BarChart
        data={barData}
        barWidth={20}
        noOfSections={4}
        yAxisTextStyle={{ color: COLORS.textMuted, fontSize: 10 }}
        xAxisLabelTextStyle={{ color: COLORS.textMuted, fontSize: 10 }}
        yAxisColor={COLORS.border}
        xAxisColor={COLORS.border}
        rulesColor={COLORS.border}
        hideRules={false}
        isAnimated
        height={180}
      />
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: COLORS.income }]} />
          <Text style={styles.legendText}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: COLORS.expense }]} />
          <Text style={styles.legendText}>Expenses</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: { flexDirection: 'row', gap: 16, marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: COLORS.textMuted, fontSize: 12 },
});
