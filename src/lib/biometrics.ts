import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export type BiometricType = 'fingerprint' | 'facial-recognition' | 'iris' | 'none';

export interface BiometricStatus {
  available: boolean;
  enrolled: boolean;
  type: BiometricType;
  error?: string;
}

/**
 * Check if biometric authentication is available and configured
 */
export async function checkBiometricSupport(): Promise<BiometricStatus> {
  try {
    // Check if hardware supports biometrics
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      return { available: false, enrolled: false, type: 'none', error: 'No biometric hardware' };
    }

    // Check if biometrics are enrolled
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      return { available: true, enrolled: false, type: 'none', error: 'No biometrics enrolled' };
    }

    // Get supported types
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    
    let type: BiometricType = 'none';
    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      type = 'facial-recognition';
    } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      type = 'fingerprint';
    } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      type = 'iris';
    }

    return { available: true, enrolled: true, type };
  } catch (error) {
    return { 
      available: false, 
      enrolled: false, 
      type: 'none', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Authenticate with biometrics
 * @param reason - The reason for authentication (shown to user)
 * @param fallback - Allow device PIN as fallback
 */
export async function authenticateWithBiometrics(
  reason = 'Authenticate to access your portfolio',
  fallback = true
): Promise<{ success: boolean; error?: string }> {
  try {
    // First check if biometrics are available
    const status = await checkBiometricSupport();
    if (!status.available || !status.enrolled) {
      return { success: false, error: status.error };
    }

    // Perform authentication
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: reason,
      fallbackLabel: fallback ? 'Use device PIN' : undefined,
      cancelLabel: 'Cancel',
      disableDeviceFallback: !fallback,
    });

    if (result.success) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return { success: true };
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return { 
        success: false, 
        error: 'Authentication cancelled or failed'
      };
    }
  } catch (error) {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Authentication failed' 
    };
  }
}

/**
 * Get biometric icon name based on platform and type
 */
export function getBiometricIcon(type: BiometricType): string {
  if (type === 'facial-recognition') {
    return Platform.OS === 'ios' ? 'face-id' : 'face-recognition';
  } else if (type === 'fingerprint') {
    return Platform.OS === 'ios' ? 'touch-id' : 'fingerprint';
  }
  return 'lock';
}

/**
 * Get human-readable biometric name
 */
export function getBiometricName(type: BiometricType): string {
  switch (type) {
    case 'facial-recognition':
      return Platform.OS === 'ios' ? 'Face ID' : 'Face Recognition';
    case 'fingerprint':
      return Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
    case 'iris':
      return 'Iris Recognition';
    default:
      return 'Biometric Authentication';
  }
}

/**
 * Secure sensitive action with biometric check
 * Use this before showing sensitive data or performing critical operations
 */
export async function secureAction<T>(
  action: () => Promise<T>,
  actionName = 'perform this action'
): Promise<{ success: boolean; result?: T; error?: string }> {
  const auth = await authenticateWithBiometrics(`Authenticate to ${actionName}`);
  
  if (!auth.success) {
    return { success: false, error: auth.error || 'Authentication required' };
  }

  try {
    const result = await action();
    return { success: true, result };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Action failed' 
    };
  }
}
