import { View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Lock, Crown, Zap } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/stores/theme';
import { useSubscriptionStore, ModuleId, FREE_LIMITS } from '@/stores/subscription';
import { ThemedText } from './ui/ThemedText';

interface FeatureGateProps {
  module: ModuleId;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onLockedPress?: () => void;
}

// Check if feature should be blocked based on usage
export function useFeatureLimit(feature: ModuleId, currentUsage: number) {
  const { tier, canAccess } = useSubscriptionStore();
  
  switch (feature) {
    case 'unlimited_portfolio':
      return tier === 'free' && currentUsage >= FREE_LIMITS.maxPositions;
    case 'academy_full':
      return tier === 'free' && currentUsage >= FREE_LIMITS.maxAcademyLessons;
    case 'alerts':
      return tier === 'free' && currentUsage >= FREE_LIMITS.maxAlerts;
    case 'export_data':
      return tier === 'free' && currentUsage >= FREE_LIMITS.maxExportPerMonth;
    default:
      return !canAccess(feature);
  }
}

// Component that wraps content and shows lock overlay if needed
export function FeatureGate({ module, children, fallback, style, onLockedPress }: FeatureGateProps) {
  const { colors } = useThemeStore();
  const { canAccess, tier } = useSubscriptionStore();
  const hasAccess = canAccess(module);

  if (hasAccess) {
    return <>{children}</>;
  }

  // If custom fallback provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default locked state with preview/teaser
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        onLockedPress?.();
      }}
      style={[
        {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 16,
        },
        style,
      ]}
    >
      {/* Blurred/_dimmed content preview */}
      <View style={{ opacity: 0.3 }}>{children}</View>

      {/* Lock overlay */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.surface + '80',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 16,
        }}
      >
        <View
          style={{
            backgroundColor: colors.accentMuted,
            padding: 16,
            borderRadius: 20,
            alignItems: 'center',
          }}
        >
          <Lock size={24} color={colors.accent} />
          <ThemedText variant="accent" size="sm" weight="semibold" style={{ marginTop: 8 }}>
            Premium
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Soft gate - shows warning but allows interaction
interface SoftGateProps {
  feature: ModuleId;
  currentUsage: number;
  limit?: number;
  onUpgrade: () => void;
  children: React.ReactNode;
}

export function SoftGate({ feature, currentUsage, limit, onUpgrade, children }: SoftGateProps) {
  const { colors } = useThemeStore();
  const { tier } = useSubscriptionStore();
  const isLimited = tier === 'free';
  const actualLimit = limit || FREE_LIMITS[feature as keyof typeof FREE_LIMITS] || 5;
  const percentage = Math.min((currentUsage / actualLimit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <View>
      {children}

      {isLimited && (
        <View style={{ marginTop: 12 }}>
          {/* Progress bar */}
          <View
            style={{
              height: 4,
              backgroundColor: colors.surfaceSecondary,
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                height: 4,
                width: `${percentage}%`,
                backgroundColor: isAtLimit ? colors.danger : isNearLimit ? colors.brandOrange : colors.accent,
                borderRadius: 2,
              }}
            />
          </View>

          {/* Status text */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <ThemedText variant="secondary" size="xs">
              {isAtLimit ? 'Лимит исчерпан' : `${currentUsage}/${actualLimit} использовано`}
            </ThemedText>
            {isNearLimit && !isAtLimit && (
              <TouchableOpacity onPress={onUpgrade}>
                <ThemedText variant="accent" size="xs" weight="medium">
                  Увеличить лимит
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>

          {/* At limit upsell */}
          {isAtLimit && (
            <TouchableOpacity
              onPress={onUpgrade}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.accentMuted,
                padding: 12,
                borderRadius: 12,
                marginTop: 12,
              }}
            >
              <Crown size={16} color={colors.accent} />
              <ThemedText variant="accent" size="sm" weight="semibold" style={{ marginLeft: 8 }}>
                Разблокировать безлимит
              </ThemedText>
              <Zap size={16} color={colors.accent} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

// Paywall preview - shows teaser of premium feature
interface PaywallPreviewProps {
  title: string;
  description: string;
  previewImage?: React.ReactNode;
  requiredTier: string;
  onUpgrade: () => void;
}

export function PaywallPreview({ title, description, previewImage, requiredTier, onUpgrade }: PaywallPreviewProps) {
  const { colors } = useThemeStore();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: 'dashed',
      }}
    >
      {previewImage && (
        <View style={{ marginBottom: 16, opacity: 0.5 }}>{previewImage}</View>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Lock size={16} color={colors.accent} />
        <ThemedText variant="accent" size="xs" weight="medium" style={{ marginLeft: 6 }}>
          {requiredTier}
        </ThemedText>
      </View>

      <ThemedText size="lg" weight="semibold" style={{ marginBottom: 8 }}>
        {title}
      </ThemedText>

      <ThemedText variant="secondary" size="sm" style={{ marginBottom: 16 }}>
        {description}
      </ThemedText>

      <TouchableOpacity
        onPress={onUpgrade}
        style={{
          backgroundColor: colors.accent,
          paddingVertical: 12,
          borderRadius: 12,
          alignItems: 'center',
        }}
      >
        <ThemedText variant="inverse" size="sm" weight="semibold">
          Разблокировать
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}
