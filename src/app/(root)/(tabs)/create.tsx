import { useSupabase } from '@/hooks/use-supabase';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { LocateFixed, Minus, Plus, X } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { Notice } from '@/components/ui/notice';
import { PageHeader } from '@/components/ui/page-header';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Gutter, Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { useThemeColors } from '@/hooks/use-theme';
import { borderWidth, control, radius, spacing } from '@/theme/tokens';
import type { PropertyType } from '@/types';

const TYPES: PropertyType[] = ['apartment', 'house', 'villa', 'studio'];
const MAX_PHOTOS = 6;
const MAX_PRICE = 999_999_999;

type FieldName = 'title' | 'price' | 'address' | 'city' | 'photos';
type Errors = Partial<Record<FieldName, string>>;

type Draft = {
  title: string;
  description: string;
  price: string;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area: string;
  address: string;
  city: string;
  latitude: string;
  longitude: string;
  isFeatured: boolean;
  /** Public URLs, in upload order. */
  images: string[];
  /** Local previews, index-aligned with `images`. */
  previews: string[];
};

const EMPTY_DRAFT: Draft = {
  title: '',
  description: '',
  price: '',
  type: 'apartment',
  bedrooms: 2,
  bathrooms: 2,
  area: '',
  address: '',
  city: '',
  latitude: '',
  longitude: '',
  isFeatured: false,
  images: [],
  previews: [],
};

/**
 * A form section: its name and lede, then its fields, closed by a hairline
 * above. The first section sits directly under the page header, so it drops
 * that rule rather than doubling the header's own.
 */
function Section({
  title,
  note,
  counter,
  divided = true,
  children,
}: {
  title: string;
  note?: string;
  counter?: string;
  divided?: boolean;
  children: React.ReactNode;
}) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.section,
        divided && { borderTopWidth: borderWidth.hairline, borderTopColor: colors.borderHairline },
      ]}
    >
      <View style={styles.sectionHead}>
        <View style={styles.sectionTitles}>
          <ThemedText variant="h3" accessibilityRole="header">
            {title}
          </ThemedText>
          {note ? (
            <ThemedText variant="bodySm" tone="textSecondary">
              {note}
            </ThemedText>
          ) : null}
        </View>
        {counter ? (
          <ThemedText variant="caption" tone="textMuted" style={styles.counter}>
            {counter}
          </ThemedText>
        ) : null}
      </View>
      {children}
    </View>
  );
}

