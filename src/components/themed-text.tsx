import { Text, type TextProps, type TextStyle } from 'react-native';

import { useThemeColors } from '@/hooks/use-theme';
import { type as typeScale, type TextStyleToken } from '@/theme/tokens';
import type { ThemeColorToken } from '@/theme/themes';

export type TextVariant = keyof typeof typeScale;

export type ThemedTextProps = TextProps & {
  /** A token from the type scale (§3.2). Defaults to body prose. */
  variant?: TextVariant;
  /** A semantic colour from the active theme. Defaults to primary text. */
  tone?: ThemeColorToken;
  /** Tabular figures for prices, specs and comparison tables. */
  tabular?: boolean;
};

const tabularStyle: TextStyle = { fontVariant: ['tabular-nums'] };

export function ThemedText({
  variant = 'body',
  tone = 'text',
  tabular = false,
  style,
  ...rest
}: ThemedTextProps) {
  const colors = useThemeColors();
  const token: TextStyleToken = typeScale[variant];

  return (
    <Text style={[token, { color: colors[tone] }, tabular && tabularStyle, style]} {...rest} />
  );
}
