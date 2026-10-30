import { Check, X } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '../themed-text';

import { Icon } from './icon';
import { PressableScale } from './pressable-scale';

import { useThemeColors } from '@/hooks/use-theme';
import { borderWidth, control, radius, spacing } from '@/theme/tokens';

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** Shows a trailing × that removes the filter in place (§8.5). */
  onRemove?: () => void;
  accessibilityLabel?: string;
};

/**
 * Filter chip (§8.5): 40 px tall, 2 px radius, surface fill with a control
 * border at rest. Selected is the inverse surface with a leading check — never
 * ember, so ember keeps its meaning as "act here" (§2.4).
 */
export function Chip({ label, selected = false, onPress, onRemove, accessibilityLabel }: ChipProps) {
  const colors = useThemeColors();

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      style={[
        styles.chip,
        selected
          ? { backgroundColor: colors.inverseBg, borderColor: colors.inverseBg }
          : { backgroundColor: colors.surface, borderColor: colors.borderControl },
      ]}
    >
      {selected ? <Icon glyph={Check} size="sm" tone="textInverse" /> : null}
      <ThemedText variant="uiSm" tone={selected ? 'textInverse' : 'textSecondary'}>
        {label}
      </ThemedText>
      {onRemove ? (
        <View style={styles.remove}>
          <PressableScale
            onPress={onRemove}
            accessibilityRole="button"
            accessibilityLabel={`Remove filter: ${label}`}
            style={styles.removeTarget}
          >
            <Icon glyph={X} size="sm" tone={selected ? 'textInverse' : 'textMuted'} />
          </PressableScale>
        </View>
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    height: control.chip,
    paddingHorizontal: spacing[3],
    borderRadius: radius.xs,
    borderWidth: borderWidth.control,
  },
  remove: {
    marginRight: -spacing[2],
  },
  // The × keeps its 44 px target inside a 40 px chip by bleeding past the edge.
  removeTarget: {
    width: spacing[8],
    height: control.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
