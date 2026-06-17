import { View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { X, Crown, Zap, TrendingUp, Brain, FileText, ChevronRight, Users, Clock, Shield } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/stores/theme';
import { useSubscriptionStore, PRICING, SubscriptionTier } from '@/stores/subscription';
import { ThemedText } from './ui/ThemedText';
import { Card } from './ui/Card';

interface UpsellConfig {
  trigger: string;
  tier: SubscriptionTier;
  icon: typeof Crown;
  title: string;
  subtitle: string;
  benefits: string[];
  socialProof?: string;
  urgency?: string;
}

const UPSELL_CONFIGS: Record<string, UpsellConfig> = {
  portfolio_limit: {
    trigger: 'portfolio_full',
    tier: 'investor',
    icon: TrendingUp,
    title: 'Портфель заполнен',
    subtitle: 'Вы отслеживаете 5 позиций — лимит Free. Инвестор+ дает безлимит.',
    benefits: ['Безлимит позиций', 'Экспорт в Excel/PDF', 'Детальная аналитика', 'Приоритетная поддержка'],
    socialProof: '47,832 инвесторов уже используют',
  },
  chart_features: {
    trigger: 'chart_power_user',
    tier: 'trader',
    icon: Zap,
    title: 'Профессиональные графики',
    subtitle: 'RSI, MACD, Bollinger Bands и 15+ индикаторов в Trader',
    benefits: ['15+ технических индикаторов', 'Несколько таймфреймов', 'Сравнение активов', 'AI-прогнозы цен'],
    socialProof: 'Трейдеры делают на 23% лучше с аналитикой',
  },
  academy_progress: {
    trigger: 'academy_engaged',
    tier: 'investor',
    icon: Brain,
    title: 'Вы настойчивы! 🎓',
    subtitle: 'Прошли 3 урока — продолжите обучение с полным доступом',
    benefits: ['Все треки обучения', 'Boss Battles', 'Сертификаты', 'Эксклюзивные вебинары'],
    urgency: 'Только сегодня: скидка 50% первый месяц',
  },
  ai_insight: {
    trigger: 'ai_preview',
    tier: 'trader',
    icon: Brain,
    title: 'AI видит то, что вы не видите',
    subtitle: 'Наш AI проанализировал ваш портфель. Хотите увидеть рекомендации?',
    benefits: ['Персональные рекомендации', 'Риск-анализ портфеля', 'Оптимизация налогов', 'Алерты о возможностях'],
    socialProof: 'AI предсказал рост BTC на 15% в прошлом месяце',
  },
  trial_ending: {
    trigger: 'trial_ending',
    tier: 'trader',
    icon: Clock,
    title: 'Осталось 24 часа ⏰',
    subtitle: 'Ваш Premium триал заканчивается. Сохраните доступ ко всем фичам',
    benefits: ['Продолжайте без прерываний', 'Сохраните все настройки', 'Не потеряйте прогресс обучения'],
    urgency: 'Скидка 40% если продлите сегодня',
  },
};

interface PremiumUpsellProps {
  visible: boolean;
  onClose: () => void;
  trigger: string;
  onSubscribe: (tier: SubscriptionTier) => void;
}

export function PremiumUpsell({ visible, onClose, trigger, onSubscribe }: PremiumUpsellProps) {
  const { colors } = useThemeStore();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('investor');
  const [isYearly, setIsYearly] = useState(true);
  const config = UPSELL_CONFIGS[trigger] || UPSELL_CONFIGS.portfolio_limit;
  const Icon = config.icon;

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [visible]);

  const tiers: SubscriptionTier[] = ['investor', 'trader', 'pro'];
  const tierNames = { free: 'Free', investor: 'Investor', trader: 'Trader', pro: 'Pro' };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' }}>
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: '90%',
          }}
        >
          {/* Header */}
          <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: colors.accentMuted,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={20} color={colors.accent} />
                </View>
                <ThemedText size="lg" weight="semibold" style={{ marginLeft: 12 }}>
                  {config.title}
                </ThemedText>
              </View>
              <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ThemedText variant="secondary" size="sm" style={{ marginTop: 8, marginLeft: 52 }}>
              {config.subtitle}
            </ThemedText>
          </View>

          <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
            {/* Social Proof */}
            {config.socialProof && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.accentMuted,
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 16,
                }}
              >
                <Users size={16} color={colors.accent} />
                <ThemedText variant="accent" size="sm" weight="medium" style={{ marginLeft: 8 }}>
                  {config.socialProof}
                </ThemedText>
              </View>
            )}

            {/* Urgency */}
            {config.urgency && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.brandOrange + '20',
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 16,
                }}
              >
                <Clock size={16} color={colors.brandOrange} />
                <ThemedText variant="brand" size="sm" weight="semibold" style={{ marginLeft: 8 }}>
                  {config.urgency}
                </ThemedText>
              </View>
            )}

            {/* Benefits */}
            <ThemedText size="sm" weight="semibold" style={{ marginBottom: 12 }}>
              Что вы получаете:
            </ThemedText>
            {config.benefits.map((benefit, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: colors.successMuted,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrendingUp size={12} color={colors.success} />
                </View>
                <ThemedText size="sm" style={{ marginLeft: 10 }}>
                  {benefit}
                </ThemedText>
              </View>
            ))}

            {/* Tier Selector */}
            <View style={{ marginTop: 24 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <ThemedText size="sm" weight="semibold">Выберите план</ThemedText>
                <TouchableOpacity onPress={() => setIsYearly(!isYearly)}>
                  <ThemedText variant="accent" size="sm">
                    {isYearly ? 'Годовой (экономия 40%)' : 'Ежемесячный'}
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {tiers.map((tier) => {
                const isSelected = selectedTier === tier;
                const price = isYearly ? PRICING[tier].yearly : PRICING[tier].monthly;
                const isPopular = tier === 'trader';

                return (
                  <TouchableOpacity
                    key={tier}
                    onPress={() => {
                      setSelectedTier(tier);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      borderRadius: 16,
                      borderWidth: 2,
                      borderColor: isSelected ? colors.accent : colors.border,
                      backgroundColor: isSelected ? colors.accentMuted : colors.surface,
                      marginBottom: 12,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <ThemedText size="sm" weight="semibold">
                          {tierNames[tier]}
                        </ThemedText>
                        {isPopular && (
                          <View
                            style={{
                              backgroundColor: colors.brandOrange,
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                              borderRadius: 8,
                              marginLeft: 8,
                            }}
                          >
                            <ThemedText size="xs" variant="inverse" weight="semibold">
                              Популярный
                            </ThemedText>
                          </View>
                        )}
                      </View>
                      <ThemedText variant="secondary" size="xs">
                        {isYearly ? `$${price}/год` : `$${price}/мес`}
                      </ThemedText>
                    </View>
                    {isSelected && (
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: colors.accent,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <TrendingUp size={14} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Guarantee */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 16,
                marginBottom: 80,
              }}
            >
              <Shield size={14} color={colors.textSecondary} />
              <ThemedText variant="secondary" size="xs" style={{ marginLeft: 6 }}>
                7 дней гарантия возврата
              </ThemedText>
            </View>
          </ScrollView>

          {/* CTA Button */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 20,
              backgroundColor: colors.background,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                onSubscribe(selectedTier);
              }}
              style={{
                backgroundColor: colors.accent,
                paddingVertical: 16,
                borderRadius: 16,
                alignItems: 'center',
              }}
            >
              <ThemedText variant="inverse" size="sm" weight="semibold">
                Получить {tierNames[selectedTier]} • ${isYearly ? PRICING[selectedTier].yearly : PRICING[selectedTier].monthly}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={{ alignItems: 'center', marginTop: 12 }}>
              <ThemedText variant="secondary" size="xs">
                Продолжить бесплатно (с ограничениями)
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