/** − / value / + on a ruled control, at 48 px per target. */
function Stepper({
  label,
  value,
  onChange,
  min = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
}) {
  const colors = useThemeColors();

  return (
    <View style={styles.stepperField}>
      <ThemedText variant="label" tone="textMuted">
        {label}
      </ThemedText>
      <View
        style={[
          styles.stepper,
          { borderColor: colors.borderControl, backgroundColor: colors.surface },
        ]}
      >
        <PressableScale
          onPress={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          accessibilityRole="button"
          accessibilityLabel={`Fewer ${label.toLowerCase()}`}
          style={styles.stepperButton}
        >
          <Icon glyph={Minus} size="sm" tone={value <= min ? 'disabledText' : 'text'} />
        </PressableScale>

        <ThemedText variant="h4" tabular>
          {String(value)}
        </ThemedText>

        <PressableScale
          onPress={() => onChange(value + 1)}
          accessibilityRole="button"
          accessibilityLabel={`More ${label.toLowerCase()}`}
          style={styles.stepperButton}
        >
          <Icon glyph={Plus} size="sm" tone="text" />
        </PressableScale>
      </View>
    </View>
  );
}

/**
 * Add a listing (§5.10 inputs, §8.10). One scrolling sheet in the same ruled
 * language as the rest of the app: photos, then the home, then the money, then
 * the address, then the pin. Every field is labelled, every error is attached
 * to its field, and the section copy is what the person needs to decide — not
 * form-builder filler.
 */
export default function CreatePropertyScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const authSupabase = useSupabase();

  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (fields: Partial<Draft>) =>
    setDraft((previous) => ({ ...previous, ...fields }));

  const pickPhotos = async () => {
    setErrors((previous) => ({ ...previous, photos: undefined }));
    setFormError(null);

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setErrors((previous) => ({
        ...previous,
        photos: 'Photo access is off. Turn it on in your phone settings to add photos.',
      }));
      return;
    }

    const remaining = MAX_PHOTOS - draft.images.length;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.7,
      base64: true,
    });

    if (result.canceled) return;

    setUploading(true);

    const uploaded: string[] = [];
    const previews: string[] = [];

    for (const asset of result.assets) {
      if (!asset.base64) continue;

      try {
        const filename = `property_${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
        const bytes = Uint8Array.from(atob(asset.base64), (character) =>
          character.charCodeAt(0),
        );

        const { error } = await authSupabase.storage
          .from('property-images')
          .upload(filename, bytes, { contentType: 'image/jpeg', upsert: false });

        if (error) throw error;

        const { data } = authSupabase.storage
          .from('property-images')
          .getPublicUrl(filename);

        uploaded.push(data.publicUrl);
        previews.push(asset.uri);
      } catch {
        setFormError('One photo did not upload. The rest were kept — try that one again.');
      }
    }

    update({
      images: [...draft.images, ...uploaded],
      previews: [...draft.previews, ...previews],
    });
    setUploading(false);
  };

  const removePhoto = (index: number) =>
    update({
      images: draft.images.filter((_, position) => position !== index),
      previews: draft.previews.filter((_, position) => position !== index),
    });

  const detectLocation = async () => {
    setDetecting(true);
    setFormError(null);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        setFormError(
          'Location access is off, so we cannot read the pin. Type the coordinates, or turn location on in settings.',
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      update({
        latitude: position.coords.latitude.toFixed(6),
        longitude: position.coords.longitude.toFixed(6),
      });
    } catch {
      setFormError('We could not read your position. Type the coordinates instead.');
    } finally {
      setDetecting(false);
    }
  };

  const validate = (): Errors => {
    const next: Errors = {};
    const price = Number(draft.price);

    if (!draft.title.trim()) next.title = 'Give the home a name people will recognise.';
    if (!draft.price.trim()) next.price = 'Enter the asking price in rupees.';
    else if (!Number.isFinite(price) || price < 1)
      next.price = 'The price has to be a number above zero.';
    else if (price > MAX_PRICE)
      next.price = `Keep the price under ₹${MAX_PRICE.toLocaleString('en-IN')}.`;

    if (!draft.address.trim()) next.address = 'Add the street address.';
    if (!draft.city.trim()) next.city = 'Add the city.';
    if (draft.images.length === 0) next.photos = 'Add at least one photograph.';

    return next;
  };

  const submit = async () => {
    setFormError(null);

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);

    const { data, error } = await authSupabase
      .from('properties')
      .insert({
        title: draft.title.trim(),
        description: draft.description.trim(),
        price: Number(draft.price),
        type: draft.type,
        bedrooms: draft.bedrooms,
        bathrooms: draft.bathrooms,
        area_sqft: draft.area ? Number(draft.area) : null,
        address: draft.address.trim(),
        city: draft.city.trim(),
        latitude: draft.latitude ? Number(draft.latitude) : null,
        longitude: draft.longitude ? Number(draft.longitude) : null,
        images: draft.images,
        is_featured: draft.isFeatured,
        is_sold: false,
      })
      .select('id')
      .single();

    setSubmitting(false);

    if (error || !data) {
      setFormError('We could not publish this listing. Check your connection and try again.');
      return;
    }

    setDraft(EMPTY_DRAFT);
    router.replace({ pathname: '/(root)/property/[id]', params: { id: data.id } });
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior="padding" style={styles.root}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Gutter>
            <PageHeader
              title="Add a listing"
              note="Photos, price and place — the rest can be filled in later."
            />
          </Gutter>

          {formError ? (
            <Gutter style={styles.notice}>
              <Notice message={formError} />
            </Gutter>
          ) : null}

          <Gutter>
            <Section
              title="Photographs"
              note="The widest shot first — it becomes the cover."
              counter={`${draft.images.length} of ${MAX_PHOTOS}`}
              divided={false}
            >
              <View style={styles.tiles}>
                {draft.previews.map((uri, index) => (
                  <View key={`${uri}-${index}`} style={styles.tile}>
                    <Image
                      source={{ uri }}
                      style={styles.tileImage}
                      contentFit="cover"
                      transition={120}
                      accessibilityLabel={`Photo ${index + 1}`}
                    />
                    {index === 0 ? (
                      <View style={[styles.coverTag, { backgroundColor: colors.inverseBg }]}>
                        <ThemedText variant="label" tone="textInverse">
                          Cover
                        </ThemedText>
                      </View>
                    ) : null}
                    <PressableScale
                      onPress={() => removePhoto(index)}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove photo ${index + 1}`}
                      style={[styles.remove, { backgroundColor: colors.surface }]}
                    >
                      <Icon glyph={X} size="sm" tone="text" />
                    </PressableScale>
                  </View>
                ))}

                {draft.images.length < MAX_PHOTOS ? (
                  <PressableScale
                    onPress={pickPhotos}
                    disabled={uploading}
                    accessibilityRole="button"
                    accessibilityLabel="Add photographs"
                    style={[
                      styles.addTile,
                      { borderColor: colors.borderControl, backgroundColor: colors.surface },
                    ]}
                  >
                    {uploading ? (
                      <ActivityIndicator color={colors.text} />
                    ) : (
                      <>
                        <Icon glyph={Plus} size="lg" tone="textSecondary" />
                        <ThemedText variant="caption" tone="textMuted">
                          Add
                        </ThemedText>
                      </>
                    )}
                  </PressableScale>
                ) : null}
              </View>

              {errors.photos ? (
                <ThemedText variant="caption" tone="errorText">
                  {errors.photos}
                </ThemedText>
              ) : null}
            </Section>

            <Section title="The home">
              <TextField
                label="Name"
                placeholder="e.g. Willow Court, Unit 4B"
                value={draft.title}
                onChangeText={(value) => update({ title: value })}
                error={errors.title}
                autoCapitalize="words"
              />
              <TextField
                label="Description"
                placeholder="What is it like to live here? Light, rooms, the street."
                value={draft.description}
                onChangeText={(value) => update({ description: value })}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                style={styles.textarea}
              />
            </Section>

            <Section title="Price and size">
              <View style={styles.pair}>
                <View style={styles.pairItem}>
                  <TextField
                    label="Price (₹)"
                    placeholder="e.g. 9500000"
                    value={draft.price}
                    onChangeText={(value) => update({ price: value })}
                    error={errors.price}
                    keyboardType="number-pad"
                  />
                </View>
                <View style={styles.pairItem}>
                  <TextField
                    label="Area (ft²)"
                    placeholder="Optional"
                    value={draft.area}
                    onChangeText={(value) => update({ area: value })}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <View style={styles.typeField}>
                <ThemedText variant="label" tone="textMuted">
                  Type
                </ThemedText>
                <View style={styles.typeRow}>
                  {TYPES.map((option) => (
                    <Chip
                      key={option}
                      label={option}
                      selected={draft.type === option}
                      onPress={() => update({ type: option })}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.pair}>
                <View style={styles.pairItem}>
                  <Stepper
                    label="Bedrooms"
                    value={draft.bedrooms}
                    onChange={(value) => update({ bedrooms: value })}
                  />
                </View>
                <View style={styles.pairItem}>
                  <Stepper
                    label="Bathrooms"
                    value={draft.bathrooms}
                    onChange={(value) => update({ bathrooms: value })}
                  />
                </View>
              </View>
            </Section>

            <Section title="Where it is">
              <TextField
                label="Street address"
                placeholder="Building, street, neighbourhood"
                value={draft.address}
                onChangeText={(value) => update({ address: value })}
                error={errors.address}
              />
              <TextField
                label="City"
                placeholder="e.g. Mumbai"
                value={draft.city}
                onChangeText={(value) => update({ city: value })}
                error={errors.city}
                autoCapitalize="words"
              />
            </Section>

            <Section
              title="Pin"
              note="Used for the map on the listing. Optional, but worth it."
            >
              <Button
                label={detecting ? 'Reading your position' : 'Use my current position'}
                variant="secondary"
                onPress={detectLocation}
                disabled={detecting}
              />

              <View style={styles.pair}>
                <View style={styles.pairItem}>
                  <TextField
                    label="Latitude"
                    placeholder="e.g. 19.076"
                    value={draft.latitude}
                    onChangeText={(value) => update({ latitude: value })}
                    keyboardType="numbers-and-punctuation"
                  />
                </View>
                <View style={styles.pairItem}>
                  <TextField
                    label="Longitude"
                    placeholder="e.g. 72.877"
                    value={draft.longitude}
                    onChangeText={(value) => update({ longitude: value })}
                    keyboardType="numbers-and-punctuation"
                  />
                </View>
              </View>

              {draft.latitude || draft.longitude ? (
                <View style={styles.pinLine}>
                  <Icon glyph={LocateFixed} size="sm" tone="textMuted" />
                  <ThemedText variant="caption" tone="textMuted">
                    {`${draft.latitude || '—'}, ${draft.longitude || '—'}`}
                  </ThemedText>
                </View>
              ) : null}
            </Section>

            <Section title="Listing options">
              <View style={styles.chipRow}>
                <Chip
                  label="Feature on home"
                  selected={draft.isFeatured}
                  onPress={() => update({ isFeatured: !draft.isFeatured })}
                />
              </View>
              <ThemedText variant="caption" tone="textMuted">
                Featured homes appear in Today&apos;s folio on the home screen.
              </ThemedText>
            </Section>

            <View style={styles.submit}>
              <Button
                label={submitting ? 'Publishing' : 'List property'}
                large
                onPress={submit}
                disabled={submitting || uploading}
              />
            </View>
          </Gutter>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingTop: spacing[3],
    paddingBottom: spacing[10],
  },
  notice: {
    paddingTop: spacing[5],
  },
  section: {
    marginTop: spacing[8],
    paddingTop: spacing[5],
    gap: spacing[3],
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  sectionTitles: {
    flex: 1,
    gap: 2,
  },
  counter: {
    flexShrink: 1,
    textAlign: 'right',
  },
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  tile: {
    width: 96,
    height: 96,
    borderRadius: radius.xs,
    overflow: 'visible',
  },
  tileImage: {
    width: 96,
    height: 96,
    borderRadius: radius.xs,
  },
  coverTag: {
    position: 'absolute',
    left: spacing[1],
    bottom: spacing[1],
    paddingHorizontal: spacing[1],
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  remove: {
    position: 'absolute',
    top: -spacing[2],
    right: -spacing[2],
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: borderWidth.hairline,
  },
  addTile: {
    width: 96,
    height: 96,
    borderRadius: radius.xs,
    borderWidth: borderWidth.control,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
  },
  textarea: {
    height: 120,
    paddingTop: spacing[3],
  },
  pair: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  pairItem: {
    flex: 1,
  },
  stepperField: {
    gap: spacing[1],
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: control.field.default,
    borderWidth: borderWidth.control,
    borderRadius: radius.sm,
    paddingHorizontal: spacing[1],
  },
  stepperButton: {
    width: control.targetMin,
    height: control.targetMin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeField: {
    gap: spacing[1],
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  pinLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  submit: {
    paddingTop: spacing[10],
  },
});
