import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Icon } from './icon';
import { PressableScale } from './pressable-scale';

import { useThemeColors } from '@/hooks/use-theme';
import type { ThemeColorToken } from '@/theme/themes';
import { borderWidth, control, radius } from '@/theme/tokens';

export type IconButtonProps = {
  glyph: LucideIcon;
  /** Always required: an icon alone is not an accessible name (§10.3). */
  label: string;
  onPress?: () => void;
  /** `paper` floats over a photograph; `plain` sits on the page. */
  variant?: 'paper' | 'plain' | 'inverse';
  tone?: ThemeColorToken;
  disabled?: boolean;
};

/**
 * Icon button (§8.1): a 36 px visual circle inside a 44 px target, so the hit
 * area is always thumb-sized even when the control looks small. On a photo it
 * is a paper chip; on the page it is borderless, because the page is already
 * quiet enough.
 */
export function IconButton({
  glyph,
  label,
  onPress,
  variant = 'paper',
  tone = 'text',
  disabled = false,
}: IconButtonProps) {
  const colors = useThemeColors();

  const surface =
    variant === 'paper'
      ? {
          backgroundColor: colors.surface,
          borderWidth: borderWidth.hairline,
          borderColor: colors.borderHairline,
        }
      : variant === 'inverse'
        ? { backgroundColor: colors.inverseBg, borderWidth: 0 }
        : { backgroundColor: 'transparent' };

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={styles.target}
    >
      <View style={[styles.circle, surface]}>
        <Icon glyph={glyph} size="md" tone={variant === 'inverse' ? 'textInverse' : tone} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  target: {
    width: control.targetMin,
    height: control.targetMin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
