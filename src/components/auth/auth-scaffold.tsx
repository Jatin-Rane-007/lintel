import { Check, CircleAlert } from 'lucide-react-native';
import { type ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '../themed-text';
import { Icon } from '../ui/icon';
import { PressableScale } from '../ui/pressable-scale';
import { Wordmark } from '../ui/wordmark';

import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useThemeColors } from '@/hooks/use-theme';
import { borderWidth, control, spacing, type as typeScale } from '@/theme/tokens';

/**
 * The one layout both auth screens share (DESIGN.md §6.2, §8.6): a drawing
 * sheet rather than a card — a ruled header with the wordmark on the left and
 * the step on the right, the form on paper, and the action pinned above the
 * keyboard so the primary button never scrolls away.
 *
 * The rule under the header starts with 24 px of ember: the wordmark's
 * sun-point carried across the sheet. It is the only ember in the region
 * besides the action, which is what "one point of light" asks for (§2.4).
 */
export function AuthScaffold({
  step,
  stepCount = 2,
  title,
  description,
  children,
  footer,
}: {
  step: number;
  stepCount?: number;
  title: string;
  /** One line of Lora under the title. Two at most. */
  description: string;
  children: ReactNode;
  /** Primary action plus the links that change doors. */
  footer: ReactNode;
}) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { isAtLeastMedium } = useBreakpoint();

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: colors.bg }]}
      edges={['top', 'left', 'right']}
    >
      <KeyboardAvoidingView
        // Android 15 is edge-to-edge, so the window no longer resizes for the
        // keyboard (`adjustResize` is a no-op) — both platforms need padding.
        behavior="padding"
        style={styles.root}
      >
        <View
          style={[
            styles.sheet,
            { borderColor: colors.borderHairline },
            isAtLeastMedium && styles.sheetRuled,
          ]}
        >
          <View style={styles.header}>
            <Wordmark size={typeScale.h2.fontSize} mark />
            <ThemedText variant="label" tone="textMuted">
              {`Step ${step} of ${stepCount}`}
            </ThemedText>
          </View>

          <SheetRule />

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.intro}>
              <ThemedText variant="h1" accessibilityRole="header">
                {title}
              </ThemedText>
              <ThemedText variant="body" tone="textSecondary">
                {description}
              </ThemedText>
            </View>

            <View style={styles.form}>{children}</View>
          </ScrollView>

          <View
            style={[
              styles.footer,
              {
                borderTopColor: colors.borderHairline,
                paddingBottom: Math.max(insets.bottom, spacing[4]),
              },
            ]}
          >
            {footer}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/** 2 px ember stub over a 1 px hairline — the sun-line as a page rule. */
function SheetRule() {
  const colors = useThemeColors();

  return (
    <View style={styles.rule}>
      <View style={[styles.ruleEmber, { backgroundColor: colors.accentFill }]} />
      <View style={[styles.ruleHairline, { backgroundColor: colors.borderHairline }]} />
    </View>
  );
}

/**
 * A text action on a 44 px target. Underlined, in Ember-700, per §8.1's
 * tertiary variant — the underline is the affordance, not the colour.
 */
export function TextLink({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="link"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={styles.textLink}
    >
      <ThemedText
        variant="uiSm"
        tone={disabled ? 'textMuted' : 'accentText'}
        style={styles.textLinkLabel}
      >
        {label}
      </ThemedText>
    </PressableScale>
  );
}

/** "New to lintel?  Create an account" — one prompt, one other door. */
export function AuthSwitch({
  prompt,
  actionLabel,
  onPress,
  disabled = false,
}: {
  prompt: string;
  actionLabel: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.switchRow}>
      <ThemedText variant="uiSm" tone="textSecondary">
        {prompt}
      </ThemedText>
      <TextLink label={actionLabel} onPress={onPress} disabled={disabled} />
    </View>
  );
}

/** Secondary links for a step that has no other door (resend, change email). */
export function AuthLinkRow({ children }: { children: ReactNode }) {
  return <View style={styles.linkRow}>{children}</View>;
}

/**
 * Form-level feedback. Errors use icon + words rather than colour alone (§10.4)
 * and are announced; notices are polite.
 */
export function AuthMessage({
  tone,
  children,
}: {
  tone: 'error' | 'success';
  children: ReactNode;
}) {
  const isError = tone === 'error';

  return (
    <View
      accessible
      accessibilityRole={isError ? 'alert' : 'text'}
      accessibilityLiveRegion={isError ? 'assertive' : 'polite'}
      style={styles.message}
    >
      <Icon
        glyph={isError ? CircleAlert : Check}
        size="sm"
        tone={isError ? 'errorText' : 'successText'}
      />
      <ThemedText
        variant="bodySm"
        tone={isError ? 'errorText' : 'successText'}
        style={styles.messageText}
      >
        {children}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  // A 480 px sheet: wide enough for a 15-character password hint, narrow enough
  // that the eye never travels. Side rules appear from `medium` upward.
  sheet: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  sheetRuled: {
    borderLeftWidth: borderWidth.hairline,
    borderRightWidth: borderWidth.hairline,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  rule: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 2,
  },
  ruleEmber: {
    width: spacing[6],
    height: 2,
  },
  ruleHairline: {
    flex: 1,
    height: borderWidth.hairline,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[8],
    paddingBottom: spacing[6],
    // Top-aligned: the eye reads title, then field, then the action bar. The
    // air below the form is page, not gap — it is bounded by the footer rule.
    gap: spacing[8],
  },
  intro: {
    gap: spacing[3],
  },
  form: {
    gap: spacing[5],
  },
  footer: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    borderTopWidth: borderWidth.hairline,
    gap: spacing[1],
  },
  switchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing[1],
  },
  linkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: spacing[4],
  },
  textLink: {
    minHeight: control.targetMin,
    justifyContent: 'center',
  },
  textLinkLabel: {
    textDecorationLine: 'underline',
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
