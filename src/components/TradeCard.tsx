import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { InsiderTrade } from '../types/trade';
import { colors, radius, spacing } from '../theme/colors';
import { formatCompactCurrency, formatFiledTime } from '../utils/formatters';
import SignalBadge from './SignalBadge';

type Props = {
  trade: InsiderTrade;
  onPress: (trade: InsiderTrade) => void;
};

export default function TradeCard({ trade, onPress }: Props) {
  const isPurchase = trade.type === 'purchase';
  const accent = isPurchase ? colors.purchase : colors.sale;
  const typeLabel = isPurchase ? 'Purchase' : 'Sale';

  return (
    <Pressable
      onPress={() => onPress(trade)}
      accessibilityRole="button"
      accessibilityLabel={`${typeLabel} by ${trade.insider}, ${trade.role} at ${trade.company}, worth ${formatCompactCurrency(trade.value)}`}
      android_ripple={{ color: 'rgba(96, 165, 250, 0.08)' }}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <View style={styles.companyBlock}>
          <Text style={styles.ticker}>{trade.ticker}</Text>
          <Text style={styles.company} numberOfLines={1}>
            {trade.company}
          </Text>
          <Text style={styles.insider} numberOfLines={1}>
            {trade.insider} · {trade.role}
          </Text>
        </View>

        <View style={styles.rightBlock}>
          <Text style={[styles.value, { color: accent }]}>
            {formatCompactCurrency(trade.value)}
          </Text>
          <SignalBadge strength={trade.signalStrength} />
        </View>
      </View>

      <View style={styles.footer}>
        <View
          style={[
            styles.typePill,
            { backgroundColor: isPurchase ? colors.purchaseSoft : colors.saleSoft },
          ]}
        >
          <Ionicons
            name={isPurchase ? 'arrow-up' : 'arrow-down'}
            size={12}
            color={accent}
          />
          <Text style={[styles.typeText, { color: accent }]}>{typeLabel}</Text>
        </View>

        <View style={styles.timeWrap}>
          <Ionicons name="time-outline" size={12} color={colors.textSubtle} />
          <Text style={styles.time}>{formatFiledTime(trade.filedAt)}</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.textSubtle} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  companyBlock: {
    flex: 1,
  },
  ticker: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  company: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 1,
  },
  insider: {
    color: colors.textSubtle,
    fontSize: 12,
    marginTop: 4,
  },
  rightBlock: {
    alignItems: 'flex-end',
    gap: 6,
  },
  value: {
    fontSize: 15,
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 5,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  timeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    color: colors.textSubtle,
    fontSize: 12,
  },
});