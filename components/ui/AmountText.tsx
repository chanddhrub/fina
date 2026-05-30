import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { COLORS } from '../../lib/constants';

interface AmountTextProps {
  amount: number;
  isDebit?: boolean;
  style?: TextStyle;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZES = { sm: 13, md: 15, lg: 18, xl: 26 };

export function AmountText({ amount, isDebit = true, style, size = 'md' }: AmountTextProps) {
  const color = isDebit ? COLORS.expense : COLORS.income;
  const prefix = isDebit ? '-' : '+';
  return (
    <Text style={[styles.text, { color, fontSize: SIZES[size] }, style]}>
      {prefix}${amount.toFixed(2)}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: { fontWeight: '600' },
});
