import { ScrollView, View, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Shield,
  Bell,
  Moon,
  Globe,
  CreditCard,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  Crown,
} from 'lucide-react-native';
import { useThemeStore } from '@/stores/theme';
import { useSubscriptionStore } from '@/stores/subscription';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { colors, mode, toggle } = useThemeStore();
  const { tier, isTrialActive, daysUntilExpiry } = useSubscriptionStore();
  const router = useRouter();

  const tierNames = { free: 'Free', investor: 'Investor', trader: 'Trader', pro: 'Pro' };
  const tierBadge = tier === 'free' && !isTrialActive()
    ? 'Upgrade to Premium'
    : isTrialActive()
    ? `Trial: ${daysUntilExpiry()} days left`
    : tierNames[tier];

  const menuItems = [
    { icon: User, label: 'Edit Profile', color: colors.accent },
    { icon: Shield, label: 'Security & Biometrics', color: colors.success },
    { icon: Bell, label: 'Notifications', color: colors.brandOrange },
    { icon: CreditCard, label: 'Subscription', color: colors.tierPremium, badge: tierBadge, onPress: () => router.push('/subscribe') },
    { icon: FileText, label: 'Tax Reports', color: colors.textSecondary },
    { icon: HelpCircle, label: 'Help & Support', color: colors.textSecondary },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Header */}
        <ThemedText size="2xl" weight="bold" className="mb-6">
          Profile
        </ThemedText>

        {/* User Card */}
        <Card padding="lg" className="mb-6">
          <View className="flex-row items-center">
            <View
              className="w-16 h-16 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: colors.accentMuted }}
            >
              <User size={28} color={colors.accent} />
            </View>
            <View className="flex-1">
              <ThemedText size="lg" weight="semibold">
                Investor
              </ThemedText>
              <ThemedText variant="secondary" size="sm">
                @investor_kz
              </ThemedText>
              <View
                className="flex-row items-center mt-1 px-2 py-0.5 rounded-full self-start"
                style={{ backgroundColor: colors.tierPremium + '25' }}
              >
                <Crown size={12} color={colors.tierPremium} />
                <ThemedText
                  size="xs"
                  weight="medium"
                  style={{ color: colors.tierPremium }}
                  className="ml-1"
                >
                  Active Trader
                </ThemedText>
              </View>
            </View>
          </View>

          <View className="flex-row justify-between mt-4 pt-4" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
            <View className="items-center">
              <ThemedText size="lg" weight="bold">
                1,250
              </ThemedText>
              <ThemedText variant="secondary" size="xs">
                XP
              </ThemedText>
            </View>
            <View className="items-center">
              <ThemedText size="lg" weight="bold">
                12
              </ThemedText>
              <ThemedText variant="secondary" size="xs">
                Day Streak
              </ThemedText>
            </View>
            <View className="items-center">
              <ThemedText size="lg" weight="bold">
                5
              </ThemedText>
              <ThemedText variant="secondary" size="xs">
                Positions
              </ThemedText>
            </View>
          </View>
        </Card>

        {/* Settings */}
        <ThemedText size="lg" weight="semibold" className="mb-3">
          Settings
        </ThemedText>

        {menuItems.map((item) => (
          <TouchableOpacity key={item.label} activeOpacity={0.7} className="mb-3">
            <Card padding="md">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View
                    className="w-9 h-9 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: item.color + '15' }}
                  >
                    <item.icon size={18} color={item.color} />
                  </View>
                  <View>
                    <ThemedText size="sm" weight="medium">
                      {item.label}
                    </ThemedText>
                    {item.badge && (
                      <ThemedText variant="accent" size="xs">
                        {item.badge}
                      </ThemedText>
                    )}
                  </View>
                </View>
                <ChevronRight size={18} color={colors.textSecondary} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {/* Theme Toggle */}
        <Card padding="md" className="mb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                className="w-9 h-9 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: colors.accentMuted }}
              >
                <Moon size={18} color={colors.accent} />
              </View>
              <ThemedText size="sm" weight="medium">
                Dark Mode
              </ThemedText>
            </View>
            <Switch
              value={mode === 'dark' || mode === 'oled'}
              onValueChange={toggle}
              trackColor={{ false: colors.surfaceSecondary, true: colors.accent }}
              thumbColor="#ffffff"
            />
          </View>
        </Card>

        {/* Language */}
        <TouchableOpacity activeOpacity={0.7} className="mb-6">
          <Card padding="md">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View
                  className="w-9 h-9 rounded-xl items-center justify-center mr-3"
                  style={{ backgroundColor: colors.accentMuted }}
                >
                  <Globe size={18} color={colors.accent} />
                </View>
                <ThemedText size="sm" weight="medium">
                  Language
                </ThemedText>
              </View>
              <View className="flex-row items-center">
                <ThemedText variant="secondary" size="sm">
                  English
                </ThemedText>
                <ChevronRight size={18} color={colors.textSecondary} className="ml-1" />
              </View>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row items-center justify-center py-4 rounded-2xl"
          style={{ backgroundColor: colors.dangerMuted }}
        >
          <LogOut size={18} color={colors.danger} />
          <ThemedText variant="danger" size="sm" weight="semibold" className="ml-2">
            Sign Out
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
