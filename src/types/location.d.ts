export interface WellLocation {
  id: number;
  name: string;
  description: string;
  lat: number;
  lng: number;
  type: LocationType;
  data: string;
}

export interface Place {
  type: 'Feature';
  id: number;
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    name: string;
    description: string;
    type: string;
    // La API pública incluye muchos campos adicionales bajo `properties.data`.
    // Permitimos propiedades extra sin tipar aquí.
  };
}

export interface PlacesApiResponse {
  type: 'FeatureCollection';
  features: Place[];
}

export type LocationType =
  | 'water_well'
  | 'office'
  | 'store'
  | 'warehouse'
  | 'bar'
  | 'restaurant'
  | 'hotel'
  | 'sport'
  | 'other';

export interface LocationFilter {
  typeFilter: LocationType[];
  searchTerm: string;
}

export interface MapConfig {
  center: [number, number];
  zoom: number;
}

export interface LocationFormData {
  name: string;
  description: string;
  lat: number;
  lng: number;
  type: LocationType;
  data: string;
}

export interface LocationFormErrors {
  name?: string;
  description?: string;
  lat?: string;
  lng?: string;
  type?: string;
  data?: string;
}