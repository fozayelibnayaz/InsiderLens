import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MockActivityChart from '../components/MockActivityChart';
import SignalBadge from '../components/SignalBadge';
import { mockTrades } from '../data/mockTrades';
import type { TradeDetailsScreenProps } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';
import {
  formatCompactCurrency,
  formatDate,
  formatFiledDateTime,
  formatFullCurrency,
  formatShares,
} from '../utils/formatters';

type MetricRow = {
  label: string;
  value: string;
  hint?: string;
};

export default function TradeDetailsScreen({ route, navigation }: TradeDetailsScreenProps) {
  const { tradeId } = route.params;

  const trade = useMemo(
    () => mockTrades.find((item) => item.id === tradeId),
    [tradeId],
  );

  // Defensive fallback: a stale/deep link with an unknown id should never crash.
  if (!trade) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.missingWrap}>
          <Pressable
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </Pressable>
          <View style={styles.missingCard}>
            <Ionicons name="alert-circle-outline" size={30} color={colors.textSubtle} />
            <Text style={styles.missingTitle}>Trade not found</Text>
            <Text style={styles.missingCopy}>
              This demo filing is unavailable. Return to the screener to pick another.
            </Text>
            <Pressable
              style={styles.missingButton}
              accessibilityRole="button"
              accessibilityLabel="Go to latest trades"
              onPress={() => navigation.navigate('Screener')}
            >
              <Text style={styles.missingButtonText}>Go to latest trades</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const isPurchase = trade.type === 'purchase';
  const accent = isPurchase ? colors.purchase : colors.sale;
  const typeLabel = isPurchase ? 'Purchase' : 'Sale';
  const trend = isPurchase ? 'up' : 'down';
  const headlineVerb = isPurchase ? 'insider buy' : 'insider sale';

  const metrics: MetricRow[] = [
    { label: 'Insider', value: `${trade.insider} · ${trade.role}` },
    {
      label: 'Transaction',
      value: `${typeLabel} ${isPurchase ? '↑' : '↓'} · Code ${trade.transactionCode}`,
      hint: typeLabel,
    },
    { label: 'Shares', value: formatShares(trade.shares) },
    { label: 'Price per share', value: `${formatFullCurrency(trade.pricePerShare)} (demo)` },
    { label: 'Total value', value: `${formatCompactCurrency(trade.value)} (demo)` },
    { label: 'Transaction date', value: formatDate(trade.transactionDate) },
    { label: 'Filed date', value: formatFiledDateTime(trade.filedAt) },
    { label: 'Signal strength', value: `${trade.signalStrength} · ${trade.signal}` },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top bar with explicit back action */}
        <View style={styles.topBar}>
          <Pressable
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back to previous screen"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={styles.topBarTitle}>Trade details</Text>
          <View style={styles.backButton} />
        </View>

        {/* Company header */}
        <View style={styles.companyHeader}>
          <View style={styles.titleLine}>
            <Text style={styles.companyName}>{trade.company}</Text>
            <View style={styles.demoBadge}>
              <Text style={styles.demoBadgeText}>FICTIONAL DEMO DATA</Text>
            </View>
          </View>
          <Text style={styles.tickerLine}>
            <Text style={styles.ticker}>{trade.ticker}</Text>
            <Text style={styles.sector}> · {trade.sector}</Text>
          </Text>
        </View>

        {/* Prominent signal card */}
        <View style={[styles.signalCard, { borderColor: `${accent}55` }]}>
          <View style={styles.signalCardTop}>
            <View style={[styles.signalIcon, { backgroundColor: `${accent}22` }]}>
              <Ionicons
                name={isPurchase ? 'arrow-up' : 'arrow-down'}
                size={20}
                color={accent}
              />
            </View>
            <SignalBadge strength={trade.signalStrength} />
          </View>
          <Text style={styles.signalName}>{trade.signal}</Text>
          <Text style={styles.signalValue}>
            {formatCompactCurrency(trade.value)} fictional demo {headlineVerb}.
          </Text>
        </View>

        {/* Structured metrics */}
        <Text style={styles.sectionTitle}>Filing breakdown</Text>
        <View style={styles.metricsCard}>
          {metrics.map((metric, index) => {
            const isTransactionMetric = metric.label === 'Transaction';

            return (
              <View
                key={metric.label}
                style={[
                  styles.metricRow,
                  index < metrics.length - 1 && styles.metricDivider,
                ]}
              >
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <View style={styles.metricValueWrap}>
                  {isTransactionMetric && (
                    <View
                      style={[
                        styles.inlineTypePill,
                        { backgroundColor: `${accent}22` },
                      ]}
                    >
                      <Ionicons
                        name={isPurchase ? 'arrow-up' : 'arrow-down'}
                        size={10}
                        color={accent}
                      />
                      <Text style={[styles.inlineTypeText, { color: accent }]}>
                        {metric.hint}
                      </Text>
                    </View>
                  )}
                  <Text
                    style={[
                      styles.metricValue,
                      isTransactionMetric && { color: accent },
                    ]}
                  >
                    {metric.value}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Mock visualisation */}
        <MockActivityChart points={trade.weeklyActivity} trend={trend} />

        {/* Education */}
        <Text style={styles.sectionTitle}>Why this matters</Text>
        <View style={styles.educationCard}>
          <Ionicons name="school-outline" size={18} color={colors.blue} />
          <Text style={styles.educationText}>
            A senior executive {isPurchase ? 'purchase' : 'sale'} can be a data point
            for further research because it shows a disclosed transaction by someone
            close to the company. It does not reveal the person's full financial
            situation or predict future performance.
          </Text>
        </View>

        {/* Required disclaimer, worded exactly as the brief specifies */}
        <View style={styles.disclaimerCard}>
          <View style={styles.disclaimerHeader}>
            <Ionicons name="information-circle-outline" size={16} color={colors.amber} />
            <Text style={styles.disclaimerTitle}>Demo prototype disclaimer</Text>
          </View>
          <Text style={styles.disclaimerText}>
            This prototype uses mock data for demonstration only. Insider-trading
            filings are public disclosures and do not constitute investment advice.
            Past activity does not guarantee future stock performance.
          </Text>
        </View>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
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
  topBarTitle: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
  companyHeader: {
    marginBottom: spacing.md,
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  companyName: {
    flex: 1,
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  demoBadge: {
    backgroundColor: colors.badge,
    borderColor: 'rgba(96, 165, 250, 0.28)',
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 5,
  },
  demoBadgeText: {
    color: colors.blue,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  tickerLine: {
    marginTop: 4,
  },
  ticker: {
    color: colors.blue,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sector: {
    color: colors.textSubtle,
    fontSize: 14,
  },
  signalCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  signalCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  signalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signalName: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '800',
  },
  signalValue: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  metricsCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  metricDivider: {
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  metricLabel: {
    color: colors.textSubtle,
    fontSize: 13,
    flexShrink: 0,
    width: 118,
  },
  metricValueWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 6,
  },
  metricValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
  inlineTypePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  inlineTypeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  educationCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  educationText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  disclaimerCard: {
    backgroundColor: 'rgba(251, 191, 36, 0.08)',
    borderColor: 'rgba(251, 191, 36, 0.3)',
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  disclaimerTitle: {
    color: colors.amber,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  disclaimerText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  // Missing-trade fallback
  missingWrap: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  missingCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  missingTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  missingCopy: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  missingButton: {
    backgroundColor: colors.blue,
    borderRadius: radius.md,
    minHeight: 44,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  missingButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '800',
  },
});