import { View, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Globe, MapPin, Phone, Check, ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/stores/theme';
import { useLanguageStore } from '@/stores/language';
import { LANGUAGES, getLanguage, isRTL } from '@/lib/i18n';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';

const POPULAR_COUNTRIES = [
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', dialCode: '+7' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7' },
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '+90' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', dialCode: '+971' },
  { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86' },
];

const STEPS = ['welcome', 'language', 'country', 'phone'] as const;
type Step = typeof STEPS[number];

export default function OnboardingScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { currentLanguage, setLanguage } = useLanguageStore();
  
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [selectedCountry, setSelectedCountry] = useState(POPULAR_COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchCountry, setSearchCountry] = useState('');

  const stepIndex = STEPS.indexOf(currentStep);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const nextIndex = stepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    } else {
      // Onboarding complete
      router.replace('/(tabs)');
    }
  };

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
    setLanguage(langCode);
    i18n.changeLanguage(langCode);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(handleNext, 300);
  };

  const handleCountrySelect = (country: typeof POPULAR_COUNTRIES[0]) => {
    setSelectedCountry(country);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(handleNext, 300);
  };

  const isRTLLayout = isRTL(selectedLanguage);

  // Welcome Step
  if (currentStep === 'welcome') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          {/* Logo */}
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 30,
              backgroundColor: colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 32,
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <ThemedText style={{ fontSize: 48, fontWeight: 'bold', color: '#fff' }}>
              V
            </ThemedText>
          </View>

          <ThemedText size="3xl" weight="bold" style={{ textAlign: 'center', marginBottom: 12 }}>
            {t('onboarding.welcome')}
          </ThemedText>
          
          <ThemedText variant="secondary" size="lg" style={{ textAlign: 'center', marginBottom: 48 }}>
            {t('onboarding.subtitle')}
          </ThemedText>

          <TouchableOpacity
            onPress={handleNext}
            style={{
              backgroundColor: colors.accent,
              paddingVertical: 18,
              paddingHorizontal: 48,
              borderRadius: 16,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <ThemedText variant="inverse" size="lg" weight="semibold">
              {t('onboarding.getStarted')}
            </ThemedText>
            <ArrowRight size={20} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 24 }}>
            <ThemedText variant="secondary" size="sm">
              {t('onboarding.alreadyHaveAccount')}{' '}
              <ThemedText variant="accent" size="sm" weight="semibold">
                {t('onboarding.signIn')}
              </ThemedText>
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Progress dots */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 32 }}>
          {STEPS.map((step, idx) => (
            <View
              key={step}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: idx === stepIndex ? colors.accent : colors.border,
                marginHorizontal: 4,
              }}
            />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  // Language Selection Step
  if (currentStep === 'language') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Globe size={24} color={colors.accent} />
            <ThemedText size="sm" variant="accent" weight="semibold" style={{ marginLeft: 8 }}>
              Step 1 of 3
            </ThemedText>
          </View>
          <ThemedText size="2xl" weight="bold">
            {t('language.title')}
          </ThemedText>
          <ThemedText variant="secondary" size="sm" style={{ marginTop: 4 }}>
            {t('language.subtitle')}
          </ThemedText>
        </View>

        {/* Progress bar */}
        <View style={{ height: 2, backgroundColor: colors.surface, marginHorizontal: 20, marginBottom: 20 }}>
          <View style={{ width: `${progress}%`, height: 2, backgroundColor: colors.accent }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => handleLanguageSelect(lang.code)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderRadius: 16,
                backgroundColor: selectedLanguage === lang.code ? colors.accentMuted : colors.surface,
                borderWidth: 1,
                borderColor: selectedLanguage === lang.code ? colors.accent : colors.border,
                marginBottom: 12,
              }}
            >
              <ThemedText size="2xl" style={{ marginRight: 12 }}>
                {lang.flag}
              </ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText size="md" weight="semibold">
                  {lang.name}
                </ThemedText>
                <ThemedText variant="secondary" size="xs">
                  {lang.code.toUpperCase()}
                </ThemedText>
              </View>
              {selectedLanguage === lang.code && (
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
                  <Check size={14} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Country Selection Step
  if (currentStep === 'country') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <MapPin size={24} color={colors.accent} />
            <ThemedText size="sm" variant="accent" weight="semibold" style={{ marginLeft: 8 }}>
              Step 2 of 3
            </ThemedText>
          </View>
          <ThemedText size="2xl" weight="bold">
            {t('country.title')}
          </ThemedText>
          <ThemedText variant="secondary" size="sm" style={{ marginTop: 4 }}>
            {t('country.subtitle')}
          </ThemedText>
        </View>

        {/* Progress bar */}
        <View style={{ height: 2, backgroundColor: colors.surface, marginHorizontal: 20, marginBottom: 20 }}>
          <View style={{ width: `${progress}%`, height: 2, backgroundColor: colors.accent }} />
        </View>

        {/* Search */}
        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.surface,
              borderRadius: 12,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Globe size={18} color={colors.textSecondary} />
            <TextInput
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 8,
                color: colors.textPrimary,
                fontSize: 14,
              }}
              placeholder={t('country.search')}
              placeholderTextColor={colors.textSecondary}
              value={searchCountry}
              onChangeText={setSearchCountry}
            />
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0 }}>
          <ThemedText size="sm" variant="secondary" weight="semibold" style={{ marginBottom: 12 }}>
            {t('country.popular')}
          </ThemedText>

          {POPULAR_COUNTRIES.map((country) => (
            <TouchableOpacity
              key={country.code}
              onPress={() => handleCountrySelect(country)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderRadius: 16,
                backgroundColor: selectedCountry.code === country.code ? colors.accentMuted : colors.surface,
                borderWidth: 1,
                borderColor: selectedCountry.code === country.code ? colors.accent : colors.border,
                marginBottom: 12,
              }}
            >
              <ThemedText size="2xl" style={{ marginRight: 12 }}>
                {country.flag}
              </ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText size="md" weight="semibold">
                  {country.name}
                </ThemedText>
                <ThemedText variant="secondary" size="xs">
                  {country.dialCode}
                </ThemedText>
              </View>
              {selectedCountry.code === country.code && (
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
                  <Check size={14} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Phone Input Step
  if (currentStep === 'phone') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Phone size={24} color={colors.accent} />
            <ThemedText size="sm" variant="accent" weight="semibold" style={{ marginLeft: 8 }}>
              Step 3 of 3
            </ThemedText>
          </View>
          <ThemedText size="2xl" weight="bold">
            {t('phone.title')}
          </ThemedText>
          <ThemedText variant="secondary" size="sm" style={{ marginTop: 4 }}>
            {t('phone.subtitle')}
          </ThemedText>
        </View>

        {/* Progress bar */}
        <View style={{ height: 2, backgroundColor: colors.surface, marginHorizontal: 20, marginBottom: 32 }}>
          <View style={{ width: `${progress}%`, height: 2, backgroundColor: colors.accent }} />
        </View>

        <View style={{ padding: 20 }}>
          {/* Phone Input */}
          <Card padding="lg">
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingRight: 12,
                  borderRightWidth: 1,
                  borderRightColor: colors.border,
                }}
              >
                <ThemedText size="xl" style={{ marginRight: 4 }}>
                  {selectedCountry.flag}
                </ThemedText>
                <ThemedText size="md" weight="semibold">
                  {selectedCountry.dialCode}
                </ThemedText>
              </TouchableOpacity>

              <TextInput
                style={{
                  flex: 1,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  color: colors.textPrimary,
                  fontSize: 18,
                  fontWeight: '600',
                }}
                placeholder={t('phone.placeholder')}
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                maxLength={15}
              />
            </View>
          </Card>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleNext}
            disabled={phoneNumber.length < 9}
            style={{
              backgroundColor: phoneNumber.length >= 9 ? colors.accent : colors.surface,
              paddingVertical: 18,
              borderRadius: 16,
              alignItems: 'center',
              marginTop: 24,
            }}
          >
            <ThemedText
              variant={phoneNumber.length >= 9 ? 'inverse' : 'secondary'}
              size="lg"
              weight="semibold"
            >
              {t('phone.continue')}
            </ThemedText>
          </TouchableOpacity>

          {/* Skip for now */}
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)')}
            style={{ alignItems: 'center', marginTop: 16 }}
          >
            <ThemedText variant="secondary" size="sm">
              Skip for now
            </ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}
