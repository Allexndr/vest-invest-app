import { ScrollView, View, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Fingerprint, ScanFace, Lock, ChevronRight, Check, AlertCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/stores/theme';
import { 
  checkBiometricSupport, 
  authenticateWithBiometrics, 
  getBiometricName,
  type BiometricType 
} from '@/lib/biometrics';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';

export default function BiometricsScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  const { t } = useTranslation();
  
  const [biometricStatus, setBiometricStatus] = useState<{
    available: boolean;
    enrolled: boolean;
    type: BiometricType;
    error?: string;
  } | null>(null);
  
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBiometricStatus();
  }, []);

  const loadBiometricStatus = async () => {
    const status = await checkBiometricSupport();
    setBiometricStatus(status);
    setIsLoading(false);
  };

  const handleToggleBiometrics = async (value: boolean) => {
    if (value) {
      // Enabling - require authentication to confirm
      const auth = await authenticateWithBiometrics('Authenticate to enable biometric login');
      if (auth.success) {
        setIsEnabled(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // TODO: Save to secure storage
      } else {
        setIsEnabled(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } else {
      // Disabling - just require device auth
      const auth = await authenticateWithBiometrics('Authenticate to disable biometric login', true);
      if (auth.success) {
        setIsEnabled(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  const testBiometric = async () => {
    const auth = await authenticateWithBiometrics('Test authentication');
    if (auth.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const getIcon = () => {
    if (biometricStatus?.type === 'facial-recognition') return ScanFace;
    if (biometricStatus?.type === 'fingerprint') return Fingerprint;
    return Lock;
  };

  const Icon = getIcon();

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ThemedText variant="secondary">Loading...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
          <ChevronRight size={24} color={colors.textPrimary} style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
        <ThemedText size="xl" weight="bold">
          Security & Biometrics
        </ThemedText>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Status Card */}
        <Card padding="lg" style={{ marginBottom: 20 }}>
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: biometricStatus?.available ? colors.successMuted : colors.dangerMuted,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Icon 
                size={40} 
                color={biometricStatus?.available ? colors.success : colors.danger} 
              />
            </View>
            
            <ThemedText size="xl" weight="bold" style={{ marginBottom: 8 }}>
              {biometricStatus?.available 
                ? getBiometricName(biometricStatus.type) 
                : 'Not Available'}
            </ThemedText>
            
            <ThemedText variant="secondary" size="sm" style={{ textAlign: 'center' }}>
              {biometricStatus?.available && biometricStatus.enrolled
                ? 'Your device supports biometric authentication'
                : biometricStatus?.available && !biometricStatus.enrolled
                ? 'Please set up biometric authentication in device settings'
                : 'Your device does not support biometric authentication'}
            </ThemedText>
          </View>
        </Card>

        {/* Enable/Disable Toggle */}
        {biometricStatus?.available && biometricStatus.enrolled && (
          <Card padding="md" style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Shield size={24} color={colors.accent} />
                <View style={{ marginLeft: 12 }}>
                  <ThemedText size="sm" weight="semibold">
                    Use {getBiometricName(biometricStatus.type)}
                  </ThemedText>
                  <ThemedText variant="secondary" size="xs">
                    For app unlock and transactions
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={isEnabled}
                onValueChange={handleToggleBiometrics}
                trackColor={{ false: colors.surface, true: colors.accent }}
                thumbColor="#fff"
              />
            </View>
          </Card>
        )}

        {/* Test Button */}
        {biometricStatus?.available && biometricStatus.enrolled && (
          <TouchableOpacity
            onPress={testBiometric}
            style={{
              backgroundColor: colors.accent,
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <ThemedText variant="inverse" size="sm" weight="semibold">
              Test Authentication
            </ThemedText>
          </TouchableOpacity>
        )}

        {/* Security Options */}
        <ThemedText size="sm" weight="semibold" style={{ marginBottom: 12, marginTop: 8 }}>
          Security Options
        </ThemedText>

        <Card padding="md" style={{ marginBottom: 12 }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
            <Lock size={20} color={colors.textSecondary} />
            <ThemedText size="sm" style={{ flex: 1, marginLeft: 12 }}>
              Change PIN
            </ThemedText>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </Card>

        {/* Info Card */}
        <Card padding="md" style={{ backgroundColor: colors.accentMuted }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <AlertCircle size={20} color={colors.accent} style={{ marginTop: 2 }} />
            <ThemedText variant="secondary" size="xs" style={{ marginLeft: 8, flex: 1 }}>
              Biometric data is stored securely on your device and never shared with our servers.
            </ThemedText>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
