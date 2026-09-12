import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/colors';

// Temporary placeholder, replaced with the real screener in the next part.
export default function ScreenerScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.placeholder}>
        <Text style={styles.text}>Screener coming up next.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  text: {
    color: colors.textMuted,
  },
});