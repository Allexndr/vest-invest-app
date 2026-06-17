import { ScrollView, View, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, TrendingUp, TrendingDown, Star } from 'lucide-react-native';
import { useState } from 'react';
import { useThemeStore } from '@/stores/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';
import Animated, { FadeInUp } from 'react-native-reanimated';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'kz', label: 'Kazakhstan' },
  { id: 'us', label: 'US Stocks' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'forex', label: 'Forex' },
];

const ASSETS = [
  { ticker: 'KSPI', name: 'Kazakhstan Stock Index', price: 92.15, change: 1.25, category: 'kz' },
  { ticker: 'Halyk', name: 'Halyk Bank', price: 185.5, change: 0.85, category: 'kz' },
  { ticker: 'KCEL', name: 'KazMunaiGas', price: 12.4, change: -0.3, category: 'kz' },
  { ticker: 'AAPL', name: 'Apple Inc.', price: 210.5, change: 2.1, category: 'us' },
  { ticker: 'TSLA', name: 'Tesla Inc.', price: 198.5, change: -4.2, category: 'us' },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', price: 142.8, change: 3.5, category: 'us' },
  { ticker: 'BTC', name: 'Bitcoin', price: 97000, change: -1.5, category: 'crypto' },
  { ticker: 'ETH', name: 'Ethereum', price: 3650, change: 0.8, category: 'crypto' },
  { ticker: 'SOL', name: 'Solana', price: 158.2, change: 5.2, category: 'crypto' },
  { ticker: 'USDKZT', name: 'USD/KZT', price: 502.45, change: 0.12, category: 'forex' },
];

export default function MarketScreen() {
  const { colors } = useThemeStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = ASSETS.filter((a) => {
    const matchesCategory = activeCategory === 'all' || a.category === activeCategory;
    const matchesSearch =
      search === '' ||
      a.ticker.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16 }}>
        <ThemedText size="2xl" weight="bold" className="mb-4">
          Market
        </ThemedText>

        {/* Search */}
        <View
          className="flex-row items-center px-4 py-3 rounded-2xl mb-4"
          style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
        >
          <Search size={18} color={colors.textSecondary} />
          <TextInput
            className="flex-1 ml-2 text-sm"
            style={{ color: colors.textPrimary }}
            placeholder="Search stocks, crypto..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveCategory(cat.id)}
              className="px-4 py-2 rounded-full mr-2"
              style={{
                backgroundColor:
                  activeCategory === cat.id ? colors.accent : colors.surface,
                borderWidth: 1,
                borderColor: activeCategory === cat.id ? colors.accent : colors.border,
              }}
            >
              <ThemedText
                size="sm"
                weight={activeCategory === cat.id ? 'semibold' : 'medium'}
                variant={activeCategory === cat.id ? 'inverse' : 'primary'}
              >
                {cat.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 0 }}>
        {filtered.map((asset, idx) => {
          const isPositive = asset.change >= 0;
          return (
            <Animated.View key={asset.ticker} entering={FadeInUp.delay(idx * 50).duration(400)}>
              <TouchableOpacity activeOpacity={0.7} className="mb-3">
                <Card padding="md">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <View
                        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                        style={{ backgroundColor: colors.accentMuted }}
                      >
                        <ThemedText size="sm" weight="bold" variant="accent">
                          {asset.ticker.slice(0, 2)}
                        </ThemedText>
                      </View>
                      <View>
                        <ThemedText size="sm" weight="semibold">
                          {asset.ticker}
                        </ThemedText>
                        <ThemedText variant="secondary" size="xs">
                          {asset.name}
                        </ThemedText>
                      </View>
                    </View>
                    <View className="items-end">
                      <ThemedText size="sm" weight="semibold">
                        {asset.category === 'crypto'
                          ? `$${asset.price.toLocaleString()}`
                          : asset.price.toLocaleString()}
                      </ThemedText>
                      <View className="flex-row items-center mt-1">
                        {isPositive ? (
                          <TrendingUp size={12} color={colors.success} />
                        ) : (
                          <TrendingDown size={12} color={colors.danger} />
                        )}
                        <ThemedText
                          size="xs"
                          weight="medium"
                          variant={isPositive ? 'success' : 'danger'}
                          className="ml-1"
                        >
                          {isPositive ? '+' : ''}
                          {asset.change}%
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
