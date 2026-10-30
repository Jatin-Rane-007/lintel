import { Image } from 'expo-image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '../themed-text';

import { IconButton } from './icon-button';
import { PressableScale } from './pressable-scale';

import { palette, spacing } from '@/theme/tokens';

export type LightboxProps = {
  images: string[];
  visible: boolean;
  onClose: () => void;
  /** Where the viewer opened, so it starts on the photo that was tapped. */
  initialIndex?: number;
  /** Shown under the frame, attributed to the listing (§5.8). */
  caption?: string;
};

/**
 * The all-photos viewer (§5.8): full screen on ink at 96 %, the photo set to
 * `contain` so nothing is ever cropped, a film-frame counter, and explicit
 * previous / next controls so it works with a thumb and with a screen reader.
 *
 * It is deliberately not a third-party viewer: the chrome has to be our
 * paper-and-ink language, including the counter and the close target.
 */
export function Lightbox({ images, visible, onClose, initialIndex = 0, caption }: LightboxProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<string>>(null);
  const [index, setIndex] = useState(initialIndex);

  const goTo = useCallback(
    (next: number) => {
      if (next < 0 || next >= images.length) return;
      listRef.current?.scrollToIndex({ index: next, animated: true });
      setIndex(next);
    },
    [images.length],
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  const frameCount = images.length;

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
      statusBarTranslucent
      transparent={false}
    >
      <View style={[styles.root, { backgroundColor: palette.ink[900] }]}>
        <View style={[styles.bar, { paddingTop: insets.top + spacing[2] }]}>
          <ThemedText variant="label" style={styles.counter}>
            {`${String(index + 1).padStart(2, '0')} / ${String(frameCount).padStart(2, '0')}`}
          </ThemedText>
          <IconButton glyph={X} label="Close photos" variant="inverse" onPress={onClose} />
        </View>

        <FlatList
          ref={listRef}
          data={images}
          keyExtractor={(uri, position) => `${uri}-${position}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          getItemLayout={(_, position) => ({
            length: width,
            offset: width * position,
            index: position,
          })}
          renderItem={({ item }) => (
            <View style={{ width, height: height - insets.top - insets.bottom - 160 }}>
              <Image
                source={{ uri: item }}
                style={styles.image}
                contentFit="contain"
                transition={120}
                accessibilityLabel="Property photograph"
              />
            </View>
          )}
        />

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing[4] }]}>
          <PressableScale
            onPress={() => goTo(index - 1)}
            disabled={index === 0}
            accessibilityRole="button"
            accessibilityLabel="Previous photo"
            style={[styles.step, index === 0 && styles.stepDisabled]}
          >
            <ChevronLeft color={palette.paper[50]} size={22} strokeWidth={1.5} />
          </PressableScale>

          {caption ? (
            <ThemedText variant="caption" style={styles.caption} numberOfLines={2}>
              {caption}
            </ThemedText>
          ) : (
            <View style={styles.caption} />
          )}

          <PressableScale
            onPress={() => goTo(index + 1)}
            disabled={index === frameCount - 1}
            accessibilityRole="button"
            accessibilityLabel="Next photo"
            style={[styles.step, index === frameCount - 1 && styles.stepDisabled]}
          >
            <ChevronRight color={palette.paper[50]} size={22} strokeWidth={1.5} />
          </PressableScale>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[2],
  },
  counter: {
    color: palette.paper[50],
  },
  image: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
  },
  step: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDisabled: {
    opacity: 0.3,
  },
  caption: {
    flex: 1,
    textAlign: 'center',
    color: palette.linen[200],
  },
});
