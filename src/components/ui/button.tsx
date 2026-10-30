import { ActivityIndicator, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '../themed-text';

import { PressableScale } from './pressable-scale';

import { useThemeColors } from '@/hooks/use-theme';
import { borderWidth, control, radius, spacing } from '@/theme/tokens';
import type { ThemeColorToken } from '@/theme/themes';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  /** Primary is the one "act here" fill per region (§8.1). */
  variant?: ButtonVariant;
  /** 56 px is reserved for a screen's single main action. */
  large?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Text button per DESIGN.md §8.1: 2 px radius, min width 96 px, 20 px side
 * padding, ember fill for primary and a 1.5 px ink outline for secondary.
 * Pressed feedback comes from `PressableScale`, so the element never changes
 * layout while it is held.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  large = false,
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const colors = useThemeColors();
  const isDisabled = disabled || loading;

  const tone: ThemeColorToken = isDisabled
    ? 'disabledText'
    : variant === 'primary'
      ? 'onAccent'
      : variant === 'secondary'
        ? 'text'
        : 'textSecondary';

  return (
    <PressableScale
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[
        styles.base,
        large ? styles.large : styles.default,
        variant === 'primary' && {
          backgroundColor: isDisabled ? colors.disabledBg : colors.accentFill,
        },
        variant === 'secondary' && {
          borderWidth: borderWidth.control,
          borderColor: isDisabled ? colors.borderHairline : colors.borderStrong,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors[tone]} />
      ) : (
        <ThemedText
          variant="ui"
          tone={tone}
          style={variant === 'tertiary' ? styles.tertiaryLabel : undefined}
        >
          {label}
        </ThemedText>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 96,
    paddingHorizontal: spacing[5],
    borderRadius: radius.xs,
  },
  default: {
    height: control.button.default,
  },
  large: {
    height: control.button.large,
  },
  tertiaryLabel: {
    textDecorationLine: 'underline',
  },
});
