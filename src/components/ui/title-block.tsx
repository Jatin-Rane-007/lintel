import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '../themed-text';

import { useThemeColors } from '@/hooks/use-theme';
import { borderWidth, spacing } from '@/theme/tokens';

export type TitleBlockCell = {
  value: string;
  label: string;
};

export type TitleBlockProps = {
  /** Three or four cells — never more (DESIGN.md §9.2). */
  cells: TitleBlockCell[];
  style?: StyleProp<ViewStyle>;
};

/**
 * The title block: a ruled row of `value` over `label`, borrowed from an
 * architect's drawing sheet (§9.2). It is the same element on a card, a detail
 * page and the compare header, which is what makes figures scannable across
 * screens. Omit a cell rather than showing one that is empty.
 */
export function TitleBlock({ cells, style }: TitleBlockProps) {
  const colors = useThemeColors();

  if (cells.length === 0) return null;

  return (
    <View
      style={[
        styles.block,
        {
          borderTopColor: colors.borderHairline,
          borderBottomColor: colors.borderHairline,
        },
        style,
      ]}
    >
      {cells.map((cell, index) => (
        <View
          key={cell.label}
          style={[
            styles.cell,
            index > 0 && styles.divided,
            index > 0 && { borderLeftColor: colors.borderHairline },
          ]}
        >
          <ThemedText variant="spec" tabular numberOfLines={1}>
            {cell.value}
          </ThemedText>
          <ThemedText variant="label" tone="textMuted" numberOfLines={1}>
            {cell.label}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flexDirection: 'row',
    borderTopWidth: borderWidth.hairline,
    borderBottomWidth: borderWidth.hairline,
  },
  cell: {
    flex: 1,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    gap: 2,
  },
  divided: {
    borderLeftWidth: borderWidth.hairline,
  },
});
