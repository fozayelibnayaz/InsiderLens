import { StyleSheet, Text, View } from 'react-native';
import type { SignalStrength } from '../types/trade';
import { colors, radius, spacing } from '../theme/colors';

type Props = {
  strength: SignalStrength;
};

const badgeTones: Record<SignalStrength, { background: string; color: string }> = {
  High: { background: colors.purchaseSoft, color: colors.purchase },
  Medium: { background: 'rgba(251, 191, 36, 0.15)', color: colors.amber },
  Low: { background: 'rgba(148, 163, 184, 0.14)', color: colors.textSubtle },
};

// Small coloured pill so the strength is readable without relying on colour alone.
export default function SignalBadge({ strength }: Props) {
  const tone = badgeTones[strength];

  return (
    <View style={[styles.badge, { backgroundColor: tone.background }]}>
      <View style={[styles.dot, { backgroundColor: tone.color }]} />
      <Text style={[styles.text, { color: tone.color }]}>{strength}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});