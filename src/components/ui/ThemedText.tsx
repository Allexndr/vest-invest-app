import { Text, TextProps } from 'react-native';
import { useThemeStore } from '@/stores/theme';
import { cn } from '@/lib/utils';

interface ThemedTextProps extends TextProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'danger' | 'inverse' | 'brand';
  size?: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
}

export function ThemedText({
  variant = 'primary',
  size = 'base',
  weight = 'normal',
  className,
  style,
  ...props
}: ThemedTextProps) {
  const { colors } = useThemeStore();

  const colorMap = {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    accent: colors.accent,
    success: colors.success,
    danger: colors.danger,
    inverse: '#ffffff',
    brand: colors.brandOrange,
  };

  const sizeMap = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
  };

  const weightMap = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  return (
    <Text
      className={cn(sizeMap[size], weightMap[weight], className)}
      style={[{ color: colorMap[variant] }, style]}
      {...props}
    />
  );
}
