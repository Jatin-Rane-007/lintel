import type { LucideIcon, LucideProps } from 'lucide-react-native';

import { useThemeColors } from '@/hooks/use-theme';
import { icon } from '@/theme/tokens';
import type { ThemeColorToken } from '@/theme/themes';

export type IconSize = keyof typeof icon.sizes | number;

export type IconProps = Omit<LucideProps, 'color' | 'size' | 'strokeWidth'> & {
  glyph: LucideIcon;
  size?: IconSize;
  /** A semantic theme colour; defaults to primary text. */
  tone?: ThemeColorToken;
};

/**
 * One icon family (Lucide), one stroke width (1.5 px), one colour source.
 * Icons that carry meaning must ship with a text label or `accessibilityLabel`.
 */
export function Icon({ glyph: Glyph, size = 'lg', tone = 'text', ...rest }: IconProps) {
  const colors = useThemeColors();
  const pixels = typeof size === 'number' ? size : icon.sizes[size];

  return <Glyph color={colors[tone]} size={pixels} strokeWidth={icon.strokeWidth} {...rest} />;
}
