import { ScrollView, View, TouchableOpacity, RefreshControl } from 'react-native';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Flame, Target, Newspaper, Zap, Crown, Lock, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemeStore } from '@/stores/theme';
import { useSubscriptionStore } from '@/stores/subscription';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import Animated, { FadeInUp } from 'react-native-reanimated';

// Mock data for UI demonstration
const MOCK_PORTFOLIO = {
  totalCurrentValue: 2_450_000,
  totalInvested: 2_100_000,
  totalPnl: 350_000,
  roiPct: 16.67,
  positions: [
    { ticker: 'KSPI', name: 'Kazakhstan Stock Index', amount: 150, avgPrice: 85.5, currentPrice: 92.0, pnlPct: 7.6 },
    { ticker: 'AAPL', name: 'Apple Inc.', amount: 10, avgPrice: 180.0, currentPrice: 210.5, pnlPct: 16.9 },
    { ticker: 'BTC-USD', name: 'Bitcoin', amount: 0.05, avgPrice: 85000, currentPrice: 97000, pnlPct: 14.1 },
  ],
};

const MOCK_TICKERS = [
  { ticker: 'USDKZT', label: 'USD/KZT', price: 502.45, change: 0.12 },
  { ticker: 'KSPI', label: 'KSPI', price: 92.15, change: 1.25 },
  { ticker: 'BTC', label: 'BTC', price: 97000, change: -1.5 },
  { ticker: 'ETH', label: 'ETH', price: 3650, change: 0.8 },
];

const MOCK_TASKS = [
  { key: 'login', desc: 'Open app', xp: 50, done: true },
  { key: 'view_stock', desc: 'View any stock', xp: 100, done: false },
  { key: 'lesson', desc: 'Complete a lesson', xp: 200, done: false },
];

