import { TransactionCategory } from '../types';

export const COLORS = {
  primary: '#6366F1',
  primaryLight: '#818CF8',
  success: '#22C55E',
  danger: '#EF4444',
  warning: '#F59E0B',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceLight: '#334155',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  border: '#334155',
  income: '#22C55E',
  expense: '#EF4444',
};

export const CATEGORY_META: Record<
  TransactionCategory,
  { label: string; icon: string; color: string }
> = {
  food: { label: 'Food & Dining', icon: '🍔', color: '#F59E0B' },
  transport: { label: 'Transport', icon: '🚗', color: '#3B82F6' },
  shopping: { label: 'Shopping', icon: '🛍️', color: '#EC4899' },
  entertainment: { label: 'Entertainment', icon: '🎬', color: '#8B5CF6' },
  health: { label: 'Health', icon: '💊', color: '#10B981' },
  utilities: { label: 'Utilities', icon: '⚡', color: '#6B7280' },
  income: { label: 'Income', icon: '💰', color: '#22C55E' },
  other: { label: 'Other', icon: '📦', color: '#94A3B8' },
};
