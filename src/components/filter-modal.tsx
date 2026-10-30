import { X } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from './themed-text';
import { Button } from './ui/button';
import { Chip } from './ui/chip';
import { IconButton } from './ui/icon-button';
import { TextField } from './ui/text-field';

import { useThemeColors } from '@/hooks/use-theme';
import { countLabel } from '@/lib/utils';
import {
  BED_OPTIONS,
  PRICE_PRESETS,
  PROPERTY_TYPES,
  useFilterStore,
} from '@/store/filter-store';
import { borderWidth, radius, spacing } from '@/theme/tokens';

export type FilterModalProps = {
  visible: boolean;
  onClose: () => void;
  /** How many homes the current filters return, for the footer's button. */
  resultCount: number;
  resultLoading?: boolean;
};

/** A group in the sheet: its name, then its controls. */
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  const colors = useThemeColors();

  return (
    <View style={[styles.group, { borderTopColor: colors.borderHairline }]}>
      <ThemedText variant="h3" accessibilityRole="header">
        {title}
      </ThemedText>
      {children}
    </View>
  );
}

function toFieldValue(value: number | null) {
  return value === null ? '' : String(value);
}

function toStoreValue(value: string) {
  const digits = value.replace(/[^\d]/g, '');
  return digits.length === 0 ? null : Number(digits);
}

/**
 * The all-filters sheet (§5.5). On a phone it is a full-height sheet rather
 * than a drawer: price, beds and type as chips and numeric fields, a sticky
 * footer whose primary button states the size of the result, and "Clear all"
 * as the quiet second action.
 */
export function FilterModal({
  visible,
  onClose,
  resultCount,
  resultLoading = false,
}: FilterModalProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  const type = useFilterStore((state) => state.type);
  const bedrooms = useFilterStore((state) => state.bedrooms);
  const minPrice = useFilterStore((state) => state.minPrice);
  const maxPrice = useFilterStore((state) => state.maxPrice);
  const setType = useFilterStore((state) => state.setType);
  const setBedrooms = useFilterStore((state) => state.setBedrooms);
  const setMinPrice = useFilterStore((state) => state.setMinPrice);
  const setMaxPrice = useFilterStore((state) => state.setMaxPrice);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  // The numeric fields follow the store, except while someone is typing in
  // them: `null` means "show what the store holds". A preset chip or "Clear
  // all" changes the store and the field follows on the next render, so no
  // effect has to copy state in a loop.
  const [minDraft, setMinDraft] = useState<string | null>(null);
  const [maxDraft, setMaxDraft] = useState<string | null>(null);

  const minText = minDraft ?? toFieldValue(minPrice);
  const maxText = maxDraft ?? toFieldValue(maxPrice);

  const activePreset = PRICE_PRESETS.findIndex(
    (preset) => preset.min === minPrice && preset.max === maxPrice,
  );

  const applyPreset = (min: number | null, max: number | null) => {
    setMinDraft(null);
    setMaxDraft(null);
    setMinPrice(min);
    setMaxPrice(max);
  };

  const clearAll = () => {
    setMinDraft(null);
    setMaxDraft(null);
    resetFilters();
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      <View style={[styles.root, { backgroundColor: colors.scrim }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close filters"
        />

        <KeyboardAvoidingView
          behavior="padding"
          style={styles.dock}
          pointerEvents="box-none"
        >
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.bg,
                paddingBottom: insets.bottom,
              },
            ]}
          >
            <View style={styles.header}>
              <ThemedText variant="h2" accessibilityRole="header">
                Filters
              </ThemedText>
              <IconButton glyph={X} label="Close filters" variant="plain" onPress={onClose} />
            </View>

            <View style={styles.headerRule}>
              <View style={[styles.headerEmber, { backgroundColor: colors.accentFill }]} />
              <View style={[styles.headerHairline, { backgroundColor: colors.borderHairline }]} />
            </View>

            <ScrollView
              style={styles.body}
              contentContainerStyle={styles.bodyContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Group title="Price">
                <View style={styles.chipRow}>
                  {PRICE_PRESETS.map((preset, index) => (
                    <Chip
                      key={preset.label}
                      label={preset.label}
                      selected={index === activePreset}
                      onPress={() =>
                        index === activePreset
                          ? applyPreset(null, null)
                          : applyPreset(preset.min, preset.max)
                      }
                    />
                  ))}
                </View>

                <View style={styles.fieldRow}>
                  <View style={styles.field}>
                    <TextField
                      label="Minimum"
                      placeholder="Any"
                      keyboardType="number-pad"
                      value={minText}
                      onChangeText={(value) => {
                        setMinDraft(value);
                        setMinPrice(toStoreValue(value));
                      }}
                      onBlur={() => setMinDraft(null)}
                    />
                  </View>
                  <View style={styles.field}>
                    <TextField
                      label="Maximum"
                      placeholder="Any"
                      keyboardType="number-pad"
                      value={maxText}
                      onChangeText={(value) => {
                        setMaxDraft(value);
                        setMaxPrice(toStoreValue(value));
                      }}
                      onBlur={() => setMaxDraft(null)}
                    />
                  </View>
                </View>
              </Group>

              <Group title="Bedrooms">
                <View style={styles.chipRow}>
                  {BED_OPTIONS.map((option) => (
                    <Chip
                      key={option.label}
                      label={option.label}
                      selected={bedrooms === option.value}
                      onPress={() => setBedrooms(option.value)}
                    />
                  ))}
                </View>
              </Group>

              <Group title="Property type">
                <View style={styles.chipRow}>
                  {PROPERTY_TYPES.map((option) => (
                    <Chip
                      key={option.label}
                      label={option.label}
                      selected={type === option.value}
                      onPress={() => setType(option.value)}
                    />
                  ))}
                </View>
              </Group>
            </ScrollView>

            <View style={[styles.footer, { borderTopColor: colors.borderHairline }]}>
              <Button label="Clear all" variant="tertiary" onPress={clearAll} />
              <Button
                label={resultLoading ? 'Searching…' : `Show ${countLabel(resultCount, 'home')}`}
                onPress={onClose}
                disabled={resultLoading}
                style={styles.footerAction}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dock: {
    width: '100%',
  },
  sheet: {
    maxHeight: '88%',
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacing[6],
    paddingRight: spacing[4],
    paddingTop: spacing[5],
    paddingBottom: spacing[3],
  },
  headerRule: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 2,
    paddingLeft: spacing[6],
  },
  headerEmber: {
    width: spacing[6],
    height: 2,
  },
  headerHairline: {
    flex: 1,
    height: borderWidth.hairline,
  },
  body: {
    flexGrow: 0,
  },
  bodyContent: {
    paddingBottom: spacing[6],
  },
  group: {
    borderTopWidth: borderWidth.hairline,
    marginTop: spacing[6],
    paddingTop: spacing[5],
    paddingHorizontal: spacing[6],
    gap: spacing[3],
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  fieldRow: {
    flexDirection: 'row',
    gap: spacing[3],
    paddingTop: spacing[1],
  },
  field: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
    borderTopWidth: borderWidth.hairline,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
  },
  footerAction: {
    flex: 1,
  },
});
