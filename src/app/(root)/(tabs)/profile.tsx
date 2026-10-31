import { useAuth, useUser } from '@clerk/expo';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
  Bookmark,
  ChevronRight,
  LifeBuoy,
  SquarePlus,
  type LucideIcon,
} from 'lucide-react-native';
import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { LintelMark } from '@/components/ui/lintel-mark';
import { Notice } from '@/components/ui/notice';
import { PageHeader } from '@/components/ui/page-header';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Gutter, Screen } from '@/components/ui/screen';
import { Segmented } from '@/components/ui/segmented';
import { Wordmark } from '@/components/ui/wordmark';
import { useThemeColors, useThemePreference } from '@/hooks/use-theme';
import { useUserStore } from '@/store/user-store';
import { borderWidth, radius, spacing } from '@/theme/tokens';
import type { ThemePreference } from '@/theme/theme-provider';

const THEME_OPTIONS: { label: string; value: ThemePreference }[] = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

// Placeholder until a support domain exists. Swap this for the real address and
// the menu row and the mailto both follow it.
const SUPPORT_EMAIL = 'support@lintel.app';

/**
 * Account (§6.2). The profile sits on the page ground as a ruled sheet: who
 * you are, how the app looks, the places you can go, and one quiet way out.
 */
export default function ProfileScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const isAdmin = useUserStore((state) => state.isAdmin);
  const { preference, setPreference } = useThemePreference();

  const [isUpdating, setIsUpdating] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [message, setMessage] = useState<{
    tone: 'error' | 'success';
    text: string;
    action?: 'settings';
  } | null>(null);

  const changePhoto = async () => {
    setMessage(null);

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setMessage({
        tone: 'error',
        text: 'Photo access is off. Turn it on in your phone settings to change your picture.',
        action: 'settings',
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    if (!asset.base64) {
      setMessage({ tone: 'error', text: 'That photo could not be read. Try another one.' });
      return;
    }

    const extension = /\.(\w+)$/.exec(asset.uri)?.[1] ?? 'jpg';
    const mimeType = `image/${extension === 'png' ? 'png' : 'jpeg'}`;

    setIsUpdating(true);

    try {
      await user?.setProfileImage({ file: `data:${mimeType};base64,${asset.base64}` });
      setMessage({ tone: 'success', text: 'Your photo is updated.' });
    } catch {
      setMessage({
        tone: 'error',
        text: 'We could not save that photo. Try again in a moment.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await signOut();
      router.replace('/sign-in');
    } catch {
      setMessage({ tone: 'error', text: 'We could not sign you out. Try again.' });
      setIsSigningOut(false);
    }
  };

  if (!isLoaded || !user) {
    return <Screen />;
  }

  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Your account';
  const email = user.emailAddresses[0]?.emailAddress ?? 'No email on file';
  const memberSince = user.createdAt
    ? `Member since ${new Date(user.createdAt).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric',
      })}`
    : 'Signed in';

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Gutter>
          <PageHeader title="Account" note={memberSince} />
        </Gutter>

        <Gutter style={styles.identity}>
          <View style={styles.avatarWrap}>
            {user.hasImage && user.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                style={styles.avatar}
                contentFit="cover"
                transition={160}
                accessibilityLabel={`${name}'s profile photo`}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: colors.inverseBg }]}>
                <ThemedText variant="h1" tone="textInverse">
                  {name.charAt(0).toUpperCase()}
                </ThemedText>
              </View>
            )}
            {isUpdating ? (
              <View style={[styles.avatarBusy, { backgroundColor: colors.scrim }]}>
                <ThemedText variant="caption" tone="textInverse">
                  Saving
                </ThemedText>
              </View>
            ) : null}
          </View>

          <View style={styles.identityText}>
            <ThemedText variant="h2" numberOfLines={2}>
              {name}
            </ThemedText>
            <ThemedText variant="meta" tone="textMuted" numberOfLines={1}>
              {email}
            </ThemedText>
            <View style={styles.photoAction}>
              <Button
                label={isUpdating ? 'Changing photo' : 'Change photo'}
                variant="tertiary"
                onPress={changePhoto}
                disabled={isUpdating}
              />
            </View>
          </View>
        </Gutter>

        {message ? (
          <Gutter style={styles.notice}>
            <Notice
              message={message.text}
              tone={message.tone === 'error' ? 'error' : 'success'}
              actionLabel={message.action === 'settings' ? 'Settings' : undefined}
              onAction={
                message.action === 'settings' ? () => Linking.openSettings() : undefined
              }
            />
          </Gutter>
        ) : null}

        <Gutter style={[styles.section, { borderTopColor: colors.borderHairline }]}>
          <ThemedText variant="h3" accessibilityRole="header">
            Appearance
          </ThemedText>
          <Segmented
            label="Appearance"
            options={THEME_OPTIONS}
            value={preference}
            onChange={setPreference}
          />
          <ThemedText variant="caption" tone="textMuted">
            System follows your phone&apos;s light and dark setting.
          </ThemedText>
        </Gutter>

        <Gutter style={[styles.section, { borderTopColor: colors.borderHairline }]}>
          <ThemedText variant="h3" accessibilityRole="header">
            Your homes
          </ThemedText>

          <View style={styles.rows}>
            <MenuRow
              icon={Bookmark}
              label="Saved homes"
              onPress={() => router.push('/(root)/(tabs)/saved')}
            />
            {isAdmin ? (
              <MenuRow
                icon={SquarePlus}
                label="Add a listing"
                onPress={() => router.push('/(root)/(tabs)/create')}
              />
            ) : null}
            <MenuRow
              icon={LifeBuoy}
              label="Help and support"
              note={`Write to ${SUPPORT_EMAIL}`}
              onPress={() =>
                Linking.openURL(
                  `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Help with lintel')}`,
                )
              }
            />
          </View>
        </Gutter>

        <Gutter style={styles.signOut}>
          <Button
            label={isSigningOut ? 'Signing out' : 'Sign out'}
            variant="secondary"
            large
            onPress={handleSignOut}
            disabled={isSigningOut}
          />
          <ThemedText variant="caption" tone="textMuted" style={styles.signOutNote}>
            Your shortlist stays with your account and is here when you return.
          </ThemedText>
        </Gutter>

        <BrandSignOff />
      </ScrollView>
    </Screen>
  );
}

