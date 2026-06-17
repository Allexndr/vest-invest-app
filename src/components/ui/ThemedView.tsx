import { View, ViewProps } from 'react-native';
import { useThemeStore } from '@/stores/theme';
import { cn } from '@/lib/utils';

interface ThemedViewProps extends ViewProps {
  variant?: 'default' | 'surface' | 'accent' | 'card';
  className?: string;
}

export function ThemedView({ variant = 'default', className, style, ...props }: ThemedViewProps) {
  const { colors } = useThemeStore();

  const bgMap = {
    default: colors.background,
    surface: colors.surface,
    accent: colors.accentMuted,
    card: colors.surface,
  };

  return (
    <View
      className={cn(className)}
      style={[{ backgroundColor: bgMap[variant] }, style]}
      {...props}
    />
  );
}
