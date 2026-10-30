import { create } from 'zustand';

import type { PropertyType } from '@/types';

/**
 * The filter set shared by the search screen and its filter sheet. It lives
 * outside the screen so leaving search and coming back does not silently drop
 * what the person chose (§5.2: filters survive navigation).
 */

export type PricePreset = {
  label: string;
  min: number | null;
  max: number | null;
};

/** The quick ranges the sheet offers above the numeric fields. */
export const PRICE_PRESETS: PricePreset[] = [
  { label: 'Under ₹50L', min: null, max: 5_000_000 },
  { label: '₹50L – ₹1Cr', min: 5_000_000, max: 10_000_000 },
  { label: '₹1Cr – ₹2Cr', min: 10_000_000, max: 20_000_000 },
  { label: 'Above ₹2Cr', min: 20_000_000, max: null },
];

export const PROPERTY_TYPES: { label: string; value: PropertyType | null }[] = [
  { label: 'Any', value: null },
  { label: 'Apartment', value: 'apartment' },
  { label: 'House', value: 'house' },
  { label: 'Villa', value: 'villa' },
  { label: 'Studio', value: 'studio' },
];

export const BED_OPTIONS: { label: string; value: number | null }[] = [
  { label: 'Any', value: null },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4+', value: 4 },
];

interface FilterState {
  search: string;
  type: PropertyType | null;
  bedrooms: number | null;
  minPrice: number | null;
  maxPrice: number | null;

  setSearch: (value: string) => void;
  setType: (value: PropertyType | null) => void;
  setBedrooms: (value: number | null) => void;
  setMinPrice: (value: number | null) => void;
  setMaxPrice: (value: number | null) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  search: '',
  type: null,
  bedrooms: null,
  minPrice: null,
  maxPrice: null,

  setSearch: (value) => set({ search: value }),
  setType: (value) => set({ type: value }),
  setBedrooms: (value) => set({ bedrooms: value }),
  setMinPrice: (value) => set({ minPrice: value }),
  setMaxPrice: (value) => set({ maxPrice: value }),
  // The search term belongs to the field, not to the filter sheet, so "Clear
  // all" leaves it alone.
  resetFilters: () =>
    set({ type: null, bedrooms: null, minPrice: null, maxPrice: null }),
}));

/** How many of the sheet's filters are on. Drives the count badge (§8.5). */
export function selectActiveFilterCount(state: FilterState): number {
  return [state.type, state.bedrooms, state.minPrice, state.maxPrice].filter(
    (value) => value !== null,
  ).length;
}
