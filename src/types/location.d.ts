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
    id: number;
    name: string;
    description: string;
    type: string;
  };
}

export interface PlacesApiResponse {
  type: 'FeatureCollection';
  features: Place[];
}

export type LocationType = 'water_well' | 'office' | 'store' | 'warehouse' | 'other';

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