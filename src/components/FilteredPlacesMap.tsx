'use client';

import { useState } from 'react';
import { MapProvider } from './MapProvider';
import { WellLocation, LocationType, Place } from '@/types/location';
import dynamic from 'next/dynamic';
const MapComponentFR = dynamic(()=>import('./MapComponent'), { ssr: false });
interface FilteredPlacesMapProps {
  places: Place[];
  isLoading: boolean;
  error: Error | null;
  initialCenter?: [number, number];
  initialZoom?: number;
  className?: string;
}

export default function FilteredPlacesMap({
  places,
  isLoading,
  error,
  initialCenter = [39.4699, 0.3763], // Coordenadas de Sant Josep de sa Talaia
  initialZoom = 12,
  className = 'w-full h-96'
}: FilteredPlacesMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<WellLocation | null>(null);

  // Convertir places a WellLocation format con manejo de errores
  const wellLocations: WellLocation[] = places.map(place => {
    try {
      // Verificar que place tiene la estructura correcta
      if (!place || !place.geometry || !place.properties) {
        console.warn('Invalid place structure:', place)
        return null
      }

      // Verificar que las coordenadas existen
      const coordinates = place.geometry.coordinates
      if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
        console.warn('Invalid coordinates for place:', place)
        return null
      }

      return {
        id: place.id,
        name: place.properties.name || 'Sin nombre',
        description: place.properties.description || '',
        lat: coordinates[1], // GeoJSON usa [lng, lat]
        lng: coordinates[0],
        type: place.properties.type as LocationType || 'other',
        data: JSON.stringify(place.properties)
      }
    } catch (error) {
      console.error('Error mapping place:', place, error)
      return null
    }
  }).filter((location): location is WellLocation => location !== null);

  const handleLocationSelect = (location: WellLocation) => {
    setSelectedLocation(location);
  };

  const handleDrawCreated = (vals: { location: WellLocation | null; marker?: any }) => {
    console.log('Nuevo marcador creado:', vals);
  };

  if (isLoading) {
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
          <p className="text-red-500 text-sm">{error.message || 'Error desconocido'}</p>
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
      
      
    </div>
  );
}