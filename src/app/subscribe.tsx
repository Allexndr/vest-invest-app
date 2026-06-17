import { ScrollView, View, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  Crown,
  Zap,
  TrendingUp,
  Brain,
  FileText,
  ChevronRight,
  Users,
  Clock,
  Shield,
  Check,
  Star,
  ArrowLeft,
  Gift,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/stores/theme';
import { useSubscriptionStore, PRICING, STARS_PRICING, SubscriptionTier } from '@/stores/subscription';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';

const TIER_FEATURES: Record<SubscriptionTier, string[]> = {
  free: ['До 5 позиций в портфеле', '3 базовых урока', '1 актив в watchlist', 'Базовые графики'],
  investor: [
    'Безлимит позиций',
    'Все уроки академии',
    'Экспорт PDF/Excel',
    '5 ценовых алертов',
    'Email поддержка',
  ],
  trader: [
    'Все фичи Investor',
    '15+ индикаторов',
    'AI-аналитика портфеля',
    'Налоговый отчет',
    'Real-time данные',
    'Приоритетная поддержка',
  ],
  pro: [
    'Все фичи Trader',
    'API доступ',
    'Веб-хуки',
    'White-label отчеты',
    'Персональный менеджер',
    'Ранний доступ к фичам',
  ],
};

const PAYMENT_METHODS = [
  { id: 'apple', name: 'Apple Pay', icon: '🍎', available: true },
  { id: 'google', name: 'Google Pay', icon: '🤖', available: true },
  { id: 'stars', name: 'Telegram Stars', icon: '⭐', available: true },
  { id: 'crypto', name: 'Crypto', icon: '₿', available: true },
];

export default function SubscribeScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  const { tier, startTrial, isTrialActive, daysUntilExpiry } = useSubscriptionStore();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('trader');
  const [isYearly, setIsYearly] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('apple');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In real app, this would call IAP or payment API
    // await purchaseSubscription(selectedTier, paymentMethod);

    setIsProcessing(false);
    router.back();
  };

  const handleTrial = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    startTrial();
    router.replace('/(tabs)');
  };

  const tiers: Array<'investor' | 'trader' | 'pro'> = ['investor', 'trader', 'pro'];
  const tierNames = { free: 'Free', investor: 'Investor', trader: 'Trader', pro: 'Pro' };
  const tierColors = {
    investor: colors.accent,
    trader: colors.brandOrange,
    pro: colors.tierPremium,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <ThemedText size="xl" weight="bold">
          Premium
        </ThemedText>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Hero */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.accentMuted,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Crown size={40} color={colors.accent} />
          </View>
          <ThemedText size="2xl" weight="bold" style={{ textAlign: 'center' }}>
            Инвестируйте как профи
          </ThemedText>
          <ThemedText variant="secondary" size="sm" style={{ textAlign: 'center', marginTop: 8, maxWidth: 280 }}>
            47,832 инвесторов уже используют Premium для роста портфеля
          </ThemedText>
        </View>

        {/* Trial Banner */}
        {!isTrialActive() && tier === 'free' && (
          <Card padding="md" style={{ marginBottom: 20, backgroundColor: colors.successMuted }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Gift size={24} color={colors.success} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <ThemedText variant="success" size="sm" weight="semibold">
                  7 дней бесплатно
                </ThemedText>
                <ThemedText variant="secondary" size="xs">
                  Попробуйте Trader без ограничений
                </ThemedText>
              </View>
              <TouchableOpacity
                onPress={handleTrial}
                style={{
                  backgroundColor: colors.success,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                }}
              >
                <ThemedText variant="inverse" size="xs" weight="semibold">
                  Начать
                </ThemedText>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {isTrialActive() && (
          <Card padding="md" style={{ marginBottom: 20, borderColor: colors.accent, borderWidth: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Clock size={24} color={colors.accent} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <ThemedText variant="accent" size="sm" weight="semibold">
                  Триал активен
                </ThemedText>
                <ThemedText variant="secondary" size="xs">
                  Осталось {daysUntilExpiry()} дней
                </ThemedText>
              </View>
            </View>
          </Card>
        )}

        {/* Billing Toggle */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 4,
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => setIsYearly(false)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: isYearly ? 'transparent' : colors.accent,
            }}
          >
            <ThemedText variant={isYearly ? 'primary' : 'inverse'} size="sm" weight="semibold">
              Месяц
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsYearly(true)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: isYearly ? colors.accent : 'transparent',
            }}
          >
            <ThemedText variant={isYearly ? 'inverse' : 'primary'} size="sm" weight="semibold">
              Год (-40%)
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Tier Cards */}
        {tiers.map((t, index) => {
          const isSelected = selectedTier === t;
          const price = isYearly ? PRICING[t].yearly : PRICING[t].monthly;
          const starsPrice = STARS_PRICING[t];
          const isPopular = t === 'trader';
          const color = tierColors[t];

          return (
            <TouchableOpacity
              key={t}
              onPress={() => {
                setSelectedTier(t);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={{
                marginBottom: 12,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: isSelected ? color : colors.border,
                backgroundColor: colors.surface,
                overflow: 'hidden',
              }}
            >
              {/* Popular badge */}
              {isPopular && (
                <View
                  style={{
                    backgroundColor: color,
                    paddingVertical: 4,
                    alignItems: 'center',
                  }}
                >
                  <ThemedText variant="inverse" size="xs" weight="semibold">
                    Популярный выбор
                  </ThemedText>
                </View>
              )}

              <View style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: color + '20',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {t === 'investor' && <TrendingUp size={20} color={color} />}
                      {t === 'trader' && <Zap size={20} color={color} />}
                      {t === 'pro' && <Crown size={20} color={color} />}
                    </View>
                    <View style={{ marginLeft: 12 }}>
                      <ThemedText size="lg" weight="semibold">
                        {tierNames[t]}
                      </ThemedText>
                      <ThemedText variant="secondary" size="xs">
                        {isYearly ? `$${price}/год` : `$${price}/мес`} • {starsPrice}⭐
                      </ThemedText>
                    </View>
                  </View>

                  {/* Selection indicator */}
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: isSelected ? color : colors.border,
                      backgroundColor: isSelected ? color : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isSelected && <Check size={14} color="#fff" />}
                  </View>
                </View>

                {/* Features */}
                <View style={{ marginTop: 12, marginLeft: 52 }}>
                  {TIER_FEATURES[t].slice(0, 3).map((feature, idx) => (
                    <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <Check size={12} color={colors.success} />
                      <ThemedText size="xs" variant="secondary" style={{ marginLeft: 6 }}>
                        {feature}
                      </ThemedText>
                    </View>
                  ))}
                  {TIER_FEATURES[t].length > 3 && (
                    <ThemedText variant="accent" size="xs" style={{ marginTop: 4 }}>
                      +{TIER_FEATURES[t].length - 3} фичи
                    </ThemedText>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Payment Methods */}
        <ThemedText size="sm" weight="semibold" style={{ marginBottom: 12, marginTop: 8 }}>
          Способ оплаты
        </ThemedText>

        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setPaymentMethod(method.id)}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: paymentMethod === method.id ? colors.accentMuted : colors.surface,
                marginHorizontal: 4,
                borderWidth: 1,
                borderColor: paymentMethod === method.id ? colors.accent : colors.border,
              }}
            >
              <ThemedText size="xl">{method.icon}</ThemedText>
              <ThemedText
                size="xs"
                variant={paymentMethod === method.id ? 'accent' : 'secondary'}
                weight={paymentMethod === method.id ? 'medium' : 'normal'}
                style={{ marginTop: 4 }}
              >
                {method.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Trust indicators */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 80 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
            <Shield size={14} color={colors.textSecondary} />
            <ThemedText variant="secondary" size="xs" style={{ marginLeft: 4 }}>
              Безопасно
            </ThemedText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
            <Users size={14} color={colors.textSecondary} />
            <ThemedText variant="secondary" size="xs" style={{ marginLeft: 4 }}>
              47K+ пользователей
            </ThemedText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Star size={14} color={colors.textSecondary} />
            <ThemedText variant="secondary" size="xs" style={{ marginLeft: 4 }}>
              4.9★
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 16,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <TouchableOpacity
          onPress={handleSubscribe}
          disabled={isProcessing}
          style={{
            backgroundColor: colors.accent,
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: 'center',
            opacity: isProcessing ? 0.7 : 1,
          }}
        >
          <ThemedText variant="inverse" size="sm" weight="semibold">
            {isProcessing
              ? 'Обработка...'
              : `Подписаться • $${isYearly ? PRICING[selectedTier].yearly : PRICING[selectedTier].monthly}`}
          </ThemedText>
        </TouchableOpacity>

        <ThemedText
          variant="secondary"
          size="xs"
          style={{ textAlign: 'center', marginTop: 12 }}
        >
          Оплата безопасна • Отмена в любой момент • 7 дней гарантия
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}