export default function DashboardScreen() {
  const { colors } = useThemeStore();
  const { tier, isTrialActive, daysUntilExpiry } = useSubscriptionStore();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const isPositive = MOCK_PORTFOLIO.totalPnl >= 0;
  const isPremium = tier !== 'free' || isTrialActive();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      >
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(400)} className="mb-6">
          <ThemedText variant="secondary" size="sm">
            Good morning,
          </ThemedText>
          <ThemedText size="2xl" weight="bold">
            Investor
          </ThemedText>
          <View className="flex-row items-center mt-1">
            <Flame size={16} color={colors.brandOrange} />
            <ThemedText variant="brand" size="sm" weight="semibold" className="ml-1">
              12 day streak
            </ThemedText>
          </View>
        </Animated.View>

        {/* Premium Upgrade Banner (only for free users) */}
        {!isPremium && (
          <Animated.View entering={FadeInUp.delay(50).duration(400)}>
            <TouchableOpacity
              onPress={() => router.push('/subscribe')}
              className="mb-4"
              activeOpacity={0.9}
            >
              <Card padding="md" style={{ backgroundColor: colors.accentMuted, borderColor: colors.accent }}>
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: colors.accent }}>
                    <Crown size={20} color="#fff" />
                  </View>
                  <View className="flex-1 ml-3">
                    <ThemedText variant="accent" size="sm" weight="semibold">
                      Попробуйте Premium бесплатно
                    </ThemedText>
                    <ThemedText variant="secondary" size="xs">
                      7 дней без ограничений • Отмена в любой момент
                    </ThemedText>
                  </View>
                  <ChevronRight size={20} color={colors.accent} />
                </View>
              </Card>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Trial ending warning */}
        {isTrialActive() && daysUntilExpiry() <= 2 && (
          <Animated.View entering={FadeInUp.delay(50).duration(400)}>
            <TouchableOpacity
              onPress={() => router.push('/subscribe')}
              className="mb-4"
              activeOpacity={0.9}
            >
              <Card padding="md" style={{ backgroundColor: colors.brandOrange + '20', borderColor: colors.brandOrange }}>
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: colors.brandOrange }}>
                    <Lock size={20} color="#fff" />
                  </View>
                  <View className="flex-1 ml-3">
                    <ThemedText style={{ color: colors.brandOrange }} size="sm" weight="semibold">
                      Триал заканчивается через {daysUntilExpiry()} дня
                    </ThemedText>
                    <ThemedText variant="secondary" size="xs">
                      Сохраните доступ ко всем фичам
                    </ThemedText>
                  </View>
                  <ChevronRight size={20} color={colors.brandOrange} />
                </View>
              </Card>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Portfolio Summary Card */}
        <Animated.View entering={FadeInUp.delay(100).duration(500)}>
          <Card padding="lg" className="mb-4">
            <View className="flex-row justify-between items-start mb-4">
              <View>
                <ThemedText variant="secondary" size="sm">
                  Portfolio Value
                </ThemedText>
                <ThemedText size="3xl" weight="bold" className="mt-1">
                  {formatCurrency(MOCK_PORTFOLIO.totalCurrentValue, '₸')}
                </ThemedText>
              </View>
              <View
                className="px-3 py-1 rounded-full"
                style={{
                  backgroundColor: isPositive ? colors.successMuted : colors.dangerMuted,
                }}
              >
                <ThemedText
                  variant={isPositive ? 'success' : 'danger'}
                  size="sm"
                  weight="semibold"
                >
                  {formatPercentage(MOCK_PORTFOLIO.roiPct)}
                </ThemedText>
              </View>
            </View>

            {/* Sparkline placeholder */}
            <View
              className="h-16 rounded-xl mb-4"
              style={{
                backgroundColor: isPositive ? colors.successMuted : colors.dangerMuted,
                opacity: 0.5,
              }}
            />

            <View className="flex-row justify-between">
              <View>
                <ThemedText variant="secondary" size="xs">
                  Invested
                </ThemedText>
                <ThemedText size="sm" weight="medium">
                  {formatCurrency(MOCK_PORTFOLIO.totalInvested, '₸')}
                </ThemedText>
              </View>
              <View>
                <ThemedText variant="secondary" size="xs">
                  P&L
                </ThemedText>
                <ThemedText
                  size="sm"
                  weight="medium"
                  variant={isPositive ? 'success' : 'danger'}
                >
                  {formatCurrency(MOCK_PORTFOLIO.totalPnl, '₸')}
                </ThemedText>
              </View>
              <View>
                <ThemedText variant="secondary" size="xs">
                  Day Change
                </ThemedText>
                <ThemedText size="sm" weight="medium" variant="success">
                  +1.2%
                </ThemedText>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Quick Access Tickers */}
        <Animated.View entering={FadeInUp.delay(200).duration(500)}>
          <ThemedText size="lg" weight="semibold" className="mb-3">
            Market Overview
          </ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {MOCK_TICKERS.map((t) => (
              <TouchableOpacity
                key={t.ticker}
                className="mr-3 p-4 rounded-2xl border"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  minWidth: 120,
                }}
              >
                <ThemedText variant="secondary" size="xs">
                  {t.label}
                </ThemedText>
                <ThemedText size="lg" weight="bold" className="mt-1">
                  {t.ticker === 'BTC' || t.ticker === 'ETH'
                    ? `$${t.price.toLocaleString()}`
                    : t.price.toLocaleString()}
                </ThemedText>
                <ThemedText
                  size="sm"
                  weight="medium"
                  variant={t.change >= 0 ? 'success' : 'danger'}
                  className="mt-1"
                >
                  {t.change >= 0 ? '+' : ''}
                  {t.change}%
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Daily Tasks */}
        <Animated.View entering={FadeInUp.delay(300).duration(500)}>
          <ThemedText size="lg" weight="semibold" className="mb-3">
            Daily Tasks
          </ThemedText>
          <Card padding="md" className="mb-4">
            {MOCK_TASKS.map((task, idx) => (
              <View
                key={task.key}
                className="flex-row items-center justify-between py-3"
                style={{
                  borderBottomWidth: idx < MOCK_TASKS.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                }}
              >
                <View className="flex-row items-center">
                  <View
                    className="w-6 h-6 rounded-full items-center justify-center mr-3"
                    style={{
                      backgroundColor: task.done ? colors.successMuted : colors.accentMuted,
                    }}
                  >
                    {task.done ? (
                      <Zap size={14} color={colors.success} />
                    ) : (
                      <Target size={14} color={colors.accent} />
                    )}
                  </View>
                  <ThemedText size="sm">{task.desc}</ThemedText>
                </View>
                <ThemedText variant="accent" size="sm" weight="semibold">
                  +{task.xp} XP
                </ThemedText>
              </View>
            ))}
          </Card>
        </Animated.View>

        {/* Smart News Widget */}
        <Animated.View entering={FadeInUp.delay(400).duration(500)}>
          <ThemedText size="lg" weight="semibold" className="mb-3">
            Latest News
          </ThemedText>
          <TouchableOpacity activeOpacity={0.8}>
            <Card padding="md" className="mb-4">
              <View className="flex-row items-start">
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                  style={{ backgroundColor: colors.accentMuted }}
                >
                  <Newspaper size={20} color={colors.accent} />
                </View>
                <View className="flex-1">
                  <ThemedText size="sm" weight="semibold" numberOfLines={2}>
                    Kazakhstan Stock Exchange announces new IPO listings for Q3 2026
                  </ThemedText>
                  <ThemedText variant="secondary" size="xs" className="mt-1">
                    KASE News · 2h ago
                  </ThemedText>
                </View>
                <TrendingUp size={16} color={colors.accent} />
              </View>
            </Card>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
