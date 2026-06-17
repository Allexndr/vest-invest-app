import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Bell, Star, TrendingUp, TrendingDown } from 'lucide-react-native';
import { useState } from 'react';
import { useThemeStore } from '@/stores/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';
import { formatPercentage } from '@/lib/utils';

const TIMEFRAMES = ['1D', '1W', '1M', '3M', '1Y', '5Y'];

const MOCK_ASSET = {
  ticker: 'AAPL',
  name: 'Apple Inc.',
  price: 210.5,
  change: 4.3,
  changePct: 2.09,
  marketCap: '3.2T',
  pe: 32.4,
  dividend: 0.55,
  volume: '58.2M',
  high: 212.1,
  low: 206.8,
  open: 207.0,
  prevClose: 206.2,
};

export default function AssetDetailScreen() {
  const { ticker } = useLocalSearchParams<{ ticker: string }>();
  const { colors } = useThemeStore();
  const router = useRouter();
  const [activeTimeframe, setActiveTimeframe] = useState('1D');
  const isPositive = MOCK_ASSET.change >= 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View className="items-center">
          <ThemedText size="sm" weight="semibold">
            {ticker}
          </ThemedText>
          <ThemedText variant="secondary" size="xs">
            {MOCK_ASSET.name}
          </ThemedText>
        </View>
        <View className="flex-row">
          <TouchableOpacity className="p-2 mr-1">
            <Bell size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <Star size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Price */}
        <View className="mb-6">
          <ThemedText size="4xl" weight="bold">
            ${MOCK_ASSET.price.toFixed(2)}
          </ThemedText>
          <View className="flex-row items-center mt-1">
            {isPositive ? (
              <TrendingUp size={18} color={colors.success} />
            ) : (
              <TrendingDown size={18} color={colors.danger} />
            )}
            <ThemedText
              variant={isPositive ? 'success' : 'danger'}
              size="sm"
              weight="semibold"
              className="ml-1"
            >
              {isPositive ? '+' : ''}
              {MOCK_ASSET.change.toFixed(2)} ({formatPercentage(MOCK_ASSET.changePct)})
            </ThemedText>
          </View>
        </View>

        {/* Timeframes */}
        <View className="flex-row mb-4">
          {TIMEFRAMES.map((tf) => (
            <TouchableOpacity
              key={tf}
              onPress={() => setActiveTimeframe(tf)}
              className="flex-1 py-2 mx-1 rounded-xl items-center"
              style={{
                backgroundColor:
                  activeTimeframe === tf ? colors.accent : colors.surface,
              }}
            >
              <ThemedText
                size="sm"
                weight={activeTimeframe === tf ? 'semibold' : 'medium'}
                variant={activeTimeframe === tf ? 'inverse' : 'primary'}
              >
                {tf}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart Placeholder */}
        <Card padding="lg" className="mb-6">
          <View
            className="h-48 rounded-xl items-center justify-center"
            style={{ backgroundColor: colors.surfaceSecondary }}
          >
            <ThemedText variant="secondary" size="sm">
              Interactive Chart Coming Soon
            </ThemedText>
          </View>
        </Card>

        {/* Stats Grid */}
        <ThemedText size="lg" weight="semibold" className="mb-3">
          Key Statistics
        </ThemedText>
        <View className="flex-row flex-wrap">
          {[
            { label: 'Market Cap', value: MOCK_ASSET.marketCap },
            { label: 'P/E Ratio', value: MOCK_ASSET.pe.toString() },
            { label: 'Dividend', value: `$${MOCK_ASSET.dividend}` },
            { label: 'Volume', value: MOCK_ASSET.volume },
            { label: 'High', value: `$${MOCK_ASSET.high}` },
            { label: 'Low', value: `$${MOCK_ASSET.low}` },
            { label: 'Open', value: `$${MOCK_ASSET.open}` },
            { label: 'Prev Close', value: `$${MOCK_ASSET.prevClose}` },
          ].map((stat) => (
            <View key={stat.label} className="w-1/2 pr-2 mb-3">
              <Card padding="md">
                <ThemedText variant="secondary" size="xs">
                  {stat.label}
                </ThemedText>
                <ThemedText size="sm" weight="semibold" className="mt-1">
                  {stat.value}
                </ThemedText>
              </Card>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View className="flex-row mt-4">
          <TouchableOpacity
            className="flex-1 py-4 rounded-2xl mr-2 items-center"
            style={{ backgroundColor: colors.success }}
          >
            <ThemedText variant="inverse" size="sm" weight="semibold">
              Buy
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-4 rounded-2xl ml-2 items-center"
            style={{ backgroundColor: colors.danger }}
          >
            <ThemedText variant="inverse" size="sm" weight="semibold">
              Sell
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
