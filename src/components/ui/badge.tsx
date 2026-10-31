import { ArrowDown, Calendar, Clock, Slash, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '../themed-text';

import { Icon } from './icon';

import { useThemeColors } from '@/hooks/use-theme';
import type { ThemeColors } from '@/theme/themes';
import { radius, spacing } from '@/theme/tokens';

export type BadgeTone = 'featured' | 'reduced' | 'openHouse' | 'underOffer' | 'unavailable';

type ToneStyle = {
  background: (colors: ThemeColors) => string;
  text: keyof ThemeColors;
  icon: LucideIcon;
};

const TONES: Record<BadgeTone, ToneStyle> = {
  featured: {
    background: (colors) => colors.inverseBg,
    text: 'textInverse',
    icon: Slash,
  },
  reduced: {
    background: (colors) => colors.successBg,
    text: 'successText',
    icon: ArrowDown,
  },
  openHouse: {
    background: (colors) => colors.infoBg,
    text: 'infoText',
    icon: Calendar,
  },
  underOffer: {
    background: (colors) => colors.warningBg,
    text: 'warningText',
    icon: Clock,
  },
  unavailable: {
    background: (colors) => colors.unavailableBg,
    text: 'unavailableText',
    icon: Slash,
  },
};

export type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  /** Drops the glyph where the shape is already unmistakable. */
  showIcon?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Status badge (§8.4): rectangular, 24 px tall, 2 px radius, label type, and
 * always worth reading without its colour — every tone ships a glyph or a
 * word that carries the meaning on its own.
 */
export function Badge({ label, tone = 'featured', showIcon = true, style }: BadgeProps) {
  const colors = useThemeColors();
  const { background, text, icon } = TONES[tone];

  return (
    <View style={[styles.badge, { backgroundColor: background(colors) }, style]}>
      {showIcon && tone !== 'featured' ? <Icon glyph={icon} size="sm" tone={text} /> : null}
      <ThemedText variant="label" tone={text}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    height: 24,
    paddingHorizontal: spacing[2],
    borderRadius: radius.xs,
  },
});
