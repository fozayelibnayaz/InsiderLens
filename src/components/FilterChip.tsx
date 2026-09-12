import { Pressable, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, radius, spacing } from '../theme/colors';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  accessibilityHint?: string;
};

// Pill used across every filter row. Selected state uses colour, a tick and
// the platform "selected" trait so it is not colour-only feedback.
export default function FilterChip({
  label,
  selected,
  onPress,
  accessibilityHint,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityHint={accessibilityHint}
      android_ripple={{ color: 'rgba(167, 139, 250, 0.18)' }}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.chipSelected : styles.chipIdle,
        pressed && styles.pressed,
      ]}
    >
      {selected && <Ionicons name="checkmark" size={12} color={colors.background} />}
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 36,
    borderRadius: radius.sm + 2,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  chipIdle: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
  },
  pressed: {
    opacity: 0.75,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  labelSelected: {
    color: colors.background,
    fontWeight: '800',
  },
});