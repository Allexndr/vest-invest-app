import { ScrollView, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react-native';
import { useThemeStore } from '@/stores/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import Animated, { FadeInUp } from 'react-native-reanimated';

const POSITIONS = [
  { ticker: 'KSPI', name: 'Kazakhstan Stock Index', shares: 150, avg: 85.5, price: 92.0, pnlPct: 7.6, value: 13800 },
  { ticker: 'AAPL', name: 'Apple Inc.', shares: 10, avg: 180.0, price: 210.5, pnlPct: 16.9, value: 2105 },
  { ticker: 'BTC', name: 'Bitcoin', shares: 0.05, avg: 85000, price: 97000, pnlPct: 14.1, value: 4850 },
  { ticker: 'ETH', name: 'Ethereum', shares: 1.2, avg: 3200, price: 3650, pnlPct: 14.1, value: 4380 },
  { ticker: 'TSLA', name: 'Tesla Inc.', shares: 5, avg: 220.0, price: 198.5, pnlPct: -9.8, value: 992.5 },
];

export default function PortfolioScreen() {
  const { colors } = useThemeStore();
  const totalValue = POSITIONS.reduce((sum, p) => sum + p.value, 0);
  const totalInvested = POSITIONS.reduce((sum, p) => sum + p.shares * p.avg, 0);
  const totalPnl = totalValue - totalInvested;
  const roiPct = (totalPnl / totalInvested) * 100;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <ThemedText size="2xl" weight="bold">
            Portfolio
          </ThemedText>
          <TouchableOpacity
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.accentMuted }}
          >
            <Plus size={20} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <Animated.View entering={FadeInUp.duration(400)}>
          <Card padding="lg" className="mb-6">
            <ThemedText variant="secondary" size="sm">
              Total Value
            </ThemedText>
            <ThemedText size="3xl" weight="bold" className="mt-1">
              ${totalValue.toLocaleString()}
            </ThemedText>
            <View className="flex-row items-center mt-2">
              <View
                className="px-2 py-1 rounded-full flex-row items-center"
                style={{
                  backgroundColor: totalPnl >= 0 ? colors.successMuted : colors.dangerMuted,
                }}
              >
                {totalPnl >= 0 ? (
                  <ArrowUpRight size={14} color={colors.success} />
                ) : (
                  <ArrowDownRight size={14} color={colors.danger} />
                )}
                <ThemedText
                  variant={totalPnl >= 0 ? 'success' : 'danger'}
                  size="sm"
                  weight="semibold"
                  className="ml-1"
                >
                  {formatPercentage(roiPct)}
                </ThemedText>
              </View>
              <ThemedText variant="secondary" size="sm" className="ml-3">
                {formatCurrency(totalPnl, '$')}
              </ThemedText>
            </View>
          </Card>
        </Animated.View>

        {/* Allocation bar */}
        <View className="mb-6">
          <ThemedText size="lg" weight="semibold" className="mb-3">
            Allocation
          </ThemedText>
          <View className="h-3 rounded-full flex-row overflow-hidden" style={{ backgroundColor: colors.surface }}>
            {POSITIONS.map((p, i) => {
              const pct = (p.value / totalValue) * 100;
              const hues = [175, 200, 25, 280, 15];
              return (
                <View
                  key={p.ticker}
                  style={{
                    width: `${pct}%`,
                    backgroundColor: `hsl(${hues[i]}, 70%, 50%)`,
                  }}
                />
              );
            })}
          </View>
          <View className="flex-row flex-wrap mt-3">
            {POSITIONS.map((p, i) => {
              const hues = [175, 200, 25, 280, 15];
              return (
                <View key={p.ticker} className="flex-row items-center mr-4 mb-2">
                  <View
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: `hsl(${hues[i]}, 70%, 50%)` }}
                  />
                  <ThemedText size="xs">{p.ticker}</ThemedText>
                </View>
              );
            })}
          </View>
        </View>

        {/* Positions List */}
        <ThemedText size="lg" weight="semibold" className="mb-3">
          Positions
        </ThemedText>
        {POSITIONS.map((pos, idx) => {
          const isPositive = pos.pnlPct >= 0;
          return (
            <Animated.View
              key={pos.ticker}
              entering={FadeInUp.delay(idx * 80).duration(400)}
            >
              <TouchableOpacity activeOpacity={0.7} className="mb-3">
                <Card padding="md">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <View
                        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                        style={{ backgroundColor: colors.accentMuted }}
                      >
                        <ThemedText size="sm" weight="bold" variant="accent">
                          {pos.ticker[0]}
                        </ThemedText>
                      </View>
                      <View>
                        <ThemedText size="sm" weight="semibold">
                          {pos.ticker}
                        </ThemedText>
                        <ThemedText variant="secondary" size="xs">
                          {pos.shares} shares
                        </ThemedText>
                      </View>
                    </View>
                    <View className="items-end">
                      <ThemedText size="sm" weight="semibold">
                        ${pos.value.toLocaleString()}
                      </ThemedText>
                      <View className="flex-row items-center mt-1">
                        {isPositive ? (
                          <ArrowUpRight size={12} color={colors.success} />
                        ) : (
                          <ArrowDownRight size={12} color={colors.danger} />
                        )}
                        <ThemedText
                          size="xs"
                          weight="medium"
                          variant={isPositive ? 'success' : 'danger'}
                          className="ml-1"
                        >
                          {formatPercentage(pos.pnlPct)}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