function MenuRow({
  icon,
  label,
  note,
  onPress,
}: {
  icon: LucideIcon;
  label: string;
  note?: string;
  onPress: () => void;
}) {
  const colors = useThemeColors();

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.row, { borderTopColor: colors.borderHairline }]}
    >
      <Icon glyph={icon} size="md" tone="textSecondary" />
      <View style={styles.rowText}>
        <ThemedText variant="ui">{label}</ThemedText>
        {note ? (
          <ThemedText variant="caption" tone="textMuted" numberOfLines={1}>
            {note}
          </ThemedText>
        ) : null}
      </View>
      <Icon glyph={ChevronRight} size="sm" tone="textMuted" />
    </PressableScale>
  );
}

/**
 * The stacked lockup from the brand kit closes the page: mark, wordmark, and
 * the build the person is actually running. It is the only place the app signs
 * its own name, so it stays quiet — no rule above it, no card around it.
 */
function BrandSignOff() {
  const version = Constants.expoConfig?.version;

  return (
    <View style={styles.signOff}>
      <LintelMark size={34} />
      <Wordmark size={16} />
      {version ? (
        <ThemedText variant="caption" tone="textMuted">
          {`Version ${version}`}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing[3],
    paddingBottom: spacing[10],
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[4],
    paddingTop: spacing[6],
  },
  avatarWrap: {
    width: 72,
    height: 72,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBusy: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityText: {
    flex: 1,
    gap: spacing[1],
  },
  photoAction: {
    alignSelf: 'flex-start',
    marginTop: spacing[1],
  },
  notice: {
    paddingTop: spacing[5],
  },
  section: {
    marginTop: spacing[8],
    paddingTop: spacing[5],
    borderTopWidth: borderWidth.hairline,
    gap: spacing[3],
  },
  rows: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    minHeight: 56,
    borderTopWidth: borderWidth.hairline,
  },
  rowText: {
    flex: 1,
    gap: 2,
    paddingVertical: spacing[2],
  },
  signOut: {
    paddingTop: spacing[10],
    gap: spacing[2],
  },
  signOutNote: {
    paddingTop: spacing[1],
  },
  signOff: {
    alignItems: 'center',
    gap: spacing[2],
    paddingTop: spacing[16],
    paddingBottom: spacing[4],
  },
});
