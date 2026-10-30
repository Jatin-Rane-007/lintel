import { ArrowRight } from 'lucide-react-native';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '../themed-text';

import { Icon } from './icon';
import { PressableScale } from './pressable-scale';

import { control, spacing } from '@/theme/tokens';

export type SectionHeaderProps = {
  /** Names the section — every section the visitor came for gets one. */
  title: string;
  /** An optional count or fact, set small, to the right of the title. */
  note?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * A section's opening line: its name in h2, an optional quiet note, and at
 * most one text action. The action is a tertiary link (§8.1) — underlined, in
 * ink, with a small arrow — so it never competes with the ember call to act.
 */
export function SectionHeader({ title, note, actionLabel, onAction, style }: SectionHeaderProps) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.titleGroup}>
        <ThemedText variant="h2" accessibilityRole="header">
          {title}
        </ThemedText>
        {note ? (
          <ThemedText variant="meta" tone="textMuted">
            {note}
          </ThemedText>
        ) : null}
      </View>

      {actionLabel && onAction ? (
        <PressableScale
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          style={styles.action}
        >
          <ThemedText variant="uiSm" tone="textSecondary" style={styles.actionLabel}>
            {actionLabel}
          </ThemedText>
          <Icon glyph={ArrowRight} size="sm" tone="textSecondary" />
        </PressableScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  titleGroup: {
    flex: 1,
    gap: 2,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    minHeight: control.targetMin,
  },
  actionLabel: {
    textDecorationLine: 'underline',
  },
});
