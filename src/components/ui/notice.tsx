import { Check, CircleAlert, Info } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '../themed-text';

import { Button } from './button';
import { Icon } from './icon';

import { useThemeColors } from '@/hooks/use-theme';
import type { ThemeColorToken } from '@/theme/themes';
import { radius, spacing } from '@/theme/tokens';

export type NoticeProps = {
  /** The sentence: what happened and what to do next (§5.12). */
  message: string;
  tone?: 'error' | 'info' | 'success';
  actionLabel?: string;
  onAction?: () => void;
};

type ToneStyle = { icon: typeof Info; text: ThemeColorToken; background: ThemeColorToken };

const TONES: Record<NonNullable<NoticeProps['tone']>, ToneStyle> = {
  error: { icon: CircleAlert, text: 'errorText', background: 'errorBg' },
  info: { icon: Info, text: 'infoText', background: 'infoBg' },
  success: { icon: Check, text: 'successText', background: 'successBg' },
};

/**
 * An inline notice above the content it belongs to. Errors are never shown as
 * a toast alone, and they keep the results that were already loaded.
 */
export function Notice({ message, tone = 'error', actionLabel, onAction }: NoticeProps) {
  const colors = useThemeColors();
  const { icon, text, background } = TONES[tone];

  return (
    <View
      accessibilityRole={tone === 'error' ? 'alert' : 'text'}
      style={[styles.root, { backgroundColor: colors[background] }]}
    >
      <Icon glyph={icon} size="sm" tone={text} style={styles.icon} />
      <ThemedText variant="bodySm" tone={text} style={styles.message}>
        {message}
      </ThemedText>
      {actionLabel && onAction ? (
        <Button label={actionLabel} variant="tertiary" onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingLeft: spacing[3],
    paddingRight: spacing[2],
    paddingVertical: spacing[2],
    borderRadius: radius.xs,
  },
  icon: {
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  message: {
    flex: 1,
  },
  action: {
    minWidth: 0,
    paddingHorizontal: spacing[2],
  },
});
