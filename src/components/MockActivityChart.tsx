import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { colors, radius, spacing } from '../theme/colors';

type Props = {
  // Seven made-up points; the chart never claims to be real market data.
  points: number[];
  trend: 'up' | 'down' | 'flat';
};

const CHART_WIDTH = 320;
const CHART_HEIGHT = 140;
const PADDING = { top: 16, right: 12, bottom: 24, left: 12 };

export default function MockActivityChart({ points, trend }: Props) {
  const highest = Math.max(...points);
  const lowest = Math.min(...points);
  // Avoid dividing by zero if a mock array ever has a constant value.
  const range = highest - lowest || 1;

  const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const coordinates = points.map((value, index) => {
    const x = PADDING.left + (innerWidth / (points.length - 1)) * index;
    const y = PADDING.top + innerHeight - ((value - lowest) / range) * innerHeight;
    return { x, y };
  });

  const linePath = coordinates
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const areaPath =
    `${linePath} L ${coordinates[coordinates.length - 1].x} ${
      PADDING.top + innerHeight
    } L ${coordinates[0].x} ${PADDING.top + innerHeight} Z`;

  const stroke = trend === 'down' ? colors.sale : colors.purchase;
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Mock 7-day activity</Text>
        <View style={[styles.legendPill, { backgroundColor: `${stroke}22` }]}>
          <View style={[styles.legendDot, { backgroundColor: stroke }]} />
          <Text style={[styles.legendText, { color: stroke }]}>
            {trend === 'down' ? 'Cooling' : 'Building'}
          </Text>
        </View>
      </View>

      <Svg
        width="100%"
        height={CHART_HEIGHT}
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        accessibilityLabel="Line chart showing seven fictional activity values"
      >
        {/* Faint guide lines help read the height without pretending to be axes */}
        {[0.25, 0.5, 0.75].map((fraction) => {
          const y = PADDING.top + innerHeight * fraction;
          return (
            <Line
              key={fraction}
              x1={PADDING.left}
              y1={y}
              x2={CHART_WIDTH - PADDING.right}
              y2={y}
              stroke={colors.border}
              strokeWidth={1}
              strokeDasharray="3 5"
            />
          );
        })}

        <Path d={areaPath} fill={stroke} opacity={0.12} />
        <Path
          d={linePath}
          fill="none"
          stroke={stroke}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {coordinates.map((point, index) => (
          <Circle
            key={`${point.x}-${index}`}
            cx={point.x}
            cy={point.y}
            r={index === coordinates.length - 1 ? 5 : 3.5}
            fill={colors.surface}
            stroke={stroke}
            strokeWidth={2}
          />
        ))}
      </Svg>

      <View style={styles.dayRow}>
        {dayLabels.map((day, index) => (
          <Text key={`${day}-${index}`} style={styles.dayLabel}>
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  legendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    marginTop: -2,
  },
  dayLabel: {
    color: colors.textSubtle,
    fontSize: 11,
    width: 24,
    textAlign: 'center',
  },
});