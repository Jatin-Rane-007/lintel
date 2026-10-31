import { StyleSheet, View } from 'react-native';

import { ThemedText } from '../themed-text';

import { PressableScale } from './pressable-scale';

import { useThemeColors } from '@/hooks/use-theme';
import { borderWidth, control, radius, spacing } from '@/theme/tokens';

export type SegmentOption<T extends string> = {
  label: string;
  value: T;
};

export type SegmentedProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Names the group for screen readers, e.g. "Appearance". */
  label: string;
};

/**
 * Segmented control (§8.11): radio-group semantics, 44 px tall, and the
 * selected segment is the inverse surface — the same "chosen" language as a
 * selected chip, so the two never disagree about what selection looks like.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: SegmentedProps<T>) {
  const colors = useThemeColors();

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      style={[styles.group, { borderColor: colors.borderControl, backgroundColor: colors.surface }]}
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <PressableScale
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            style={[styles.segment, selected && { backgroundColor: colors.inverseBg }]}
          >
            <ThemedText variant="uiSm" tone={selected ? 'textInverse' : 'textSecondary'}>
              {option.label}
            </ThemedText>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    borderWidth: borderWidth.control,
    borderRadius: radius.xs,
    padding: 2,
    gap: 2,
  },
  segment: {
    flex: 1,
    height: control.targetMin - 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xs - 1,
    paddingHorizontal: spacing[2],
  },
});
