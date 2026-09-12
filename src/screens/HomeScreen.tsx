import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { HomeScreenProps } from '../navigation/types';
import { mockTrades } from '../data/mockTrades';
import type { InsiderTrade } from '../types/trade';
import { colors, radius, spacing } from '../theme/colors';
import { formatCompactCurrency } from '../utils/formatters';
import SummaryCard from '../components/SummaryCard';
import TradeCard from '../components/TradeCard';

type Props = HomeScreenProps;

// Signal labels we want to highlight; each row links to the trade behind it.
const featuredSignals = ['Large CEO Purchase', 'Cluster Buy', 'Executive Sale'];

export default function HomeScreen({ navigation }: Props) {
  // Newest filings first, so reordering the mock file never breaks the feed.
  const latestTrades = useMemo(
    () =>
      [...mockTrades]
        .sort((a, b) => b.filedAt.localeCompare(a.filedAt))
        .slice(0, 4),
    [],
  );

  const topSignals = useMemo(
    () =>
      featuredSignals
        .map((signal) => mockTrades.find((trade) => trade.signal === signal))
        .filter((trade): trade is InsiderTrade => Boolean(trade)),
    [],
  );

  const totals = useMemo(() => {
    const sumValue = (trades: InsiderTrade[]) =>
      trades.reduce((total, trade) => total + trade.value, 0);

    return {
      filed: mockTrades.length,
      purchaseValue: sumValue(mockTrades.filter((t) => t.type === 'purchase')),
      saleValue: sumValue(mockTrades.filter((t) => t.type === 'sale')),
      highSignals: mockTrades.filter((t) => t.signalStrength === 'High').length,
    };
  }, []);

  const openTrade = (trade: InsiderTrade) =>
    navigation.navigate('TradeDetails', { tradeId: trade.id });

  const goToScreener = () =>
    navigation.navigate('Screener', { focusSearch: true });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.kicker}>INSIDERLENS</Text>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Market Pulse</Text>
            <View style={styles.demoBadge}>
              <View style={styles.demoDot} />
              <Text style={styles.demoBadgeText}>Fictional demo data</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>
            Scan notable demo insider activity at a glance.
          </Text>
        </View>

        {/* Tapping this jumps into the screener, where the real input lives. */}
        <Pressable
          style={styles.searchEntry}
          accessibilityRole="button"
          accessibilityLabel="Search ticker or company"
          onPress={goToScreener}
        >
          <Ionicons name="search" size={18} color={colors.textSubtle} />
          <Text style={styles.searchPlaceholder}>Search ticker or company</Text>
        </Pressable>

        {/* Headline totals, all derived from the local mock array */}
        <View style={styles.summaryRow}>
          <SummaryCard
            icon="documents"
            tint={colors.blue}
            label="Transactions"
            value={String(totals.filed)}
            caption="demo filings today"
          />
          <SummaryCard
            icon="arrow-up-circle"
            tint={colors.purchase}
            label="Purchase value"
            value={formatCompactCurrency(totals.purchaseValue)}
            caption="demo purchases"
          />
          <SummaryCard
            icon="arrow-down-circle"
            tint={colors.sale}
            label="Sale value"
            value={formatCompactCurrency(totals.saleValue)}
            caption="demo sales"
          />
        </View>

        <Text style={styles.helperLine}>
          {totals.highSignals} high-strength demo signals today
        </Text>

        {/* Top signals */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top signals today</Text>
        </View>
        <View style={styles.signalCard}>
          {topSignals.map((trade, index) => {
            const isPurchase = trade.type === 'purchase';
            const accent = isPurchase ? colors.purchase : colors.sale;

            return (
              <Pressable
                key={trade.id}
                style={[styles.signalRow, index < topSignals.length - 1 && styles.signalDivider]}
                accessibilityRole="button"
                accessibilityLabel={`${trade.signal} for ${trade.ticker}`}
                onPress={() => openTrade(trade)}
              >
                <View
                  style={[
                    styles.signalIcon,
                    { backgroundColor: isPurchase ? colors.purchaseSoft : colors.saleSoft },
                  ]}
                >
                  <Ionicons
                    name={isPurchase ? 'trending-up' : 'trending-down'}
                    size={16}
                    color={accent}
                  />
                </View>
                <View style={styles.signalCopy}>
                  <Text style={styles.signalName}>{trade.signal}</Text>
                  <Text style={styles.signalMeta} numberOfLines={1}>
                    {trade.ticker} · {trade.insider}, {trade.role}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textSubtle} />
              </Pressable>
            );
          })}
        </View>

        {/* Latest activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest activity</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View all trades"
            onPress={() => navigation.navigate('Screener')}
          >
            <Text style={styles.viewAll}>View all</Text>
          </Pressable>
        </View>

        {latestTrades.map((trade) => (
          <TradeCard key={trade.id} trade={trade} onPress={openTrade} />
        ))}

        <Pressable
          style={styles.browseButton}
          accessibilityRole="button"
          accessibilityLabel="Browse all trades"
          onPress={() => navigation.navigate('Screener')}
        >
          <Ionicons name="list" size={18} color={colors.background} />
          <Text style={styles.browseButtonText}>Browse all trades</Text>
        </Pressable>

        <Text style={styles.footerNote}>
          InsiderLens uses fictional local data only and is not investment advice.
        </Text>
      </ScrollView>
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
    marginBottom: spacing.md,
  },
  kicker: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: 4,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.badge,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.28)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 5,
  },
  demoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.blue,
  },
  demoBadgeText: {
    color: colors.blue,
    fontSize: 10,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 6,
  },
  searchEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    marginBottom: spacing.md,
  },
  searchPlaceholder: {
    color: colors.textSubtle,
    fontSize: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  helperLine: {
    color: colors.textSubtle,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  viewAll: {
    color: colors.blue,
    fontSize: 13,
    fontWeight: '700',
  },
  signalCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
  },
  signalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  signalDivider: {
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  signalIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signalCopy: {
    flex: 1,
  },
  signalName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  signalMeta: {
    color: colors.textSubtle,
    fontSize: 12,
    marginTop: 2,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.blue,
    borderRadius: radius.md,
    height: 50,
    marginTop: spacing.md,
  },
  browseButtonText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '800',
  },
  footerNote: {
    color: colors.textSubtle,
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 16,
  },
});