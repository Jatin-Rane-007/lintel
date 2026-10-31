import { useAuth } from '@clerk/expo';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart, Map as MapGlyph } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Lightbox } from '@/components/ui/lightbox';
import { Notice } from '@/components/ui/notice';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Gutter } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { TitleBlock } from '@/components/ui/title-block';
import { useSavedProperty } from '@/hooks/use-saved-property';
import { useSupabase } from '@/hooks/use-supabase';
import { useTheme, useThemeColors } from '@/hooks/use-theme';
import { supabase } from '@/lib/supabase';
import { formatArea, formatListed, formatPrice } from '@/lib/utils';
import { useUserStore } from '@/store/user-store';
import { borderWidth, layout, radius, spacing } from '@/theme/tokens';
import type { Property } from '@/types';

const AGENT_PHONE = '919999999999';

/**
 * The listing (§5.7). Full-bleed photographs, then the header block with the
 * reference, the price and the title block, then the prose and the pin. The
 * price and the one action stay docked at the foot, so the way to reach the
 * agent never scrolls away.
 */
export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useThemeColors();
  const { gradients } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { userId } = useAuth();
  const isAdmin = useUserStore((state) => state.isAdmin);
  const authSupabase = useSupabase();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [contactError, setContactError] = useState(false);

  const { isSaved, saveFailed, toggleSave } = useSavedProperty(id ?? '');

  // The listing is read once per id. State is set from the response callback,
  // never during the effect body, so a slow network shows the skeleton and
  // nothing else; a missing id falls straight through to "no longer here".
  useEffect(() => {
    if (!id) return;

    let active = true;

    supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        setProperty((data as Property | null) ?? null);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const markSold = () => {
    Alert.alert('Mark as sold?', 'The home stays on record with its last price.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Mark sold',
        onPress: async () => {
          await authSupabase.from('properties').update({ is_sold: true }).eq('id', id);
          setProperty((previous) => (previous ? { ...previous, is_sold: true } : previous));
        },
      },
    ]);
  };

  const remove = () => {
    Alert.alert('Delete this listing?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await authSupabase.from('properties').delete().eq('id', id);
          router.replace('/(root)/(tabs)');
        },
      },
    ]);
  };

  const contactAgent = () => {
    if (!property) return;

    const message = `Hello, I'm interested in Nº ${property.id
      .slice(0, 4)
      .toUpperCase()}, ${property.title}. Is it still available?`;

    Linking.openURL(`https://wa.me/${AGENT_PHONE}?text=${encodeURIComponent(message)}`).catch(
      () => setContactError(true),
    );
  };

  const onGalleryScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.bg }]}>
        <ActivityIndicator color={colors.accentFill} />
      </View>
    );
  }

  if (!property) {
    return (
      <View
        style={[
          styles.centered,
          { backgroundColor: colors.bg, paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <ThemedText variant="label" tone="textMuted">
          Listing
        </ThemedText>
        <ThemedText variant="h2" style={styles.centeredText}>
          This listing is no longer here.
        </ThemedText>
        <ThemedText variant="bodySm" tone="textSecondary" style={styles.centeredText}>
          It may have been taken down by the agent.
        </ThemedText>
        <Button
          label="Back to homes"
          onPress={() => router.replace('/(root)/(tabs)')}
          style={styles.centeredAction}
        />
      </View>
    );
  }

  const photos = property.images ?? [];
  const reference = `Nº ${property.id.slice(0, 4).toUpperCase()}`;
  const typeLabel = property.type ? property.type.toUpperCase() : 'HOME';
  const hasPin = property.latitude !== null && property.longitude !== null;

  const mapUrl = hasPin
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${
        (property.longitude as number) - 0.003
      }%2C${(property.latitude as number) - 0.003}%2C${
        (property.longitude as number) + 0.003
      }%2C${(property.latitude as number) + 0.003}&layer=mapnik&marker=${
        property.latitude
      }%2C${property.longitude}`
    : '';

  const isLong = (property.description?.length ?? 0) > 280;
  const description =
    expanded || !isLong
      ? property.description
      : `${property.description?.slice(0, 280).trimEnd()}…`;

  const specs = [
    { value: String(property.bedrooms), label: 'Beds' },
    { value: String(property.bathrooms), label: 'Baths' },
    ...(property.area_sqft ? [{ value: formatArea(property.area_sqft), label: 'ft²' }] : []),
    { value: property.type, label: 'Type' },
  ];

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 96 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gallery}>
          <FlatList
            data={photos}
            keyExtractor={(uri, index) => `${uri}-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onGalleryScroll}
            getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setViewerOpen(true)}
                accessibilityRole="button"
                accessibilityLabel={`Photograph of ${property.title}`}
              >
                <Image
                  source={{ uri: item }}
                  style={[styles.photo, { width, height: width * 0.75 }]}
                  contentFit="cover"
                  transition={160}
                />
              </Pressable>
            )}
            ListEmptyComponent={
              <View
                style={[
                  styles.photo,
                  styles.photoEmpty,
                  { width, height: width * 0.75, backgroundColor: colors.bgSunk },
                ]}
              >
                <ThemedText variant="caption" tone="textMuted">
                  No photograph on this listing
                </ThemedText>
              </View>
            }
          />

          <LinearGradient
            colors={gradients.mediaScrim}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            pointerEvents="none"
            style={[styles.topScrim, { height: insets.top + 96 }]}
          />

          {photos.length > 0 ? (
            <View style={[styles.frameCount, { backgroundColor: colors.surface }]}>
              <ThemedText variant="caption" tone="textSecondary" tabular>
                {`${activeIndex + 1} / ${photos.length}`}
              </ThemedText>
            </View>
          ) : null}

          <View style={[styles.floatingBar, { paddingTop: insets.top + spacing[2] }]}>
            <IconButton glyph={ArrowLeft} label="Back" onPress={() => router.back()} />
            <PressableScale
              onPress={toggleSave}
              accessibilityRole="button"
              accessibilityLabel={isSaved ? 'Remove from saved' : 'Save this home'}
              accessibilityState={{ selected: isSaved }}
              style={[styles.save, { backgroundColor: colors.surface }]}
            >
              <Icon
                glyph={Heart}
                size="md"
                tone={isSaved ? 'accentText' : 'text'}
                fill={isSaved ? colors.accentFill : 'transparent'}
              />
            </PressableScale>
          </View>
        </View>

        <Gutter style={styles.head}>
          <ThemedText variant="label" tone="textMuted">
            {`${reference} · ${typeLabel}`}
          </ThemedText>
          <ThemedText variant="h1" accessibilityRole="header">
            {property.title}
          </ThemedText>
          <ThemedText variant="meta" tone="textSecondary">
            {`${property.address}, ${property.city}`}
          </ThemedText>

          <View style={styles.priceRow}>
            <ThemedText variant="priceXl" tabular>
              {formatPrice(property.price)}
            </ThemedText>
            {property.is_featured ? <Badge label="Featured" showIcon={false} /> : null}
          </View>

          <TitleBlock cells={specs} />

          <ThemedText variant="caption" tone="textMuted">
            {formatListed(property.created_at)}
          </ThemedText>
        </Gutter>

        {saveFailed ? (
          <Gutter style={styles.notice}>
            <Notice
              message="This home could not be saved. Check your connection and tap the heart again."
            />
          </Gutter>
        ) : null}

        {property.is_sold ? (
          <Gutter style={styles.notice}>
            <Notice
              tone="info"
              message="No longer available. The figures above are the last ones on record."
            />
          </Gutter>
        ) : null}

        {contactError ? (
          <Gutter style={styles.notice}>
            <Notice
              message="We could not open WhatsApp. Check that it is installed and try again."
              actionLabel="Try again"
              onAction={contactAgent}
            />
          </Gutter>
        ) : null}

        <Gutter style={styles.section}>
          <SectionHeader title="About this home" />
          <ThemedText variant="body" tone="textSecondary" style={styles.reading}>
            {description || 'The agent has not written a description for this home yet.'}
          </ThemedText>
          {isLong ? (
            <Button
              label={expanded ? 'Show less' : 'Read the rest'}
              variant="tertiary"
              onPress={() => setExpanded((value) => !value)}
              style={styles.readMore}
            />
          ) : null}
        </Gutter>

        <Gutter style={styles.section}>
          <SectionHeader title="Location" />
          <ThemedText variant="body" tone="textSecondary" style={styles.reading}>
            {`${property.address}, ${property.city}`}
          </ThemedText>

          {hasPin ? (
            <PressableScale
              onPress={() =>
                router.push({
                  pathname: '/(root)/property/map',
                  params: {
                    latitude: String(property.latitude),
                    longitude: String(property.longitude),
                    title: property.title,
                    address: `${property.address}, ${property.city}`,
                  },
                })
              }
              accessibilityRole="button"
              accessibilityLabel="Open the map"
              style={[styles.mapFrame, { borderColor: colors.borderHairline }]}
            >
              <View style={styles.mapCanvas} pointerEvents="none">
                <WebView source={{ uri: mapUrl }} style={styles.map} scrollEnabled={false} />
              </View>
              <View style={[styles.mapAction, { backgroundColor: colors.surface }]}>
                <Icon glyph={MapGlyph} size="sm" tone="textSecondary" />
                <ThemedText variant="caption" tone="textSecondary">
                  Open the map
                </ThemedText>
              </View>
            </PressableScale>
          ) : (
            <ThemedText variant="caption" tone="textMuted">
              This listing has no pin yet — the address above is all we have.
            </ThemedText>
          )}
        </Gutter>

        {isAdmin && userId ? (
          <Gutter style={styles.section}>
            <SectionHeader title="Manage listing" note="Only agents see this" />
            <View style={styles.adminActions}>
              {!property.is_sold ? (
                <Button label="Mark as sold" variant="secondary" onPress={markSold} />
              ) : null}
              <Button label="Delete listing" variant="secondary" onPress={remove} />
            </View>
          </Gutter>
        ) : null}
      </ScrollView>

      <View
        style={[
          styles.actionBar,
          {
            backgroundColor: colors.bg,
            borderTopColor: colors.borderHairline,
            paddingBottom: Math.max(insets.bottom, spacing[3]),
          },
        ]}
      >
        <View style={styles.actionPrice}>
          <ThemedText variant="priceLg" tabular>
            {formatPrice(property.price)}
          </ThemedText>
          <ThemedText variant="caption" tone="textMuted">
            {property.is_sold ? 'Last price' : 'Asking price'}
          </ThemedText>
        </View>
        <Button
          label={property.is_sold ? 'Find similar homes' : 'Message the agent'}
          onPress={
            property.is_sold
              ? () => router.push('/(root)/(tabs)/search')
              : contactAgent
          }
          style={styles.actionButton}
        />
      </View>

      <Lightbox
        images={photos}
        visible={viewerOpen}
        onClose={() => setViewerOpen(false)}
        initialIndex={activeIndex}
        caption={`${reference} · ${property.title}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[6],
  },
  centeredText: {
    textAlign: 'center',
    maxWidth: layout.readingMax,
  },
  centeredAction: {
    marginTop: spacing[4],
  },
  gallery: {
    position: 'relative',
  },
  // The photo runs under the clock and the two controls, so the scrim carries
  // the status bar. It is functional, not decoration: it fades to nothing
  // before the photograph's own subject begins.
  topScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  photo: {
    width: '100%',
  },
  photoEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameCount: {
    position: 'absolute',
    left: spacing[6],
    bottom: spacing[4],
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  floatingBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[2],
  },
  save: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  head: {
    paddingTop: spacing[6],
    gap: spacing[2],
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
  },
  notice: {
    paddingTop: spacing[5],
  },
  section: {
    paddingTop: spacing[10],
    gap: spacing[3],
  },
  reading: {
    maxWidth: layout.readingMax,
  },
  readMore: {
    alignSelf: 'flex-start',
    marginLeft: -spacing[5],
  },
  mapFrame: {
    borderWidth: borderWidth.hairline,
    borderRadius: radius.xs,
    overflow: 'hidden',
    marginTop: spacing[1],
  },
  mapCanvas: {
    height: 200,
  },
  map: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  mapAction: {
    position: 'absolute',
    right: spacing[3],
    bottom: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.xs,
  },
  adminActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[4],
    borderTopWidth: borderWidth.hairline,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[3],
  },
  actionPrice: {
    gap: 0,
  },
  actionButton: {
    flexShrink: 1,
  },
});
