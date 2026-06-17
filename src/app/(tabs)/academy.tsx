import { ScrollView, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Trophy, Lock, CheckCircle } from 'lucide-react-native';
import { useThemeStore } from '@/stores/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';
import Animated, { FadeInUp } from 'react-native-reanimated';

const TRACKS = [
  {
    id: 'start',
    title: 'Start',
    emoji: '🌱',
    desc: 'Basics of investing',
    lessons: 5,
    completed: 3,
    color: '#34d399',
  },
  {
    id: 'pro',
    title: 'Pro',
    emoji: '📈',
    desc: 'Advanced strategies',
    lessons: 8,
    completed: 1,
    color: '#32b8c6',
  },
  {
    id: 'guru',
    title: 'Guru',
    emoji: '🧠',
    desc: 'Expert level',
    lessons: 10,
    completed: 0,
    locked: true,
    color: '#9b87d4',
  },
];

const BADGES = [
  { id: 'first_buy', name: 'First Buy', icon: '🛒', earned: true },
  { id: 'streak_7', name: 'Week Streak', icon: '🔥', earned: true },
  { id: 'tax_master', name: 'Tax Master', icon: '📊', earned: false },
  { id: 'portfolio_pro', name: 'Portfolio Pro', icon: '💼', earned: false },
];

export default function AcademyScreen() {
  const { colors } = useThemeStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <ThemedText size="2xl" weight="bold">
              Academy
            </ThemedText>
            <ThemedText variant="secondary" size="sm">
              Level up your investing skills
            </ThemedText>
          </View>
          <View className="flex-row items-center">
            <Trophy size={18} color={colors.brandOrange} />
            <ThemedText size="sm" weight="semibold" className="ml-1" variant="brand">
              1,250 XP
            </ThemedText>
          </View>
        </View>

        {/* Progress Overview */}
        <Animated.View entering={FadeInUp.duration(400)}>
          <Card padding="lg" className="mb-6">
            <View className="flex-row items-center mb-4">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: colors.accentMuted }}
              >
                <BookOpen size={24} color={colors.accent} />
              </View>
              <View>
                <ThemedText size="lg" weight="semibold">
                  Investor Level
                </ThemedText>
                <ThemedText variant="accent" size="sm" weight="medium">
                  Pro
                </ThemedText>
              </View>
            </View>
            <View className="h-2 rounded-full" style={{ backgroundColor: colors.surfaceSecondary }}>
              <View
                className="h-2 rounded-full"
                style={{
                  width: '65%',
                  backgroundColor: colors.accent,
                }}
              />
            </View>
            <ThemedText variant="secondary" size="xs" className="mt-2 text-right">
              650 / 1000 XP to Guru
            </ThemedText>
          </Card>
        </Animated.View>

        {/* Learning Tracks */}
        <ThemedText size="lg" weight="semibold" className="mb-3">
          Learning Tracks
        </ThemedText>
        {TRACKS.map((track, idx) => (
          <Animated.View key={track.id} entering={FadeInUp.delay(idx * 100).duration(400)}>
            <TouchableOpacity activeOpacity={0.7} className="mb-3">
              <Card padding="md">
                <View className="flex-row items-center">
                  <View
                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                    style={{ backgroundColor: `${track.color}20` }}
                  >
                    <ThemedText size="2xl">{track.emoji}</ThemedText>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <ThemedText size="sm" weight="semibold">
                        {track.title}
                      </ThemedText>
                      {track.locked && (
                        <Lock size={14} color={colors.textSecondary} className="ml-2" />
                      )}
                    </View>
                    <ThemedText variant="secondary" size="xs">
                      {track.desc}
                    </ThemedText>
                    <View className="flex-row items-center mt-2">
                      <View
                        className="h-1.5 rounded-full flex-1 mr-2"
                        style={{ backgroundColor: colors.surfaceSecondary }}
                      >
                        <View
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${(track.completed / track.lessons) * 100}%`,
                            backgroundColor: track.color,
                          }}
                        />
                      </View>
                      <ThemedText variant="secondary" size="xs">
                        {track.completed}/{track.lessons}
                      </ThemedText>
                    </View>
                  </View>
                  {track.completed === track.lessons && (
                    <CheckCircle size={20} color={colors.success} />
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* Badges */}
        <ThemedText size="lg" weight="semibold" className="mb-3 mt-2">
          Badges
        </ThemedText>
        <View className="flex-row flex-wrap">
          {BADGES.map((badge, idx) => (
            <View key={badge.id} className="w-1/2 pr-2 mb-3">
              <Card padding="md">
                <View className="items-center">
                  <ThemedText size="3xl" style={{ opacity: badge.earned ? 1 : 0.3 }}>
                    {badge.icon}
                  </ThemedText>
                  <ThemedText
                    size="sm"
                    weight="medium"
                    className="mt-2"
                    style={{ opacity: badge.earned ? 1 : 0.5 }}
                  >
                    {badge.name}
                  </ThemedText>
                </View>
              </Card>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
