import { useMemo, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import FilterChip from '../components/FilterChip';
import TradeCard from '../components/TradeCard';
import { mockTrades } from '../data/mockTrades';
import type { InsiderRole, InsiderTrade, TransactionType } from '../types/trade';
import type { ScreenerScreenProps } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type TypeFilter = 'all' | TransactionType;
type RoleFilter = 'all' | InsiderRole;
// 0 means "no minimum value"; the rest map to the threshold chips.
type ValueFilter = 0 | 100_000 | 500_000 | 1_000_000;

const typeOptions: { label: string; value: TypeFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Purchases', value: 'purchase' },
  { label: 'Sales', value: 'sale' },
];

// "Officer" trades stay reachable under All roles, per the brief.
const roleOptions: { label: string; value: RoleFilter }[] = [
  { label: 'All roles', value: 'all' },
  { label: 'CEO', value: 'CEO' },
  { label: 'CFO', value: 'CFO' },
  { label: 'Director', value: 'Director' },
];

const valueOptions: { label: string; value: ValueFilter }[] = [
  { label: 'Any', value: 0 },
  { label: '$100K+', value: 100_000 },
  { label: '$500K+', value: 500_000 },
  { label: '$1M+', value: 1_000_000 },
];

export default function ScreenerScreen({ route, navigation }: ScreenerScreenProps) {
  // Home asks for the keyboard to be ready when the search entry was tapped.
  const autoFocusSearch = route.params?.focusSearch === true;

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [valueFilter, setValueFilter] = useState<ValueFilter>(0);

  // One derived list keeps search + all three filters in sync. They are
  // independent chip groups, but every condition has to pass together.
  const filteredTrades = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return mockTrades
      .filter((trade) => {
        const matchesQuery =
          query.length === 0 ||
          trade.ticker.toLowerCase().includes(query) ||
          trade.company.toLowerCase().includes(query);

        const matchesType = typeFilter === 'all' || trade.type === typeFilter;
        const matchesRole = roleFilter === 'all' || trade.role === roleFilter;
        const matchesValue = trade.value >= valueFilter;

        return matchesQuery && matchesType && matchesRole && matchesValue;
      })
      .sort((a, b) => b.filedAt.localeCompare(a.filedAt));
  }, [searchQuery, typeFilter, roleFilter, valueFilter]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    typeFilter !== 'all' ||
    roleFilter !== 'all' ||
    valueFilter !== 0;

  const clearAll = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setRoleFilter('all');
    setValueFilter(0);
    Keyboard.dismiss();
  };

  const openTrade = (trade: InsiderTrade) =>
    navigation.navigate('TradeDetails', { tradeId: trade.id });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={filteredTrades}
        keyExtractor={(trade) => trade.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Screen header with explicit back action */}
            <View style={styles.header}>
              <Pressable
                style={styles.backButton}
                accessibilityRole="button"
                accessibilityLabel="Go back to Market Pulse"
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="chevron-back" size={20} color={colors.text} />
              </Pressable>
              <View style={styles.headerCopy}>
                <Text style={styles.title}>Latest trades</Text>
                <Text style={styles.subtitle}>Filter fictional demo filings</Text>
              </View>
              {/* Keeps the title visually centred against the back button */}
              <View style={styles.headerSpacer} />
            </View>

            {/* Search */}
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color={colors.textSubtle} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search ticker or company"
                placeholderTextColor={colors.textSubtle}
                autoFocus={autoFocusSearch}
                autoCapitalize="characters"
                autoCorrect={false}
                returnKeyType="search"
                accessibilityLabel="Search trades by ticker or company name"
                style={styles.searchInput}
              />
              {searchQuery.length > 0 && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear search text"
                  hitSlop={8}
                  onPress={() => setSearchQuery('')}
                >
                  <Ionicons name="close-circle" size={18} color={colors.textSubtle} />
                </Pressable>
              )}
            </View>

            {/* Transaction type */}
            <Text style={styles.groupLabel}>Transaction type</Text>
            <View style={styles.chipRow}>
              {typeOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={typeFilter === option.value}
                  onPress={() => setTypeFilter(option.value)}
                />
              ))}
            </View>

            {/* Insider role */}
            <Text style={styles.groupLabel}>Insider role</Text>
            <View style={styles.chipRow}>
              {roleOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={roleFilter === option.value}
                  onPress={() => setRoleFilter(option.value)}
                />
              ))}
            </View>

            {/* Value threshold */}
            <Text style={styles.groupLabel}>Value threshold</Text>
            <View style={styles.chipRow}>
              {valueOptions.map((option) => (
                <FilterChip
                  key={option.label}
                  label={option.label}
                  selected={valueFilter === option.value}
                  onPress={() => setValueFilter(option.value)}
                />
              ))}
            </View>

            <View style={styles.resultBar}>
              <Text style={styles.resultCount}>
                {filteredTrades.length}{' '}
                {filteredTrades.length === 1 ? 'result' : 'results'}
              </Text>
              {hasActiveFilters && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear search and all filters"
                  onPress={clearAll}
                  style={styles.clearButton}
                >
                  <Ionicons name="refresh" size={13} color={colors.blue} />
                  <Text style={styles.clearText}>Clear filters</Text>
                </Pressable>
              )}
            </View>
          </View>
        }
        renderItem={({ item }) => <TradeCard trade={item} onPress={openTrade} />}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="search-outline" size={26} color={colors.textSubtle} />
            </View>
            <Text style={styles.emptyTitle}>
              No fictional demo trades match those filters.
            </Text>
            <Text style={styles.emptyCopy}>
              Try a different ticker or widen the role, type or value filters.
            </Text>
            <Pressable
              style={styles.emptyButton}
              accessibilityRole="button"
              accessibilityLabel="Clear filters and show all trades"
              onPress={clearAll}
            >
              <Text style={styles.emptyButtonText}>Clear filters</Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerCopy: {
    flex: 1,
    alignItems: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSubtle,
    fontSize: 12,
    marginTop: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    // Keep the input a comfortable height even when the keyboard is open.
    paddingVertical: 0,
  },
  groupLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  resultBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  resultCount: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  clearText: {
    color: colors.blue,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginTop: spacing.lg,
  },
  emptyIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyCopy: {
    color: colors.textSubtle,
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  emptyButton: {
    backgroundColor: colors.blue,
    borderRadius: radius.md,
    minHeight: 44,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  emptyButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '800',
  },
});