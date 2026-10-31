/**
 * The shapes the app reads from Supabase. Kept as plain types rather than a
 * generated schema: the tables are small and the screens only ever need these
 * columns.
 */

export type PropertyType = 'apartment' | 'house' | 'villa' | 'studio';

export interface Property {
  id: string;
  title: string;
  description: string | null;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number | null;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  is_featured: boolean;
  is_sold: boolean;
  created_at: string;
}

/** A row of `saved_properties` with its property joined in. */
export interface SavedProperty {
  id: string;
  property_id: string;
  created_at: string;
  properties: Property;
}

/** The fields the create form writes. */
export type PropertyDraft = Pick<
  Property,
  | 'title'
  | 'description'
  | 'price'
  | 'type'
  | 'bedrooms'
  | 'bathrooms'
  | 'area_sqft'
  | 'address'
  | 'city'
  | 'latitude'
  | 'longitude'
  | 'images'
  | 'is_featured'
> & { is_sold: boolean };
