import { View, ViewProps } from 'react-native';
import { useThemeStore } from '@/stores/theme';
import { cn } from '@/lib/utils';

interface CardProps extends ViewProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  className?: string;
}

export function Card({ padding = 'md', border = true, className, style, children, ...props }: CardProps) {
  const { colors } = useThemeStore();

  const padMap = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  };

  return (
    <View
      className={cn('rounded-2xl', padMap[padding], border && 'border', className)}
      style={[
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: border ? 1 : 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 4,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
