import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColors } from '@/hooks/use-theme';
import { spacing } from '@/theme/tokens';

export type ScreenProps = {
  /** Optional: a loading state is a bare page, not an empty message. */
  children?: React.ReactNode;
  /** Safe-area edges to inset. Tab screens leave the bottom to the tab bar. */
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  style?: StyleProp<ViewStyle>;
};

/**
 * Every destination sits on the page ground — paper in light, warm near-black
 * in dark. There is deliberately no second wrapper: a screen is a page, not a
 * card, and the theme provides the only surface it needs.
 */
export function Screen({ children, edges = ['top', 'left', 'right'], style }: ScreenProps) {
  const colors = useThemeColors();

  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: colors.bg }, style]}>
      {children}
    </SafeAreaView>
  );
}

/**
 * The one horizontal gutter. Every screen, header, section and list uses it,
 * which is what keeps all the left edges on the page in agreement.
 */
export function Gutter({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.gutter, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  gutter: {
    paddingHorizontal: spacing[6],
  },
});
