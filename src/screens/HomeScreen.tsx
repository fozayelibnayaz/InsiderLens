import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/colors';
import type { HomeScreenProps } from '../navigation/types';

// Temporary screen used to verify the stack works. Replaced later in this part.
export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.placeholder}>
        <Text style={styles.text}>Navigation skeleton</Text>
        <Button
          title="Open screener"
          onPress={() => navigation.navigate('Screener')}
        />
        <Button
          title="Open trade details"
          onPress={() =>
            navigation.navigate('TradeDetails', {
              tradeId: 'nova-2026-09-10-p',
            })
          }
        />
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
    gap: spacing.sm,
    padding: spacing.xl,
  },
  text: {
    color: colors.text,
    fontSize: 16,
    marginBottom: spacing.sm,
  },
});