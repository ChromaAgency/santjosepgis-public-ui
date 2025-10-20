'use client';

import { useState } from 'react';
import MapComponentFR from './MapComponent';
import { MapProvider } from './MapProvider';
import { WellLocation, LocationType } from '@/types/location';
import { usePlaces } from '@/hooks/usePlaces';

interface PlacesMapProps {
  apiBaseUrl?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  typeFilter?: string;
  searchTerm?: string;
  className?: string;
}

export default function PlacesMap({
  apiBaseUrl,
  initialCenter = [38.9368719,1.2610344], // Coordenadas de Sant Josep de sa Talaia
  initialZoom = 12,
  typeFilter = 'all',
  searchTerm = '',
  className = 'w-full h-96'
}: PlacesMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<WellLocation | null>(null);
  
  // Usar React Query para obtener datos de lugares
  const { data: places = [], isLoading: loading, error, refetch } = usePlaces();

  // Convertir places a WellLocation format
  const wellLocations: WellLocation[] = places.map(place => ({
    id: place.id,
    name: place.properties.name,
    description: place.properties.description || '',
    lat: place.geometry.coordinates[1], // GeoJSON usa [lng, lat]
    lng: place.geometry.coordinates[0],
    type: place.properties.type as LocationType || 'other',
    data: JSON.stringify(place.properties)
  }));

  const handleLocationSelect = (location: WellLocation) => {
    setSelectedLocation(location);
  };

  const handleDrawCreated = (vals: { location: WellLocation | null; marker?: any }) => {
    // Manejar la creación de nuevos marcadores si es necesario
    console.log('Nuevo marcador creado:', vals);
  };

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Cargando lugares...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-red-50 rounded-lg border border-red-200`}>
        <div className="text-center p-4">
          <p className="text-red-600 font-medium mb-2">Error al cargar el mapa</p>
          <p className="text-red-500 text-sm mb-3">{error?.message || 'Error desconocido'}</p>
          <button
            onClick={() => refetch()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <MapProvider>
        <MapComponentFR
          initialMapLocation={initialCenter}
          initialZoom={initialZoom}
          locations={wellLocations}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
          onDrawCreated={handleDrawCreated}
          useMapControls={false}
          editCurrentMarkers={false}
          isAdding={false}
        />
      </MapProvider>
      
      {/* Panel de información del lugar seleccionado */}
      {selectedLocation && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {selectedLocation.name}
          </h3>
          <p className="text-gray-600 mb-2">{selectedLocation.description}</p>
          <div className="text-sm text-gray-500">
            <p><strong>Tipo:</strong> {selectedLocation.type}</p>
            <p><strong>Coordenadas:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</p>
          </div>
        </div>
      )}
    </div>
  );
}