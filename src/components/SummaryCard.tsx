import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, radius, spacing } from '../theme/colors';

type IconName = ComponentProps<typeof Ionicons>['name'];

type Props = {
  label: string;
  value: string;
  caption: string;
  icon: IconName;
  tint: string;
};

export default function SummaryCard({ label, value, caption, icon, tint }: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: `${tint}24` }]}>
        <Ionicons name={icon} size={15} color={tint} />
      </View>
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
      <Text style={styles.caption} numberOfLines={2}>
        {caption}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.sm,
    minHeight: 128,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  value: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  caption: {
    color: colors.textSubtle,
    fontSize: 10,
    marginTop: 2,
  },
});