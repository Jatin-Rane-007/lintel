import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Linking, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Gutter, Screen } from '@/components/ui/screen';
import { useThemeColors } from '@/hooks/use-theme';
import { borderWidth, radius, spacing } from '@/theme/tokens';

/**
 * The map (§5.6). A phone gets the pin full-screen with the address above it
 * and one way out to a turn-by-turn app; the listing itself is the list
 * alternative, one tap back.
 */
export default function MapScreen() {
  const { latitude, longitude, title, address } = useLocalSearchParams<{
    latitude: string;
    longitude: string;
    title: string;
    address: string;
  }>();
  const router = useRouter();
  const colors = useThemeColors();

  const lat = Number(latitude);
  const lng = Number(longitude);
  const hasPin = Number.isFinite(lat) && Number.isFinite(lng);

  const mapUrl = hasPin
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.001}%2C${
        lat - 0.001
      }%2C${lng + 0.001}%2C${lat + 0.001}&layer=mapnik&marker=${lat}%2C${lng}`
    : null;

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <Gutter style={styles.header}>
        <View style={styles.headerRow}>
          <IconButton glyph={ArrowLeft} label="Back" variant="plain" onPress={() => router.back()} />
          <View style={styles.titles}>
            <ThemedText variant="h4" numberOfLines={1}>
              {title ?? 'Location'}
            </ThemedText>
            <ThemedText variant="caption" tone="textMuted" numberOfLines={1}>
              {address ?? ''}
            </ThemedText>
          </View>
        </View>
      </Gutter>
      <View style={[styles.rule, { backgroundColor: colors.borderHairline }]} />

      {mapUrl ? (
        <>
          <View style={styles.mapFrame}>
            <WebView source={{ uri: mapUrl }} style={styles.map} />
          </View>
          <Gutter style={styles.footer}>
            <Button
              label="Open in Google Maps"
              variant="secondary"
              large
              onPress={() =>
                Linking.openURL(`https://www.google.com/maps?q=${lat},${lng}`).catch(() => {
                  // Nothing else to offer: the pin above is still on screen.
                })
              }
            />
          </Gutter>
        </>
      ) : (
        <View style={styles.centered}>
          <ThemedText variant="h3">No pin for this listing.</ThemedText>
          <ThemedText variant="bodySm" tone="textSecondary" style={styles.centeredText}>
            The agent has not placed this home on the map yet. The address on the
            listing is still the right one.
          </ThemedText>
          <Button
            label="Back to the listing"
            variant="secondary"
            onPress={() => router.back()}
            style={styles.centeredAction}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing[2],
    paddingBottom: spacing[3],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginLeft: -spacing[3],
  },
  titles: {
    flex: 1,
    gap: 2,
  },
  rule: {
    height: borderWidth.hairline,
  },
  mapFrame: {
    flex: 1,
    margin: spacing[4],
    borderRadius: radius.xs,
    overflow: 'hidden',
    borderWidth: borderWidth.hairline,
    borderColor: 'transparent',
  },
  map: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[4],
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
  },
  centeredAction: {
    marginTop: spacing[4],
  },
});
