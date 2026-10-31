import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';

import { useThemeColors } from '@/hooks/use-theme';

/** The mark's own artboard, in the kit's units (176 x 152). */
const BOX = { width: 176, height: 152 };

export type LintelMarkProps = {
  /** Height in px. Width follows the artboard, so the mark never distorts. */
  size?: number;
  /** Colour of the beam and posts. Defaults to the text colour of the theme. */
  color?: string;
  /** Colour of the point in the opening. Defaults to the accent. */
  dotColor?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * The Lintel symbol: a beam across two posts with a point of light in the
 * opening. Taken from the brand kit's own artboard, so the mark in the app and
 * the mark on the home screen are the same drawing at the same ratios.
 *
 * Drawn as vectors rather than shipped as a PNG for the same reason the
 * wordmark is set as type: it has to invert in Lamplight, and one file cannot.
 */
export function LintelMark({ size = 24, color, dotColor, style }: LintelMarkProps) {
  const colors = useThemeColors();
  const width = (size * BOX.width) / BOX.height;
  const ink = color ?? colors.text;

  return (
    // Decorative wherever it appears: the product name is always beside it.
    <Svg
      width={width}
      height={size}
      viewBox={`0 0 ${BOX.width} ${BOX.height}`}
      style={style}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      focusable={false}
    >
      <Rect x={0} y={0} width={176} height={32} fill={ink} />
      <Rect x={20} y={32} width={32} height={120} fill={ink} />
      <Rect x={124} y={32} width={32} height={120} fill={ink} />
      <Circle cx={88} cy={100} r={16} fill={dotColor ?? colors.accentFill} />
    </Svg>
  );
}
