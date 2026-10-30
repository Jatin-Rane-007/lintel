import { CircleAlert } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '../themed-text';

import { Icon } from './icon';

import { useThemeColors } from '@/hooks/use-theme';
import { borderWidth, control, radius, spacing, type as typeScale } from '@/theme/tokens';

export type TextFieldProps = TextInputProps & {
  /** Always rendered above the field — never placeholder-only (§8.2). */
  label: string;
  /** Error-700 border plus a message below (§8.10). */
  error?: string | null;
  /** Helper text below the field, hidden while an error is shown. */
  hint?: string;
  /** Trailing control inside the field: a reveal toggle, a unit, a clear button. */
  accessory?: ReactNode;
};

/**
 * Labelled input per DESIGN.md §8.2: surface fill, 1.5 px control border,
 * 4 px radius, 52 px tall. Focus turns the border ink; an error turns it
 * Error-700 and adds an icon so the state is not carried by colour alone.
 */
export function TextField({
  label,
  error = null,
  hint,
  accessory,
  onFocus,
  onBlur,
  style,
  ...rest
}: TextFieldProps) {
  const colors = useThemeColors();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.errorText
    : focused
      ? colors.borderStrong
      : colors.borderControl;

  return (
    <View style={styles.field}>
      <ThemedText variant="label" tone="textMuted">
        {label}
      </ThemedText>
      <View style={styles.control}>
        <TextInput
          {...rest}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.accentFill}
          style={[
            styles.input,
            accessory ? styles.inputWithAccessory : null,
            {
              backgroundColor: colors.surface,
              borderColor,
              color: colors.text,
            },
            style,
          ]}
        />
        {accessory ? <View style={styles.accessory}>{accessory}</View> : null}
      </View>
      {error ? (
        <View style={styles.message}>
          <Icon glyph={CircleAlert} size="sm" tone="errorText" />
          <ThemedText variant="caption" tone="errorText" style={styles.messageText}>
            {error}
          </ThemedText>
        </View>
      ) : hint ? (
        <ThemedText variant="caption" tone="textMuted">
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing[1],
  },
  control: {
    justifyContent: 'center',
  },
  input: {
    height: control.field.default,
    paddingHorizontal: spacing[4],
    borderWidth: borderWidth.control,
    borderRadius: radius.sm,
    ...typeScale.ui,
  },
  // Keeps the value clear of the accessory, which is a 44 px target (§6.5).
  inputWithAccessory: {
    paddingRight: control.targetMin + spacing[1],
  },
  accessory: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: spacing[1],
    width: control.targetMin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[1],
  },
  messageText: {
    flex: 1,
  },
});
