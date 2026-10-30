import { View, type ViewProps } from 'react-native';

import { useThemeColors } from '@/hooks/use-theme';
import type { ThemeColorToken } from '@/theme/themes';

export type ThemedViewProps = ViewProps & {
  /** A semantic colour from the active theme. Defaults to the page background. */
  tone?: ThemeColorToken;
};

export function ThemedView({ style, tone = 'bg', ...otherProps }: ThemedViewProps) {
  const colors = useThemeColors();

  return <View style={[{ backgroundColor: colors[tone] }, style]} {...otherProps} />;
}
