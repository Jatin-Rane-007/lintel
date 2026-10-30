import type { Href } from 'expo-router';
import {
  TabList,
  TabSlot,
  TabTrigger,
  Tabs,
  type TabListProps,
  type TabTriggerSlotProps,
} from 'expo-router/ui';
import { Bookmark, Compass, Search, SquarePlus, User, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from './themed-text';
import { Icon } from './ui/icon';

import { useThemeColors } from '@/hooks/use-theme';
import { useUserStore } from '@/store/user-store';
import { borderWidth, control, fontFamilies, spacing } from '@/theme/tokens';

type Destination = { name: string; href: Href; label: string; icon: LucideIcon };

/** The five destinations of the compact bar (DESIGN.md §6.2). */
const DESTINATIONS: Destination[] = [
  { name: 'index', href: '/', label: 'Explore', icon: Compass },
  { name: 'search', href: '/search', label: 'Search', icon: Search },
  { name: 'create', href: '/create', label: 'Add', icon: SquarePlus },
  { name: 'saved', href: '/saved', label: 'Saved', icon: Bookmark },
  { name: 'profile', href: '/profile', label: 'Account', icon: User },
];

/** Adding a listing is an agent's job, so the middle slot is conditional. */
const ADMIN_ONLY = 'create';

/**
 * Bottom tab bar (§8.6): page background, 1 px hairline top edge, 56 px tall,
 * a 24 px icon over a 12 px label. The selected item is ink with a 2 px ember
 * bar above the icon — selection is weight plus accent, never colour alone.
 *
 * Built on the headless tabs so the bar is ours rather than the platform's
 * Material pill, which is not part of the visual language.
 */
export default function AppTabs() {
  const isAdmin = useUserStore((state) => state.isAdmin);
  const destinations = DESTINATIONS.filter(
    (destination) => isAdmin || destination.name !== ADMIN_ONLY,
  );

  return (
    <Tabs style={styles.root}>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <TabBar>
          {destinations.map((destination) => (
            <TabTrigger
              key={destination.name}
              name={destination.name}
              href={destination.href}
              asChild
            >
              <TabItem icon={destination.icon}>{destination.label}</TabItem>
            </TabTrigger>
          ))}
        </TabBar>
      </TabList>
    </Tabs>
  );
}

function TabBar({ children, style, ...props }: TabListProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      {...props}
      style={[
        styles.bar,
        { backgroundColor: colors.bg, borderTopColor: colors.borderHairline },
        { paddingBottom: insets.bottom },
        style,
      ]}
    >
      {children}
    </View>
  );
}

type TabItemProps = TabTriggerSlotProps & {
  icon: LucideIcon;
};

/**
 * `TabTriggerSlotProps` declares its `ref` against the `View` component value,
 * while `Pressable` forwards a ref to the host element. At runtime it is the
 * same instance, so the slot props are safe to hand over; only the emitted
 * declaration disagrees with Pressable's, hence the narrowing cast.
 */
function TabItem({ children, isFocused = false, icon, ...props }: TabItemProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      {...(props as unknown as PressableProps)}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      style={styles.item}
    >
      <View
        style={[styles.marker, isFocused ? { backgroundColor: colors.accentFill } : undefined]}
      />
      <Icon glyph={icon} size="lg" tone={isFocused ? 'text' : 'textMuted'} />
      <ThemedText
        variant="caption"
        tone={isFocused ? 'text' : 'textMuted'}
        style={isFocused ? styles.labelFocused : undefined}
      >
        {children}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  slot: {
    flex: 1,
  },
  bar: {
    flexDirection: 'row',
    borderTopWidth: borderWidth.hairline,
  },
  item: {
    flex: 1,
    height: control.tabBar,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
  },
  marker: {
    width: spacing[6],
    height: 2,
    borderRadius: 1,
    backgroundColor: 'transparent',
  },
  // Weight lives in the family name: Android ignores fontWeight on custom faces.
  labelFocused: {
    fontFamily: fontFamilies.display,
  },
});
